'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  SUPPORT_CATEGORIES,
  type TicketCategory,
  type SupportStats,
} from '@/types/support';

interface SupportFormProps {
  supportStats: SupportStats;
  userEmail: string;
  userName?: string;
  onSubmitSuccess?: (ticketId: string) => void;
}

export default function SupportForm({
  supportStats,
  userEmail,
  userName,
  onSubmitSuccess,
}: SupportFormProps) {
  const [formData, setFormData] = useState({
    category: 'technical' as TicketCategory,
    subject: '',
    message: '',
    user_email: userEmail,
    user_name: userName || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get the current session for fallback authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header as fallback
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers,
        credentials: 'same-origin', // Include cookies for authentication
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit support request');
      }

      const result = await response.json();

      if (result.success) {
        onSubmitSuccess?.(result.ticket.id);
        // Reset form
        setFormData({
          ...formData,
          subject: '',
          message: '',
        });
      }
    } catch (error) {
      console.error('Support form submission error:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit support request'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPrioritySupport = supportStats.supportLevel === 'priority';

  return (
    <div className="mx-auto max-w-2xl">
      {/* Support Level Banner */}
      <Card
        variant="elevated"
        className={`mb-6 border-2 ${
          isPrioritySupport
            ? 'border-sunset-gold bg-gradient-to-r from-sunset-gold/10 to-flowing-water/10'
            : 'border-gentle-silver/30'
        }`}
      >
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isPrioritySupport
                  ? 'bg-sunset-gold/20 text-sunset-gold'
                  : 'bg-gentle-silver/20 text-soft-gray'
              }`}
            >
              {isPrioritySupport ? '⭐' : '📧'}
            </div>
            <div>
              <h3
                className={`text-lg font-semibold ${
                  isPrioritySupport ? 'text-sunset-gold' : 'text-mountain-stone'
                }`}
              >
                {isPrioritySupport ? 'Priority Support' : 'Standard Support'}
              </h3>
              <p className="text-soft-gray">
                Response time: <strong>{supportStats.responseTime}</strong>
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-mountain-stone">
                Support Features:
              </h4>
              <ul className="space-y-1 text-sm text-soft-gray">
                {supportStats.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-bamboo-green">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {!isPrioritySupport && (
              <div className="rounded-lg bg-gentle-silver/10 p-4">
                <h4 className="mb-2 font-medium text-mountain-stone">
                  Want Faster Support?
                </h4>
                <p className="mb-3 text-sm text-soft-gray">
                  Upgrade to Sage+ for 24-hour priority support and direct
                  access to our team.
                </p>
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="w-full">
                    Upgrade to Sage+
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Support Form */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            Submit Support Request
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-mountain-stone">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={e =>
                  setFormData({
                    ...formData,
                    category: e.target.value as TicketCategory,
                  })
                }
                className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                required
              >
                {Object.entries(SUPPORT_CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-mountain-stone">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.user_email}
                  onChange={e =>
                    setFormData({ ...formData, user_email: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-mountain-stone">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={e =>
                    setFormData({ ...formData, user_name: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-2 block text-sm font-medium text-mountain-stone">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={e =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 block text-sm font-medium text-mountain-stone">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={e =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={6}
                className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                placeholder="Please provide details about your issue or question..."
                required
              />
              <p className="mt-1 text-xs text-soft-gray">
                Please include any relevant details, error messages, or steps to
                reproduce the issue.
              </p>
            </div>

            {/* Error Display */}
            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 ${
                  isPrioritySupport
                    ? 'bg-sunset-gold hover:bg-sunset-gold/90'
                    : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Support Request'
                )}
              </Button>
            </div>

            {/* Response Time Reminder */}
            <div className="text-center text-sm text-soft-gray">
              Expected response time:{' '}
              <strong>{supportStats.responseTime}</strong>
              {isPrioritySupport && (
                <span className="block font-medium text-sunset-gold">
                  Priority support - guaranteed 24-hour response
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
