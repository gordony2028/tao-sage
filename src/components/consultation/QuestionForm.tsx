'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
}

const EXAMPLE_QUESTIONS = [
  'What should I focus on in my career development?',
  'How can I improve my relationships with others?',
  'What guidance do you have for my current life situation?',
  'How should I approach this important decision?',
  "What do I need to understand about this challenge I'm facing?",
];

export default function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    setIsValid(value.trim().length >= 10); // Minimum meaningful question length
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(question.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    setIsValid(true);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-center">
            What guidance do you seek?
          </CardTitle>
          <p className="text-center text-soft-gray">
            Ask a meaningful question about your life, relationships, career, or
            any situation where you seek clarity and wisdom.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="question"
                className="mb-2 block text-sm font-medium text-mountain-stone"
              >
                Your Question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={e => handleQuestionChange(e.target.value)}
                placeholder="Enter your question here..."
                className="border-stone-gray h-32 w-full resize-none rounded-lg border px-4 py-3 transition-colors duration-200 focus:border-flowing-water focus:ring-2 focus:ring-flowing-water"
                maxLength={500}
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-soft-gray">
                  {question.length >= 10
                    ? '✓ Good question length'
                    : 'Please write at least 10 characters for a meaningful consultation'}
                </p>
                <span className="text-xs text-soft-gray">
                  {question.length}/500
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full"
              size="lg"
            >
              Begin Consultation
            </Button>
          </form>

          {/* Example Questions */}
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-medium text-mountain-stone">
              Need inspiration? Try one of these questions:
            </h3>
            <div className="space-y-2">
              {EXAMPLE_QUESTIONS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="hover:bg-stone-gray/10 hover:border-stone-gray/20 block w-full rounded-lg border border-transparent bg-cloud-white p-3 text-left text-sm text-soft-gray transition-colors duration-200"
                >
                  &ldquo;{example}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Guidance on good questions */}
          <div className="mt-8 rounded-lg border border-bamboo-green/20 bg-bamboo-green/5 p-4">
            <h4 className="mb-2 font-medium text-mountain-stone">
              Tips for meaningful questions:
            </h4>
            <ul className="space-y-1 text-sm text-soft-gray">
              <li>
                • Focus on &ldquo;How can I...&rdquo; rather than &ldquo;Will
                I...&rdquo; questions
              </li>
              <li>• Ask about guidance rather than predictions</li>
              <li>• Be specific about the situation you&apos;re facing</li>
              <li>• Approach with sincere intention and openness</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
