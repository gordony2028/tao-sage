/**
 * User Preferences Types for Enhanced User Experience
 */

export interface AnimationPreferences {
  // General animation settings
  enableAnimations: boolean;
  reduceMotion: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';

  // Specific animation types
  coinCasting: boolean;
  hexagramTransitions: boolean;
  pageTransitions: boolean;
  loadingAnimations: boolean;
  hoverEffects: boolean;

  // Cultural animations
  traditionalEffects: boolean; // Zen-like fading, traditional transitions
  particleEffects: boolean; // Coin particle effects, flowing water
}

export interface PerformancePreferences {
  // Performance optimization levels
  performanceMode: 'eco' | 'balanced' | 'high-quality';

  // Resource management
  imageQuality: 'low' | 'medium' | 'high';
  enableCaching: boolean;
  preloadContent: boolean;

  // Background processing
  enableBackgroundSync: boolean;
  enablePrefetching: boolean;
  maxConcurrentRequests: number;

  // Battery optimization
  enableBatteryOptimization: boolean;
  reducedFrameRate: boolean;
}

export interface AccessibilityPreferences {
  // Visual accessibility
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'system' | 'serif' | 'sans-serif' | 'dyslexic-friendly';

  // Motor accessibility
  reducedTouchTargets: boolean;
  extendedTimeouts: boolean;
  stickyHover: boolean;

  // Cognitive accessibility
  simplifiedInterface: boolean;
  enableTooltips: boolean;
  showProgress: boolean;

  // Audio accessibility
  enableSoundEffects: boolean;
  enableAudioDescriptions: boolean;
  soundVolume: number; // 0-100
}

export interface CulturalPreferences {
  // Language and localization
  displayLanguage: 'en' | 'zh' | 'zh-TW' | 'ja' | 'ko';
  culturalContext: 'modern' | 'traditional' | 'balanced';

  // Chinese elements display
  showChineseCharacters: boolean;
  showPinyin: boolean;
  showTraditionalNames: boolean;

  // Wisdom style preferences
  interpretationStyle: 'concise' | 'detailed' | 'poetic';
  includeHistoricalContext: boolean;
  emphasizePhilosophy: 'confucian' | 'taoist' | 'buddhist' | 'balanced';

  // Calendar and timing
  useTraditionalCalendar: boolean;
  showSeasonalInsights: boolean;
}

export interface InterfacePreferences {
  // Theme and appearance
  theme: 'light' | 'dark' | 'auto' | 'sepia';
  colorScheme: 'default' | 'monochrome' | 'high-contrast' | 'warm' | 'cool';

  // Layout preferences
  sidebarPosition: 'left' | 'right' | 'hidden';
  compactMode: boolean;
  showLabels: boolean;

  // Information density
  informationDensity: 'minimal' | 'normal' | 'detailed';
  showAdvancedFeatures: boolean;

  // Navigation
  enableKeyboardShortcuts: boolean;
  enableGestures: boolean;
  showBreadcrumbs: boolean;
}

export interface PrivacyPreferences {
  // Data collection
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  shareUsageData: boolean;

  // Content sharing
  enablePublicProfile: boolean;
  shareConsultationInsights: boolean; // Anonymous aggregated insights

  // Storage preferences
  localStorageOnly: boolean;
  autoDeleteOldData: boolean;
  dataRetentionMonths: number;
}

export interface UserPreferences {
  // Core preference categories
  animation: AnimationPreferences;
  performance: PerformancePreferences;
  accessibility: AccessibilityPreferences;
  cultural: CulturalPreferences;
  interface: InterfacePreferences;
  privacy: PrivacyPreferences;

  // Meta preferences
  version: number;
  lastUpdated: string;
  presetName?: string; // For saving/loading preference presets
}

// Default preference values
export const DEFAULT_PREFERENCES: UserPreferences = {
  animation: {
    enableAnimations: true,
    reduceMotion: false,
    animationSpeed: 'normal',
    coinCasting: true,
    hexagramTransitions: true,
    pageTransitions: true,
    loadingAnimations: true,
    hoverEffects: true,
    traditionalEffects: true,
    particleEffects: true,
  },
  performance: {
    performanceMode: 'balanced',
    imageQuality: 'medium',
    enableCaching: true,
    preloadContent: true,
    enableBackgroundSync: true,
    enablePrefetching: false,
    maxConcurrentRequests: 3,
    enableBatteryOptimization: false,
    reducedFrameRate: false,
  },
  accessibility: {
    highContrast: false,
    fontSize: 'medium',
    fontFamily: 'system',
    reducedTouchTargets: false,
    extendedTimeouts: false,
    stickyHover: false,
    simplifiedInterface: false,
    enableTooltips: true,
    showProgress: true,
    enableSoundEffects: true,
    enableAudioDescriptions: false,
    soundVolume: 70,
  },
  cultural: {
    displayLanguage: 'en',
    culturalContext: 'balanced',
    showChineseCharacters: true,
    showPinyin: false,
    showTraditionalNames: true,
    interpretationStyle: 'detailed',
    includeHistoricalContext: true,
    emphasizePhilosophy: 'balanced',
    useTraditionalCalendar: false,
    showSeasonalInsights: true,
  },
  interface: {
    theme: 'auto',
    colorScheme: 'default',
    sidebarPosition: 'left',
    compactMode: false,
    showLabels: true,
    informationDensity: 'normal',
    showAdvancedFeatures: false,
    enableKeyboardShortcuts: true,
    enableGestures: true,
    showBreadcrumbs: true,
  },
  privacy: {
    enableAnalytics: true,
    enableCrashReporting: true,
    shareUsageData: false,
    enablePublicProfile: false,
    shareConsultationInsights: false,
    localStorageOnly: false,
    autoDeleteOldData: false,
    dataRetentionMonths: 24,
  },
  version: 1,
  lastUpdated: new Date().toISOString(),
};

// Preset configurations for common use cases
export const PREFERENCE_PRESETS: Record<string, Partial<UserPreferences>> = {
  accessibility: {
    accessibility: {
      highContrast: true,
      fontSize: 'large',
      fontFamily: 'dyslexic-friendly',
      simplifiedInterface: true,
      enableTooltips: true,
      showProgress: true,
      reducedTouchTargets: false,
      extendedTimeouts: true,
      stickyHover: true,
      enableSoundEffects: true,
      enableAudioDescriptions: true,
      soundVolume: 80,
    },
    animation: {
      enableAnimations: false,
      reduceMotion: true,
      animationSpeed: 'slow',
      coinCasting: false,
      hexagramTransitions: false,
      pageTransitions: false,
      loadingAnimations: false,
      hoverEffects: false,
      traditionalEffects: false,
      particleEffects: false,
    },
    interface: {
      theme: 'light',
      colorScheme: 'high-contrast',
      sidebarPosition: 'left',
      compactMode: false,
      showLabels: true,
      informationDensity: 'normal',
      showAdvancedFeatures: false,
      enableKeyboardShortcuts: true,
      enableGestures: false,
      showBreadcrumbs: true,
    },
  },

  performance: {
    performance: {
      performanceMode: 'eco',
      imageQuality: 'low',
      enableCaching: true,
      preloadContent: false,
      enableBackgroundSync: false,
      enablePrefetching: false,
      maxConcurrentRequests: 1,
      enableBatteryOptimization: true,
      reducedFrameRate: true,
    },
    animation: {
      enableAnimations: false,
      reduceMotion: true,
      animationSpeed: 'fast',
      coinCasting: false,
      hexagramTransitions: false,
      pageTransitions: false,
      loadingAnimations: false,
      hoverEffects: false,
      traditionalEffects: false,
      particleEffects: false,
    },
    interface: {
      theme: 'dark',
      colorScheme: 'cool',
      sidebarPosition: 'left',
      compactMode: true,
      showLabels: false,
      informationDensity: 'minimal',
      showAdvancedFeatures: false,
      enableKeyboardShortcuts: true,
      enableGestures: true,
      showBreadcrumbs: false,
    },
  },

  traditional: {
    cultural: {
      displayLanguage: 'zh',
      culturalContext: 'traditional',
      showChineseCharacters: true,
      showPinyin: true,
      showTraditionalNames: true,
      interpretationStyle: 'poetic',
      includeHistoricalContext: true,
      emphasizePhilosophy: 'balanced',
      useTraditionalCalendar: true,
      showSeasonalInsights: true,
    },
    animation: {
      enableAnimations: true,
      reduceMotion: false,
      traditionalEffects: true,
      particleEffects: true,
      animationSpeed: 'slow',
      coinCasting: true,
      hexagramTransitions: true,
      pageTransitions: true,
      hoverEffects: true,
      loadingAnimations: true,
    },
    interface: {
      theme: 'sepia',
      colorScheme: 'warm',
      sidebarPosition: 'left',
      compactMode: false,
      showLabels: true,
      informationDensity: 'detailed',
      showAdvancedFeatures: false,
      enableKeyboardShortcuts: true,
      enableGestures: false,
      showBreadcrumbs: true,
    },
  },

  modern: {
    cultural: {
      displayLanguage: 'en',
      culturalContext: 'modern',
      showChineseCharacters: false,
      showPinyin: false,
      showTraditionalNames: false,
      interpretationStyle: 'concise',
      includeHistoricalContext: false,
      emphasizePhilosophy: 'balanced',
      useTraditionalCalendar: false,
      showSeasonalInsights: false,
    },
    interface: {
      theme: 'auto',
      colorScheme: 'cool',
      sidebarPosition: 'right',
      compactMode: true,
      showLabels: false,
      informationDensity: 'minimal',
      showAdvancedFeatures: true,
      enableKeyboardShortcuts: true,
      enableGestures: true,
      showBreadcrumbs: false,
    },
    performance: {
      performanceMode: 'high-quality',
      imageQuality: 'high',
      enableCaching: true,
      enablePrefetching: true,
      preloadContent: true,
      enableBackgroundSync: true,
      enableBatteryOptimization: false,
      reducedFrameRate: false,
      maxConcurrentRequests: 5,
    },
  },
};

// Utility types for preference updates
export type PreferenceCategory = keyof UserPreferences;
export type PreferenceUpdate<T extends PreferenceCategory> = Partial<
  UserPreferences[T]
>;

export interface PreferenceChangeEvent<
  T extends PreferenceCategory = PreferenceCategory,
> {
  category: T;
  changes: PreferenceUpdate<T>;
  timestamp: string;
}
