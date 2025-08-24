'use client';

/**
 * Offline Consultation Wrapper
 * 
 * Intelligently handles consultation creation in both online and offline scenarios:
 * - Online: Uses full AI-powered consultation service
 * - Offline: Provides traditional I Ching wisdom without AI
 * - Seamless switching between modes
 * - Offline indicator with cultural context
 */

import React, { useState, useCallback } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { createOfflineConsultation } from '@/lib/consultation/offline-service';
import type { Consultation, Hexagram } from '@/types/iching';

interface OfflineConsultationWrapperProps {
  /** Function to call for online consultations */
  onOnlineConsultation: (question: string, userId: string) => Promise<{
    consultation: Consultation;
    hexagram: Hexagram;
    interpretation: any;
  }>;
  /** User ID for consultation */
  userId: string;
  /** Function called when consultation is created */
  onConsultationComplete: (result: {
    consultation: Consultation;
    hexagram: Hexagram;
    interpretation: any;
    isOffline?: boolean;
  }) => void;
  /** Children to render (consultation form/UI) */
  children: (props: {
    isOffline: boolean;
    createConsultation: (question: string) => Promise<void>;
    isCreating: boolean;
  }) => React.ReactNode;
}

export default function OfflineConsultationWrapper({
  onOnlineConsultation,
  userId,
  onConsultationComplete,
  children,
}: OfflineConsultationWrapperProps) {
  const { isOffline, isSyncing, triggerSync } = useOfflineStatus();
  const [isCreating, setIsCreating] = useState(false);

  const createConsultation = useCallback(async (question: string) => {
    if (!question.trim()) {
      throw new Error('Please enter a question for the I Ching');
    }

    setIsCreating(true);
    
    try {
      if (isOffline) {
        // Create offline consultation
        const result = await createOfflineConsultation({
          question,
          userId,
        });
        
        onConsultationComplete({
          consultation: result.consultation,
          hexagram: result.hexagram,
          interpretation: result.consultation.interpretation,
          isOffline: true,
        });
      } else {
        // Create online consultation with AI
        const result = await onOnlineConsultation(question, userId);
        
        onConsultationComplete({
          consultation: result.consultation,
          hexagram: result.hexagram,
          interpretation: result.interpretation,
          isOffline: false,
        });
      }
    } catch (error) {
      console.error('Consultation creation failed:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [isOffline, userId, onOnlineConsultation, onConsultationComplete]);

  return (
    <div className="relative">
      {/* Offline Status Indicator */}
      {isOffline && (
        <OfflineIndicator 
          isSyncing={isSyncing}
          onSyncClick={triggerSync}
        />
      )}
      
      {/* Main consultation interface */}
      {children({
        isOffline,
        createConsultation,
        isCreating,
      })}
    </div>
  );
}

/**
 * Offline indicator with cultural context
 */
function OfflineIndicator({ 
  isSyncing,
  onSyncClick 
}: {
  isSyncing: boolean;
  onSyncClick: () => void;
}) {
  return (
    <div className="mb-4 rounded-lg bg-gradient-to-r from-mountain-stone to-earth-brown p-4 text-cloud-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">☯</div>
          <div>
            <div className="font-medium">
              Offline Mode - Traditional Wisdom
            </div>
            <div className="text-sm opacity-90">
              Using ancient I Ching guidance without modern AI enhancement
            </div>
          </div>
        </div>
        
        {isSyncing ? (
          <div className="flex items-center space-x-2 text-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            <span>Syncing...</span>
          </div>
        ) : (
          <button
            onClick={onSyncClick}
            className="rounded bg-white/20 px-3 py-1 text-sm transition-colors hover:bg-white/30"
          >
            Sync when online
          </button>
        )}
      </div>
      
      <div className="mt-3 text-xs opacity-75">
        <div className="mb-1">In offline mode, you receive:</div>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Traditional hexagram interpretations</li>
          <li>Classical I Ching wisdom</li>
          <li>Changing lines guidance</li>
          <li>Cultural context and meaning</li>
        </ul>
        <div className="mt-2">
          Your consultations are saved locally and will sync when connection returns.
        </div>
      </div>
    </div>
  );
}