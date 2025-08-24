'use client';

import { useState } from 'react';
import {
  analyzeAIPersonality,
  getPersonalityIndicator,
  type AIPersonalityProfile,
} from '@/lib/ai/personality-analysis';

interface AIPersonalityIndicatorProps {
  interpretation: {
    interpretation: string;
    ancientWisdom?: string;
    guidance?: string;
    practicalAdvice?: string;
    spiritualInsight?: string;
    timing?: string;
    culturalContext?: string;
  };
  /** Show detailed analysis in tooltip/modal */
  showDetails?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export default function AIPersonalityIndicator({
  interpretation,
  showDetails = false,
  size = 'md',
}: AIPersonalityIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Analyze AI personality
  const profile = analyzeAIPersonality(interpretation);
  const indicator = getPersonalityIndicator(profile);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'h-8 w-8',
      text: 'text-xs',
      character: 'text-sm',
      badge: 'text-xs px-2 py-0.5',
    },
    md: {
      container: 'h-12 w-12',
      text: 'text-sm',
      character: 'text-lg',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      container: 'h-16 w-16',
      text: 'text-base',
      character: 'text-xl',
      badge: 'text-sm px-3 py-1',
    },
  };

  const config = sizeConfig[size];

  const formatPercentage = (value: number) => Math.round(value * 100);

  return (
    <div className="relative">
      {/* Main Indicator */}
      <div
        className={`${
          config.container
        } cursor-pointer transition-all duration-200 ${
          isExpanded ? 'scale-110' : 'hover:scale-105'
        }`}
        onClick={() => showDetails && setIsExpanded(!isExpanded)}
        title={
          showDetails
            ? `${indicator.description} - Click for details`
            : indicator.description
        }
      >
        <div
          className={`h-full w-full rounded-full bg-gradient-to-br ${indicator.color} 
                     flex items-center justify-center border-2 border-white/20 shadow-md`}
        >
          <span className={`font-bold text-white ${config.character}`}>
            {indicator.character}
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />

          {/* Details Panel */}
          <div
            className="absolute left-1/2 top-full z-50 mt-2 w-80 max-w-[90vw] 
                         -translate-x-1/2 transform rounded-xl border border-gentle-silver/30 
                         bg-white p-4 shadow-xl"
          >
            {/* Header */}
            <div className="mb-4 flex items-center gap-3 border-b border-gentle-silver/20 pb-3">
              <div
                className={`${config.container} bg-gradient-to-br ${indicator.color} 
                              flex items-center justify-center rounded-full`}
              >
                <span className={`font-bold text-white ${config.character}`}>
                  {indicator.character}
                </span>
              </div>
              <div>
                <h3 className="font-medium capitalize text-mountain-stone">
                  {indicator.archetype}
                </h3>
                <p className={`text-soft-gray ${config.text}`}>
                  {indicator.description}
                </p>
              </div>
            </div>

            {/* Personality Traits */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Personality Traits
              </h4>
              <div className="flex flex-wrap gap-1">
                {indicator.traits.map((trait, index) => (
                  <span
                    key={index}
                    className={`${config.badge} rounded-full bg-gentle-silver/20 
                               capitalize text-mountain-stone`}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Communication Style */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Communication Style
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-soft-gray">Tone:</span>
                  <span className="ml-1 capitalize">{profile.style.tone}</span>
                </div>
                <div>
                  <span className="text-soft-gray">Formality:</span>
                  <span className="ml-1 capitalize">
                    {profile.style.formality}
                  </span>
                </div>
                <div>
                  <span className="text-soft-gray">Depth:</span>
                  <span className="ml-1 capitalize">{profile.style.depth}</span>
                </div>
                <div>
                  <span className="text-soft-gray">Culture:</span>
                  <span className="ml-1 capitalize">
                    {profile.style.culturalEmbedding}
                  </span>
                </div>
              </div>
            </div>

            {/* Wisdom Traditions */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Wisdom Traditions
              </h4>
              <div className="space-y-1">
                {Object.entries(profile.tradition)
                  .filter(([_, value]) => value > 0.1)
                  .sort(([_, a], [__, b]) => b - a)
                  .map(([tradition, value]) => (
                    <div
                      key={tradition}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs capitalize text-soft-gray">
                        {tradition === 'confucian'
                          ? 'Confucian'
                          : tradition === 'taoist'
                            ? 'Taoist'
                            : tradition === 'buddhist'
                              ? 'Buddhist'
                              : 'Modern'}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gentle-silver/30">
                          <div
                            className="h-full rounded-full bg-flowing-water transition-all duration-300"
                            style={{ width: `${formatPercentage(value)}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs text-mountain-stone">
                          {formatPercentage(value)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Emotional Resonance */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Emotional Resonance
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(profile.resonance)
                  .filter(([_, value]) => value > 0.05)
                  .sort(([_, a], [__, b]) => b - a)
                  .map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center gap-2">
                      <span className="flex-1 text-xs capitalize text-soft-gray">
                        {emotion}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-12 overflow-hidden rounded-full bg-gentle-silver/30">
                          <div
                            className="h-full rounded-full bg-flowing-water"
                            style={{ width: `${formatPercentage(value)}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs text-mountain-stone">
                          {formatPercentage(value)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Primary Themes */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Primary Themes
              </h4>
              <div className="flex flex-wrap gap-1">
                <span
                  className={`${config.badge} rounded-full bg-flowing-water/20 
                                 font-medium capitalize text-flowing-water`}
                >
                  {profile.themes.primary}
                </span>
                {profile.themes.secondary && (
                  <span
                    className={`${config.badge} rounded-full bg-bamboo-green/20 
                                   capitalize text-bamboo-green`}
                  >
                    {profile.themes.secondary}
                  </span>
                )}
              </div>
            </div>

            {/* Key Phrases */}
            {profile.language.keyPhrases.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                  Key Phrases
                </h4>
                <div className="space-y-1">
                  {profile.language.keyPhrases.map((phrase, index) => (
                    <p key={index} className="text-xs italic text-soft-gray">
                      &ldquo;{phrase}&rdquo;
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute right-2 top-2 text-lg leading-none 
                       text-soft-gray transition-colors hover:text-mountain-stone"
              aria-label="Close details"
            >
              ×
            </button>
          </div>
        </>
      )}
    </div>
  );
}
