'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  getUserConsultations,
  type Consultation,
} from '@/lib/supabase/consultations';
import { supabase } from '@/lib/supabase/client';
import ConsultationHistoryItem from './ConsultationHistoryItem';
import ConsultationHistoryFilters from './ConsultationHistoryFilters';
import AIPersonalitySummary from './AIPersonalitySummary';
import NoteTakingAnalytics from './NoteTakingAnalytics';

interface ConsultationHistoryProps {
  userId: string;
}

export default function ConsultationHistory({
  userId,
}: ConsultationHistoryProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    hexagramNumber: undefined as number | undefined,
    status: 'active' as 'active' | 'archived',
  });

  const ITEMS_PER_PAGE = 10;

  const loadConsultations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const queryFilters: any = {
        limit: ITEMS_PER_PAGE,
        offset,
        search: filters.search,
        status: filters.status,
      };

      if (filters.hexagramNumber !== undefined) {
        queryFilters.hexagramNumber = filters.hexagramNumber;
      }

      const result = await getUserConsultations(userId, queryFilters);

      setConsultations(result.data);
      setTotalCount(result.count);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load consultation history'
      );
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, filters]);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading && consultations.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading your consultation history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h3 className="mb-2 text-lg font-medium text-mountain-stone">
            Failed to Load History
          </h3>
          <p className="mb-4 text-soft-gray">{error}</p>
          <Button onClick={loadConsultations} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="default">
        <CardContent className="pt-6">
          <h1 className="mb-2 text-2xl font-bold text-ink-black">
            Your I Ching Journey
          </h1>
          <p className="text-soft-gray">
            Explore your consultation history and discover patterns in your path
            of wisdom. You have completed {totalCount} consultation
            {totalCount !== 1 ? 's' : ''}.
          </p>
        </CardContent>
      </Card>

      {/* AI Personality Summary */}
      {consultations.length > 0 && (
        <AIPersonalitySummary consultations={consultations} />
      )}

      {/* Note-Taking Analytics */}
      {consultations.length > 0 && (
        <NoteTakingAnalytics consultations={consultations} />
      )}

      {/* Filters */}
      <ConsultationHistoryFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      {/* Consultation List */}
      {consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map(consultation => (
            <ConsultationHistoryItem
              key={consultation.id}
              consultation={consultation}
              onUpdate={loadConsultations}
            />
          ))}
        </div>
      ) : (
        <Card variant="default">
          <CardContent className="py-12 text-center">
            <div className="mb-4 text-6xl opacity-50">☯️</div>
            <h3 className="mb-2 text-lg font-medium text-mountain-stone">
              {filters.search || filters.hexagramNumber
                ? 'No Consultations Match Your Filters'
                : 'No Consultations Yet'}
            </h3>
            <p className="mb-6 text-soft-gray">
              {filters.search || filters.hexagramNumber
                ? 'Try adjusting your search criteria or clearing filters.'
                : 'Your consultation history will appear here after you complete your first I Ching reading.'}
            </p>
            {filters.search || filters.hexagramNumber ? (
              <Button
                onClick={() =>
                  handleFilterChange({
                    search: '',
                    hexagramNumber: undefined,
                    status: 'active',
                  })
                }
                variant="outline"
              >
                Clear Filters
              </Button>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={() => (window.location.href = '/')}
                  variant="default"
                >
                  ☯️ Start Your Spiritual Journey
                </Button>
                <p className="text-xs text-soft-gray">
                  Begin with your first I Ching consultation
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-soft-gray">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of{' '}
                {totalCount} consultations
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(p => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
