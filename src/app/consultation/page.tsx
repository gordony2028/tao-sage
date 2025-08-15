'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import QuestionForm from '@/components/consultation/QuestionForm';
import CoinCasting from '@/components/consultation/CoinCasting';
import HexagramDisplay from '@/components/consultation/HexagramDisplay';
import ConsultationResult from '@/components/consultation/ConsultationResult';
import type { Hexagram, AIInterpretation } from '@/types/iching';

type ConsultationStep = 'question' | 'casting' | 'result';

export default function ConsultationPage() {
  const [currentStep, setCurrentStep] = useState<ConsultationStep>('question');
  const [question, setQuestion] = useState('');
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [interpretation, setInterpretation] = useState<AIInterpretation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionSubmit = (questionText: string) => {
    setQuestion(questionText);
    setCurrentStep('casting');
  };

  const handleCastingComplete = async (generatedHexagram: Hexagram) => {
    setHexagram(generatedHexagram);
    setIsLoading(true);

    try {
      // Call our backend consultation service
      const response = await fetch('/api/consultation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Demo UUID - TODO: Replace with actual user ID from auth
          hexagram: {
            number: generatedHexagram.number,
            name: generatedHexagram.name,
            lines: generatedHexagram.lines,
            changingLines: generatedHexagram.changingLines,
          },
          metadata: {
            method: 'digital_coins',
            userAgent: navigator.userAgent,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create consultation');
      }

      const result = await response.json();
      setInterpretation(result.interpretation);
      setCurrentStep('result');
    } catch (error) {
      console.error('Consultation error:', error);
      // Show the hexagram without AI interpretation but with a message
      setInterpretation({
        interpretation:
          'Unable to generate AI interpretation at this time. Please reflect on your hexagram using traditional I Ching wisdom.',
        guidance:
          'Focus on the meaning of your hexagram and any changing lines. The I Ching speaks through symbols and patterns - trust your intuition to find meaning in this reading.',
        practicalAdvice:
          'Consider journaling about your question and the hexagram you received. Traditional I Ching wisdom can still guide you even without AI assistance.',
        culturalContext:
          'The I Ching has provided guidance for over 3,000 years without AI. The patterns and symbols contain wisdom that transcends technology.',
      });
      setCurrentStep('result');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('question');
    setQuestion('');
    setHexagram(null);
    setInterpretation(null);
  };

  return (
    <Layout>
      <div className="px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-mountain-stone">
              I Ching Consultation
            </h1>
            <p className="mb-6 text-lg text-soft-gray">
              Ask your question and receive guidance through the ancient wisdom
              of the I Ching
            </p>

            {/* Progress indicator */}
            <div className="mb-8 flex items-center justify-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === 'question'
                    ? 'text-flowing-water'
                    : currentStep === 'casting' || currentStep === 'result'
                      ? 'text-bamboo-green'
                      : 'text-soft-gray'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    currentStep === 'question'
                      ? 'border-flowing-water bg-flowing-water text-white'
                      : currentStep === 'casting' || currentStep === 'result'
                        ? 'border-bamboo-green bg-bamboo-green text-white'
                        : 'border-soft-gray'
                  }`}
                >
                  1
                </div>
                <span className="font-medium">Question</span>
              </div>

              <div
                className={`h-1 w-8 ${
                  currentStep === 'casting' || currentStep === 'result'
                    ? 'bg-bamboo-green'
                    : 'bg-stone-gray'
                }`}
              ></div>

              <div
                className={`flex items-center space-x-2 ${
                  currentStep === 'casting'
                    ? 'text-flowing-water'
                    : currentStep === 'result'
                      ? 'text-bamboo-green'
                      : 'text-soft-gray'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    currentStep === 'casting'
                      ? 'border-flowing-water bg-flowing-water text-white'
                      : currentStep === 'result'
                        ? 'border-bamboo-green bg-bamboo-green text-white'
                        : 'border-soft-gray'
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Casting</span>
              </div>

              <div
                className={`h-1 w-8 ${
                  currentStep === 'result' ? 'bg-bamboo-green' : 'bg-stone-gray'
                }`}
              ></div>

              <div
                className={`flex items-center space-x-2 ${
                  currentStep === 'result'
                    ? 'text-flowing-water'
                    : 'text-soft-gray'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    currentStep === 'result'
                      ? 'border-flowing-water bg-flowing-water text-white'
                      : 'border-soft-gray'
                  }`}
                >
                  3
                </div>
                <span className="font-medium">Guidance</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-96">
            {currentStep === 'question' && (
              <QuestionForm onSubmit={handleQuestionSubmit} />
            )}

            {currentStep === 'casting' && (
              <CoinCasting
                question={question}
                onComplete={handleCastingComplete}
              />
            )}

            {currentStep === 'result' && hexagram && (
              <ConsultationResult
                question={question}
                hexagram={hexagram}
                interpretation={interpretation}
                isLoading={isLoading}
                onStartOver={handleStartOver}
              />
            )}
          </div>

          {/* Cultural Context Footer */}
          <div className="mt-12 text-center">
            <Card variant="default" className="mx-auto max-w-2xl">
              <CardContent className="pt-6">
                <p className="text-sm text-soft-gray">
                  <span className="font-medium text-mountain-stone">
                    Cultural Note:
                  </span>{' '}
                  The I Ching (易經) is a 3,000-year-old Chinese divination
                  text. We approach this ancient wisdom with deep respect for
                  its cultural significance and philosophical depth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
