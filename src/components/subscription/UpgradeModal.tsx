/**
 * Upgrade Modal Component
 * Shows when users hit their free tier limits
 */

'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationsUsed?: number;
  totalAllowed?: number;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  consultationsUsed = 3,
  totalAllowed = 3,
}: UpgradeModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <Card
        variant="elevated"
        className={`relative z-10 mx-4 w-full max-w-md transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sunset-gold to-earth-brown">
            <span className="text-2xl">✨</span>
          </div>
          <CardTitle className="text-2xl text-mountain-stone">
            Weekly Limit Reached
          </CardTitle>
          <p className="text-soft-gray">
            You&apos;ve used all {consultationsUsed} of your free weekly
            consultations
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current vs Upgrade Comparison */}
          <div className="space-y-4">
            <div className="rounded-lg border border-red-100 bg-red-50 p-4">
              <h4 className="mb-2 font-medium text-red-800">🆓 Free Plan</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• 3 consultations per week</li>
                <li>• Basic I Ching interpretations</li>
                <li>• Limited history access</li>
                <li className="font-medium">
                  ❌ You&apos;ve reached your limit
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-sunset-gold/20 bg-gradient-to-br from-sunset-gold/10 to-earth-brown/10 p-4">
              <h4 className="mb-2 font-medium text-sunset-gold">
                ✨ Sage+ Plan - $7.99/month
              </h4>
              <ul className="space-y-1 text-sm text-mountain-stone">
                <li>• ∞ Unlimited consultations</li>
                <li>• AI-enhanced personalized interpretations</li>
                <li>• Complete consultation history</li>
                <li>• Priority customer support</li>
                <li>• Advanced hexagram insights</li>
              </ul>
            </div>
          </div>

          {/* Next Reset Info */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-center">
            <p className="text-sm text-blue-700">
              <span className="font-medium">
                ⏰ Free consultations reset every Monday
              </span>
              <br />
              Or upgrade now for immediate unlimited access
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/pricing" className="w-full">
              <Button className="w-full py-3 text-lg">
                ✨ Upgrade to Sage+ - $7.99/month
              </Button>
            </Link>

            <div className="flex gap-2">
              <Link href="/learn" className="flex-1">
                <Button variant="outline" className="w-full">
                  📚 Explore Free Content
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="border-t border-gentle-silver/20 pt-4 text-center">
            <p className="mb-2 text-xs text-soft-gray">
              Trusted by thousands of seekers worldwide
            </p>
            <div className="flex justify-center gap-4 text-xs text-soft-gray">
              <span>✓ Cancel anytime</span>
              <span>✓ 7-day free trial</span>
              <span>✓ Secure payment</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
