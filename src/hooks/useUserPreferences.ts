/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  UserPreferences,
  DEFAULT_PREFERENCES,
  PREFERENCE_PRESETS,
  PreferenceCategory,
  PreferenceUpdate,
  PreferenceChangeEvent,
} from '@/types/preferences';

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;

  // Update methods
  updatePreferences: <T extends PreferenceCategory>(
    category: T,
    updates: PreferenceUpdate<T>
  ) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  applyPreset: (presetName: keyof typeof PREFERENCE_PRESETS) => Promise<void>;

  // Utility methods
  exportPreferences: () => string;
  importPreferences: (json: string) => Promise<void>;

  // Category-specific getters
  getAnimationPreferences: () => UserPreferences['animation'];
  getPerformancePreferences: () => UserPreferences['performance'];
  getAccessibilityPreferences: () => UserPreferences['accessibility'];
  getCulturalPreferences: () => UserPreferences['cultural'];
  getInterfacePreferences: () => UserPreferences['interface'];
  getPrivacyPreferences: () => UserPreferences['privacy'];
}

const PREFERENCES_STORAGE_KEY = 'tao-sage-preferences';
const PREFERENCES_VERSION = 1;

export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load preferences on mount and user change
  useEffect(() => {
    loadPreferences();
  }, [user]);

  // Apply system-level preferences for accessibility
  useEffect(() => {
    applySystemPreferences(preferences);
  }, [preferences]);

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (user) {
        // Try to load from Supabase first
        const { data, error: dbError } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .single();

        if (data?.preferences) {
          setPreferences(mergeWithDefaults(data.preferences));
          return;
        } else if (dbError && dbError.code !== 'PGRST116') {
          console.warn('Failed to load preferences from database:', dbError);
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.version === PREFERENCES_VERSION) {
            setPreferences(mergeWithDefaults(parsed));

            // If user is logged in, sync to database
            if (user) {
              await savePreferencesToDatabase(parsed);
            }
            return;
          }
        } catch (e) {
          console.warn('Failed to parse stored preferences:', e);
        }
      }

      // Use defaults
      setPreferences(DEFAULT_PREFERENCES);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load preferences'
      );
      setPreferences(DEFAULT_PREFERENCES);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const savePreferences = useCallback(
    async (newPreferences: UserPreferences) => {
      const updatedPreferences = {
        ...newPreferences,
        version: PREFERENCES_VERSION,
        lastUpdated: new Date().toISOString(),
      };

      // Always save to localStorage for immediate persistence
      try {
        localStorage.setItem(
          PREFERENCES_STORAGE_KEY,
          JSON.stringify(updatedPreferences)
        );
      } catch (e) {
        console.warn('Failed to save preferences to localStorage:', e);
      }

      // Save to database if user is logged in
      if (user) {
        await savePreferencesToDatabase(updatedPreferences);
      }

      setPreferences(updatedPreferences);

      // Emit preference change event for other components
      window.dispatchEvent(
        new CustomEvent('preferencesChanged', {
          detail: updatedPreferences,
        })
      );
    },
    [user]
  );

  const savePreferencesToDatabase = useCallback(
    async (prefs: UserPreferences) => {
      if (!user) return;

      try {
        const { error } = await supabase.from('user_preferences').upsert(
          {
            user_id: user.id,
            preferences: prefs,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          }
        );

        if (error) {
          console.error('Failed to save preferences to database:', error);
        }
      } catch (err) {
        console.error('Error saving preferences:', err);
      }
    },
    [user]
  );

  const updatePreferences = useCallback(
    async <T extends PreferenceCategory>(
      category: T,
      updates: PreferenceUpdate<T>
    ) => {
      const newPreferences = {
        ...preferences,
        [category]: {
          ...(preferences[category] as any),
          ...(updates as any),
        },
      };

      await savePreferences(newPreferences);

      // Emit specific category change event
      const changeEvent: PreferenceChangeEvent<T> = {
        category,
        changes: updates,
        timestamp: new Date().toISOString(),
      };

      window.dispatchEvent(
        new CustomEvent('preferencesCategoryChanged', {
          detail: changeEvent,
        })
      );
    },
    [preferences, savePreferences]
  );

  const resetToDefaults = useCallback(async () => {
    await savePreferences(DEFAULT_PREFERENCES);
  }, [savePreferences]);

  const applyPreset = useCallback(
    async (presetName: keyof typeof PREFERENCE_PRESETS) => {
      const preset = PREFERENCE_PRESETS[presetName];
      if (!preset) {
        throw new Error(`Unknown preset: ${presetName}`);
      }

      const newPreferences = mergePreferences(preferences, preset);
      newPreferences.presetName = presetName;

      await savePreferences(newPreferences);
    },
    [preferences, savePreferences]
  );

  const exportPreferences = useCallback(() => {
    return JSON.stringify(preferences, null, 2);
  }, [preferences]);

  const importPreferences = useCallback(
    async (json: string) => {
      try {
        const imported = JSON.parse(json);
        if (!imported || typeof imported !== 'object') {
          throw new Error('Invalid preferences format');
        }

        const merged = mergeWithDefaults(imported);
        await savePreferences(merged);
      } catch (err) {
        throw new Error(
          'Failed to import preferences: ' +
            (err instanceof Error ? err.message : 'Unknown error')
        );
      }
    },
    [savePreferences]
  );

  // Category-specific getters
  const getAnimationPreferences = useCallback(
    () => preferences.animation,
    [preferences.animation]
  );
  const getPerformancePreferences = useCallback(
    () => preferences.performance,
    [preferences.performance]
  );
  const getAccessibilityPreferences = useCallback(
    () => preferences.accessibility,
    [preferences.accessibility]
  );
  const getCulturalPreferences = useCallback(
    () => preferences.cultural,
    [preferences.cultural]
  );
  const getInterfacePreferences = useCallback(
    () => preferences.interface,
    [preferences.interface]
  );
  const getPrivacyPreferences = useCallback(
    () => preferences.privacy,
    [preferences.privacy]
  );

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    resetToDefaults,
    applyPreset,
    exportPreferences,
    importPreferences,
    getAnimationPreferences,
    getPerformancePreferences,
    getAccessibilityPreferences,
    getCulturalPreferences,
    getInterfacePreferences,
    getPrivacyPreferences,
  };
}

// Utility functions
function mergeWithDefaults(stored: Partial<UserPreferences>): UserPreferences {
  return mergePreferences(DEFAULT_PREFERENCES, stored);
}

function mergePreferences(
  base: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...base };

  for (const [key, value] of Object.entries(updates)) {
    if (key === 'version' || key === 'lastUpdated' || key === 'presetName') {
      (merged as any)[key] = value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      (merged as any)[key] = {
        ...(merged[key as keyof UserPreferences] as any),
        ...(value as any),
      };
    }
  }

  return merged;
}

function applySystemPreferences(preferences: UserPreferences) {
  // Apply CSS custom properties for theming
  const root = document.documentElement;

  // Animation preferences
  if (
    preferences.animation.reduceMotion ||
    !preferences.animation.enableAnimations
  ) {
    root.style.setProperty('--animation-duration', '0ms');
    root.style.setProperty('--transition-duration', '0ms');
  } else {
    const speedMultiplier =
      preferences.animation.animationSpeed === 'slow'
        ? 1.5
        : preferences.animation.animationSpeed === 'fast'
          ? 0.7
          : 1;
    root.style.setProperty(
      '--animation-duration',
      `${300 * speedMultiplier}ms`
    );
    root.style.setProperty(
      '--transition-duration',
      `${150 * speedMultiplier}ms`
    );
  }

  // Font size
  const fontSizes = {
    small: '14px',
    medium: '16px',
    large: '18px',
    'extra-large': '20px',
  };
  root.style.setProperty(
    '--base-font-size',
    fontSizes[preferences.accessibility.fontSize]
  );

  // High contrast mode
  if (preferences.accessibility.highContrast) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }

  // Theme application
  document.body.className = document.body.className
    .replace(/theme-\w+/g, '')
    .replace(/color-scheme-\w+/g, '');

  document.body.classList.add(`theme-${preferences.interface.theme}`);
  document.body.classList.add(
    `color-scheme-${preferences.interface.colorScheme}`
  );

  // Compact mode
  if (preferences.interface.compactMode) {
    document.body.classList.add('compact-mode');
  } else {
    document.body.classList.remove('compact-mode');
  }

  // Reduced motion for accessibility
  if (preferences.animation.reduceMotion) {
    document.body.classList.add('reduce-motion');
  } else {
    document.body.classList.remove('reduce-motion');
  }
}
