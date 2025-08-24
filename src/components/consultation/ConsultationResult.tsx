'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import HexagramDisplay from './HexagramDisplay';
import type { Hexagram, AIInterpretation } from '@/types/iching';

interface ConsultationResultProps {
  question: string;
  hexagram: Hexagram;
  interpretation: AIInterpretation | null;
  isLoading?: boolean;
  onStartOver: () => void;
}

export default function ConsultationResult({
  question,
  hexagram,
  interpretation,
  isLoading = false,
  onStartOver,
}: ConsultationResultProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Question Context */}
      <Card variant="default">
        <CardContent className="pt-6">
          <h2 className="mb-2 text-lg font-medium text-mountain-stone">
            Your Question:
          </h2>
          <p className="italic text-soft-gray">&ldquo;{question}&rdquo;</p>
        </CardContent>
      </Card>

      {/* Hexagram Display */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-center">Your Hexagram</CardTitle>
        </CardHeader>
        <CardContent>
          <HexagramDisplay hexagram={hexagram} size="lg" showDetails={true} />
        </CardContent>
      </Card>

      {/* AI Interpretation */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Guidance & Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
              <p className="text-soft-gray">Consulting the ancient wisdom...</p>
            </div>
          ) : interpretation ? (
            <div className="space-y-6">
              {/* Main Interpretation */}
              <div>
                <h3 className="mb-3 flex items-center text-lg font-medium text-mountain-stone">
                  <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-flowing-water text-sm font-bold text-white">
                    釋
                  </span>
                  Interpretation
                </h3>
                <p className="pl-11 leading-relaxed text-soft-gray">
                  {interpretation.interpretation}
                </p>
              </div>

              {/* Ancient Wisdom */}
              {interpretation.ancientWisdom && (
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-mountain-stone text-sm font-bold text-white">
                      智
                    </span>
                    Ancient Wisdom
                  </h3>
                  <p className="pl-11 leading-relaxed text-gentle-silver">
                    {interpretation.ancientWisdom}
                  </p>
                </div>
              )}

              {/* Guidance */}
              {interpretation.guidance && (
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-bamboo-green text-sm font-bold text-white">
                      導
                    </span>
                    Guidance
                  </h3>
                  <p className="pl-11 leading-relaxed text-gentle-silver">
                    {interpretation.guidance}
                  </p>
                </div>
              )}

              {/* Practical Advice */}
              {interpretation.practicalAdvice && (
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-sunset-gold text-sm font-bold text-white">
                      行
                    </span>
                    Practical Advice
                  </h3>
                  <p className="pl-11 leading-relaxed text-gentle-silver">
                    {interpretation.practicalAdvice}
                  </p>
                </div>
              )}

              {/* Spiritual Insight */}
              {interpretation.spiritualInsight && (
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-flowing-water text-sm font-bold text-white">
                      靈
                    </span>
                    Spiritual Insight
                  </h3>
                  <p className="pl-11 leading-relaxed text-gentle-silver">
                    {interpretation.spiritualInsight}
                  </p>
                </div>
              )}

              {/* Timing */}
              {interpretation.timing && (
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-earth-brown text-sm font-bold text-white">
                      時
                    </span>
                    Timing & Flow
                  </h3>
                  <p className="pl-11 leading-relaxed text-gentle-silver">
                    {interpretation.timing}
                  </p>
                </div>
              )}

              {/* Cultural Context */}
              {interpretation.culturalContext && (
                <div className="border-t border-stone-gray/20 pt-6">
                  <h3 className="mb-3 flex items-center text-lg font-medium text-ink-black">
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-earth-brown text-sm font-bold text-white">
                      文
                    </span>
                    Cultural Context
                  </h3>
                  <p className="pl-11 leading-relaxed text-gentle-silver">
                    {interpretation.culturalContext}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mb-4 text-4xl">🔮</div>
              <h3 className="mb-2 text-lg font-medium text-mountain-stone">
                Hexagram Generated
              </h3>
              <p className="mb-4 text-soft-gray">
                Your hexagram has been cast successfully. The ancient symbols
                above hold guidance for your question.
              </p>
              <p className="text-sm text-soft-gray">
                Note: AI interpretation is temporarily unavailable, but the
                traditional hexagram meanings can still provide valuable
                insights.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Changing Lines Explanation */}
      {hexagram.changingLines.length > 0 && (
        <Card variant="default">
          <CardContent className="pt-6">
            <h3 className="mb-3 font-medium text-mountain-stone">
              About Your Changing Lines
            </h3>
            <p className="text-sm text-soft-gray">
              Your hexagram has {hexagram.changingLines.length} changing line
              {hexagram.changingLines.length > 1 ? 's' : ''}
              (positions: {hexagram.changingLines.join(', ')}). In I Ching
              tradition, changing lines represent areas of your life that are in
              transition or transformation. They suggest where movement and
              change are most likely to occur in relation to your question.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button onClick={onStartOver} variant="outline" size="lg">
          Ask Another Question
        </Button>
        <Button variant="secondary" size="lg">
          Save This Consultation
        </Button>
      </div>

      {/* Cultural Attribution */}
      <Card variant="default">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-soft-gray">
              <strong>Cultural Respect:</strong> This interpretation honors the
              3,000-year tradition of the I Ching (易經). We approach this
              ancient Chinese wisdom with deep respect for its cultural
              significance and philosophical depth.
            </p>
            <p className="mt-2 text-xs text-soft-gray">
              Generated with modern AI to enhance traditional wisdom • Always
              consult the classical texts for deeper study
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
