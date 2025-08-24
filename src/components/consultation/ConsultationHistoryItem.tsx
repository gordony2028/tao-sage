'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  type Consultation,
  updateConsultation,
} from '@/lib/supabase/consultations';
import { formatDistanceToNow } from 'date-fns';
import AIPersonalityIndicator from './AIPersonalityIndicator';
import EnhancedNotesEditor from './EnhancedNotesEditor';

interface ConsultationHistoryItemProps {
  consultation: Consultation;
  onUpdate: () => void;
}

export default function ConsultationHistoryItem({
  consultation,
  onUpdate,
}: ConsultationHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(consultation.notes || '');
  const [tags, setTags] = useState(consultation.tags.join(', '));
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async (
    newNotes: string,
    newTags: string[],
    culturalInsights?: any[]
  ) => {
    try {
      setSaving(true);
      setNotes(newNotes);
      setTags(newTags.join(', '));

      await updateConsultation(consultation.id, {
        notes: newNotes.trim() || null,
        tags: newTags,
      });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: date.toLocaleDateString() + ' at ' + date.toLocaleTimeString(),
    };
  };

  const dateInfo = formatDate(consultation.created_at);

  return (
    <Card variant={isExpanded ? 'elevated' : 'default'}>
      <CardContent className="pt-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flowing-water font-bold text-white">
                {consultation.hexagram_number}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-ink-black">
                  Hexagram {consultation.hexagram_number}:{' '}
                  {consultation.hexagram_name}
                </h3>
                <p className="text-sm text-soft-gray" title={dateInfo.absolute}>
                  {dateInfo.relative}
                </p>
              </div>
              {/* AI Personality Indicator */}
              <div className="flex items-center gap-2">
                <AIPersonalityIndicator
                  interpretation={consultation.interpretation}
                  showDetails={true}
                  size="md"
                />
                <div className="text-xs text-soft-gray">
                  <span className="block">AI Style</span>
                  <span className="font-medium">Click to analyze</span>
                </div>
              </div>
            </div>

            <p className="mb-3 italic text-gentle-silver">
              &ldquo;{consultation.question}&rdquo;
            </p>

            {/* Tags */}
            {consultation.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {consultation.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-stone-gray/20 px-2 py-1 text-xs text-mountain-stone"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'View Details'}
          </Button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 border-t border-stone-gray/20 pt-6">
            {/* Hexagram Visualization */}
            <div className="text-center">
              <div className="inline-block space-y-1">
                {consultation.lines.map((line, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex w-16 items-center justify-center">
                      {line === 6 ? (
                        // Old Yin (broken, changing)
                        <div className="flex gap-1">
                          <div className="h-1 w-6 bg-gentle-silver"></div>
                          <div className="h-1 w-6 bg-gentle-silver"></div>
                        </div>
                      ) : line === 7 ? (
                        // Young Yang (solid)
                        <div className="h-1 w-14 bg-ink-black"></div>
                      ) : line === 8 ? (
                        // Young Yin (broken)
                        <div className="flex gap-1">
                          <div className="h-1 w-6 bg-ink-black"></div>
                          <div className="h-1 w-6 bg-ink-black"></div>
                        </div>
                      ) : (
                        // Old Yang (solid, changing)
                        <div className="h-1 w-14 bg-gentle-silver"></div>
                      )}
                    </div>
                    {consultation.changing_lines.includes(6 - index) && (
                      <span className="text-xs font-medium text-flowing-water">
                        Changing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interpretation Sections */}
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 flex items-center text-lg font-medium text-mountain-stone">
                  <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-flowing-water text-xs font-bold text-white">
                    釋
                  </span>
                  Interpretation
                </h4>
                <p className="pl-9 leading-relaxed text-soft-gray">
                  {consultation.interpretation.interpretation}
                </p>
              </div>

              {consultation.interpretation.ancientWisdom && (
                <div>
                  <h4 className="mb-2 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-mountain-stone text-xs font-bold text-white">
                      智
                    </span>
                    Ancient Wisdom
                  </h4>
                  <p className="pl-9 leading-relaxed text-gentle-silver">
                    {consultation.interpretation.ancientWisdom}
                  </p>
                </div>
              )}

              {consultation.interpretation.guidance && (
                <div>
                  <h4 className="mb-2 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-bamboo-green text-xs font-bold text-white">
                      導
                    </span>
                    Guidance
                  </h4>
                  <p className="pl-9 leading-relaxed text-gentle-silver">
                    {consultation.interpretation.guidance}
                  </p>
                </div>
              )}

              {consultation.interpretation.practicalAdvice && (
                <div>
                  <h4 className="mb-2 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-sunset-gold text-xs font-bold text-white">
                      行
                    </span>
                    Practical Advice
                  </h4>
                  <p className="pl-9 leading-relaxed text-gentle-silver">
                    {consultation.interpretation.practicalAdvice}
                  </p>
                </div>
              )}

              {consultation.interpretation.spiritualInsight && (
                <div>
                  <h4 className="mb-2 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-flowing-water text-xs font-bold text-white">
                      靈
                    </span>
                    Spiritual Insight
                  </h4>
                  <p className="pl-9 leading-relaxed text-gentle-silver">
                    {consultation.interpretation.spiritualInsight}
                  </p>
                </div>
              )}

              {consultation.interpretation.timing && (
                <div>
                  <h4 className="mb-2 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-earth-brown text-xs font-bold text-white">
                      時
                    </span>
                    Timing & Flow
                  </h4>
                  <p className="pl-9 leading-relaxed text-gentle-silver">
                    {consultation.interpretation.timing}
                  </p>
                </div>
              )}

              {consultation.interpretation.culturalContext && (
                <div className="border-t border-stone-gray/20 pt-4">
                  <h4 className="mb-2 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-earth-brown text-xs font-bold text-white">
                      文
                    </span>
                    Cultural Context
                  </h4>
                  <p className="pl-9 leading-relaxed text-gentle-silver">
                    {consultation.interpretation.culturalContext}
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Notes Section */}
            <EnhancedNotesEditor
              consultation={consultation}
              onSave={handleSaveNotes}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              saving={saving}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
