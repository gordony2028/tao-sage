'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Consultation } from '@/lib/supabase/consultations';
import type {
  AIPersonalityProfile,
  AIPersonalityIndicator,
} from '@/lib/ai/personality-analysis';

interface DataExportDashboardProps {
  userId: string;
  consultations?: Consultation[];
}

interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'markdown';
  includeInterpretations: boolean;
  includeNotes: boolean;
  includeAnalytics: boolean;
  includePersonalityData: boolean;
  includeCulturalInsights: boolean;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  hexagramFilter: number[] | null;
}

interface ExportAnalytics {
  totalConsultations: number;
  dateRange: string;
  hexagramDistribution: { [key: number]: number };
  personalityBreakdown: { [key: string]: number };
  topTags: Array<{ tag: string; count: number }>;
  reflectionMetrics: {
    totalNotes: number;
    averageNoteLength: number;
    culturalThemes: Array<{ theme: string; count: number }>;
  };
  progressSummary: {
    monthlyActivity: Array<{ month: string; consultations: number }>;
    learningPatterns: string[];
    recommendations: string[];
  };
}

export default function DataExportDashboard({
  userId,
  consultations = [],
}: DataExportDashboardProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeInterpretations: true,
    includeNotes: true,
    includeAnalytics: true,
    includePersonalityData: true,
    includeCulturalInsights: true,
    dateRange: { start: null, end: null },
    hexagramFilter: null,
  });

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastExport, setLastExport] = useState<{
    date: string;
    format: string;
    size: string;
  } | null>(null);

  const updateExportOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const generateAnalytics = useCallback(
    (consultationData: Consultation[]): ExportAnalytics => {
      // Hexagram distribution analysis
      const hexagramDistribution = consultationData.reduce(
        (acc, consultation) => {
          acc[consultation.hexagram_number] =
            (acc[consultation.hexagram_number] || 0) + 1;
          return acc;
        },
        {} as { [key: number]: number }
      );

      // Tag analysis
      const tagCounts = consultationData.reduce(
        (counts, consultation) => {
          consultation.tags.forEach(tag => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
          return counts;
        },
        {} as Record<string, number>
      );

      const topTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

      // Notes analysis
      const consultationsWithNotes = consultationData.filter(
        c => c.notes && c.notes.trim()
      );

      const totalNotes = consultationsWithNotes.length;
      const averageNoteLength =
        totalNotes > 0
          ? Math.round(
              consultationsWithNotes.reduce(
                (sum, c) => sum + (c.notes?.length || 0),
                0
              ) / totalNotes
            )
          : 0;

      // Cultural themes analysis
      const culturalKeywords = {
        'Yin-Yang Balance': [
          'yin',
          'yang',
          'balance',
          'opposite',
          'complement',
        ],
        'Five Elements': ['earth', 'water', 'fire', 'metal', 'wood', 'element'],
        'Taoist Flow': ['flow', 'nature', 'wu wei', 'effortless', 'natural'],
        'Buddhist Mindfulness': [
          'mindful',
          'present',
          'meditation',
          'compassion',
          'awareness',
        ],
        'Seasonal Wisdom': [
          'season',
          'spring',
          'summer',
          'autumn',
          'winter',
          'cycle',
        ],
      };

      const culturalThemes = Object.entries(culturalKeywords)
        .map(([theme, keywords]) => {
          const count = consultationsWithNotes.filter(c =>
            keywords.some(
              keyword => c.notes?.toLowerCase().includes(keyword.toLowerCase())
            )
          ).length;
          return { theme, count };
        })
        .filter(t => t.count > 0)
        .sort((a, b) => b.count - a.count);

      // Monthly activity analysis
      const monthlyActivity = consultationData.reduce(
        (months, consultation) => {
          const date = new Date(consultation.created_at);
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, '0')}`;
          months[monthKey] = (months[monthKey] || 0) + 1;
          return months;
        },
        {} as Record<string, number>
      );

      const sortedMonthly = Object.entries(monthlyActivity)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([month, consultations]) => ({
          month: new Date(month + '-01').toLocaleDateString('en', {
            month: 'short',
            year: 'numeric',
          }),
          consultations,
        }));

      // Learning patterns
      const learningPatterns = [];
      const uniqueHexagrams = new Set(
        consultationData.map(c => c.hexagram_number)
      ).size;

      if (uniqueHexagrams > 32) {
        learningPatterns.push(
          'Explorer - You have consulted over half of the I Ching hexagrams'
        );
      }
      if (consultationsWithNotes.length / consultationData.length > 0.7) {
        learningPatterns.push(
          'Reflective Practitioner - You document most of your consultations'
        );
      }
      if (topTags.length > 10) {
        learningPatterns.push(
          'Organized Seeker - You use diverse tags to categorize your journey'
        );
      }

      const dateRange =
        consultationData.length > 0
          ? `${new Date(
              consultationData[consultationData.length - 1]?.created_at ||
                new Date()
            ).toLocaleDateString()} - ${new Date(
              consultationData[0]?.created_at || new Date()
            ).toLocaleDateString()}`
          : 'No consultations';

      return {
        totalConsultations: consultationData.length,
        dateRange,
        hexagramDistribution,
        personalityBreakdown: {}, // Would be computed from AI personality data
        topTags,
        reflectionMetrics: {
          totalNotes,
          averageNoteLength,
          culturalThemes,
        },
        progressSummary: {
          monthlyActivity: sortedMonthly,
          learningPatterns,
          recommendations: [
            'Continue exploring different aspects of life through varied questions',
            'Maintain your reflection practice with detailed notes',
            "Consider studying hexagrams you haven't encountered yet",
          ],
        },
      };
    },
    []
  );

  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);

    try {
      // Filter consultations based on options
      let filteredConsultations = [...consultations];

      if (exportOptions.dateRange.start) {
        filteredConsultations = filteredConsultations.filter(
          c =>
            new Date(c.created_at) >= new Date(exportOptions.dateRange.start!)
        );
      }

      if (exportOptions.dateRange.end) {
        filteredConsultations = filteredConsultations.filter(
          c => new Date(c.created_at) <= new Date(exportOptions.dateRange.end!)
        );
      }

      if (
        exportOptions.hexagramFilter &&
        exportOptions.hexagramFilter.length > 0
      ) {
        filteredConsultations = filteredConsultations.filter(c =>
          exportOptions.hexagramFilter!.includes(c.hexagram_number)
        );
      }

      setExportProgress(25);

      // Generate analytics
      const analytics = exportOptions.includeAnalytics
        ? generateAnalytics(filteredConsultations)
        : null;

      setExportProgress(50);

      // Prepare export data
      const exportData: any = {
        metadata: {
          exportDate: new Date().toISOString(),
          userId,
          totalRecords: filteredConsultations.length,
          exportOptions,
          version: '1.0',
        },
        consultations: filteredConsultations.map(consultation => ({
          id: consultation.id,
          question: consultation.question,
          hexagram: {
            number: consultation.hexagram_number,
            name: consultation.hexagram_name,
            lines: consultation.lines,
            changingLines: consultation.changing_lines,
          },
          interpretation: exportOptions.includeInterpretations
            ? consultation.interpretation
            : null,
          notes: exportOptions.includeNotes ? consultation.notes : null,
          tags: consultation.tags,
          createdAt: consultation.created_at,
          method: consultation.consultation_method,
        })),
        analytics: analytics,
      };

      setExportProgress(75);

      // Generate file based on format
      let filename: string;
      let blob: Blob;
      let mimeType: string;

      switch (exportOptions.format) {
        case 'json':
          filename = `tao-sage-export-${
            new Date().toISOString().split('T')[0]
          }.json`;
          blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
          });
          mimeType = 'application/json';
          break;

        case 'csv':
          filename = `tao-sage-export-${
            new Date().toISOString().split('T')[0]
          }.csv`;
          const csvContent = generateCSV(filteredConsultations, exportOptions);
          blob = new Blob([csvContent], { type: 'text/csv' });
          mimeType = 'text/csv';
          break;

        case 'markdown':
          filename = `tao-sage-export-${
            new Date().toISOString().split('T')[0]
          }.md`;
          const markdownContent = generateMarkdown(exportData);
          blob = new Blob([markdownContent], { type: 'text/markdown' });
          mimeType = 'text/markdown';
          break;

        case 'pdf':
          // This would require a PDF generation library
          throw new Error('PDF export not yet implemented');

        default:
          throw new Error('Unsupported export format');
      }

      setExportProgress(90);

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update last export info
      setLastExport({
        date: new Date().toLocaleString(),
        format: exportOptions.format.toUpperCase(),
        size: formatBytes(blob.size),
      });

      setExportProgress(100);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + (error as Error).message);
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };

  const generateCSV = (
    consultations: Consultation[],
    options: ExportOptions
  ): string => {
    const headers = [
      'Date',
      'Question',
      'Hexagram Number',
      'Hexagram Name',
      'Lines',
      'Changing Lines',
      'Tags',
    ];

    if (options.includeInterpretations) {
      headers.push(
        'Interpretation',
        'Ancient Wisdom',
        'Guidance',
        'Practical Advice'
      );
    }

    if (options.includeNotes) {
      headers.push('Notes');
    }

    const rows = consultations.map(consultation => {
      const baseRow = [
        consultation.created_at,
        `"${consultation.question.replace(/"/g, '""')}"`,
        consultation.hexagram_number.toString(),
        `"${consultation.hexagram_name}"`,
        consultation.lines.join('|'),
        consultation.changing_lines.join('|'),
        consultation.tags.join('|'),
      ];

      if (options.includeInterpretations) {
        baseRow.push(
          `"${(consultation.interpretation.interpretation || '').replace(
            /"/g,
            '""'
          )}"`,
          `"${(consultation.interpretation.ancientWisdom || '').replace(
            /"/g,
            '""'
          )}"`,
          `"${(consultation.interpretation.guidance || '').replace(
            /"/g,
            '""'
          )}"`,
          `"${(consultation.interpretation.practicalAdvice || '').replace(
            /"/g,
            '""'
          )}"`
        );
      }

      if (options.includeNotes) {
        baseRow.push(`"${(consultation.notes || '').replace(/"/g, '""')}"`);
      }

      return baseRow;
    });

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const generateMarkdown = (exportData: any): string => {
    let markdown = `# I Ching Journey Export\n\n`;
    markdown += `**Export Date:** ${new Date(
      exportData.metadata.exportDate
    ).toLocaleString()}\n`;
    markdown += `**Total Consultations:** ${exportData.metadata.totalRecords}\n\n`;

    if (exportData.analytics) {
      markdown += `## Analytics Summary\n\n`;
      markdown += `- **Date Range:** ${exportData.analytics.dateRange}\n`;
      markdown += `- **Total Notes:** ${exportData.analytics.reflectionMetrics.totalNotes}\n`;
      markdown += `- **Average Note Length:** ${exportData.analytics.reflectionMetrics.averageNoteLength} characters\n`;

      if (exportData.analytics.topTags.length > 0) {
        markdown += `\n### Most Used Tags\n\n`;
        exportData.analytics.topTags.forEach((tag: any, index: number) => {
          markdown += `${index + 1}. **${tag.tag}** (${tag.count} times)\n`;
        });
      }

      if (exportData.analytics.reflectionMetrics.culturalThemes.length > 0) {
        markdown += `\n### Cultural Themes in Reflections\n\n`;
        exportData.analytics.reflectionMetrics.culturalThemes.forEach(
          (theme: any) => {
            markdown += `- **${theme.theme}:** ${theme.count} reflections\n`;
          }
        );
      }

      markdown += `\n---\n\n`;
    }

    markdown += `## Consultations\n\n`;

    exportData.consultations.forEach((consultation: any, index: number) => {
      markdown += `### ${index + 1}. ${consultation.question}\n\n`;
      markdown += `**Date:** ${new Date(
        consultation.createdAt
      ).toLocaleDateString()}\n`;
      markdown += `**Hexagram:** ${consultation.hexagram.number} - ${consultation.hexagram.name}\n`;

      if (consultation.tags && consultation.tags.length > 0) {
        markdown += `**Tags:** ${consultation.tags.join(', ')}\n`;
      }

      if (consultation.interpretation && exportOptions.includeInterpretations) {
        markdown += `\n**Interpretation:**\n${consultation.interpretation.interpretation}\n`;

        if (consultation.interpretation.ancientWisdom) {
          markdown += `\n**Ancient Wisdom:**\n${consultation.interpretation.ancientWisdom}\n`;
        }

        if (consultation.interpretation.guidance) {
          markdown += `\n**Guidance:**\n${consultation.interpretation.guidance}\n`;
        }
      }

      if (consultation.notes && exportOptions.includeNotes) {
        markdown += `\n**Personal Notes:**\n${consultation.notes}\n`;
      }

      markdown += `\n---\n\n`;
    });

    return markdown;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Data Export & Analytics
          </CardTitle>
          <p className="text-sm text-soft-gray">
            Export your I Ching journey data with enhanced analytics and
            insights
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Export Options */}
        <div className="lg:col-span-2">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-lg">Export Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="mb-3 block text-sm font-medium text-mountain-stone">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { value: 'json', label: 'JSON', desc: 'Structured data' },
                    { value: 'csv', label: 'CSV', desc: 'Spreadsheet format' },
                    {
                      value: 'markdown',
                      label: 'Markdown',
                      desc: 'Readable text',
                    },
                    {
                      value: 'pdf',
                      label: 'PDF',
                      desc: 'Coming soon',
                      disabled: true,
                    },
                  ].map(format => (
                    <button
                      key={format.value}
                      disabled={format.disabled}
                      onClick={() =>
                        updateExportOption('format', format.value as any)
                      }
                      className={`rounded-lg border-2 p-3 text-center text-sm transition-colors ${
                        exportOptions.format === format.value
                          ? 'border-flowing-water bg-flowing-water/10 text-flowing-water'
                          : format.disabled
                            ? 'cursor-not-allowed border-stone-gray/20 bg-stone-gray/5 text-soft-gray'
                            : 'border-stone-gray/20 text-mountain-stone hover:border-flowing-water/50'
                      }`}
                    >
                      <div className="font-medium">{format.label}</div>
                      <div className="text-xs opacity-75">{format.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Options */}
              <div>
                <label className="mb-3 block text-sm font-medium text-mountain-stone">
                  Include in Export
                </label>
                <div className="space-y-3">
                  {[
                    {
                      key: 'includeInterpretations',
                      label: 'AI Interpretations',
                      desc: 'Include all interpretation sections',
                    },
                    {
                      key: 'includeNotes',
                      label: 'Personal Notes',
                      desc: 'Include your reflection notes',
                    },
                    {
                      key: 'includeAnalytics',
                      label: 'Analytics Summary',
                      desc: 'Include usage patterns and insights',
                    },
                    {
                      key: 'includePersonalityData',
                      label: 'AI Personality Analysis',
                      desc: 'Include AI communication style analysis',
                    },
                    {
                      key: 'includeCulturalInsights',
                      label: 'Cultural Context',
                      desc: 'Include cultural themes and wisdom',
                    },
                  ].map(option => (
                    <label key={option.key} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={
                          exportOptions[
                            option.key as keyof ExportOptions
                          ] as boolean
                        }
                        onChange={e =>
                          updateExportOption(
                            option.key as keyof ExportOptions,
                            e.target.checked as any
                          )
                        }
                        className="mt-1 h-4 w-4 rounded border-stone-gray text-flowing-water focus:ring-flowing-water"
                      />
                      <div>
                        <div className="font-medium text-mountain-stone">
                          {option.label}
                        </div>
                        <div className="text-sm text-soft-gray">
                          {option.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="mb-3 block text-sm font-medium text-mountain-stone">
                  Date Range (Optional)
                </label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-soft-gray">
                      From
                    </label>
                    <input
                      type="date"
                      value={exportOptions.dateRange.start || ''}
                      onChange={e =>
                        updateExportOption('dateRange', {
                          ...exportOptions.dateRange,
                          start: e.target.value || null,
                        })
                      }
                      className="w-full rounded-lg border border-stone-gray/20 px-3 py-2 focus:border-flowing-water focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-soft-gray">
                      To
                    </label>
                    <input
                      type="date"
                      value={exportOptions.dateRange.end || ''}
                      onChange={e =>
                        updateExportOption('dateRange', {
                          ...exportOptions.dateRange,
                          end: e.target.value || null,
                        })
                      }
                      className="w-full rounded-lg border border-stone-gray/20 px-3 py-2 focus:border-flowing-water focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Summary & Actions */}
        <div className="space-y-6">
          {/* Export Summary */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-lg">Export Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-soft-gray">Total Records:</span>
                  <span className="font-medium">{consultations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-gray">Format:</span>
                  <span className="font-medium">
                    {exportOptions.format.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-gray">Est. Size:</span>
                  <span className="font-medium">
                    {formatBytes(
                      JSON.stringify(consultations).length *
                        (exportOptions.includeInterpretations ? 3 : 1)
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card variant="default">
            <CardContent className="pt-6">
              <Button
                onClick={handleExport}
                disabled={exporting || consultations.length === 0}
                className="w-full"
                size="lg"
              >
                {exporting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Exporting... {exportProgress}%
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    Export Data
                  </div>
                )}
              </Button>

              {/* Progress Bar */}
              {exporting && (
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-gentle-silver">
                    <div
                      className="h-2 rounded-full bg-flowing-water transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Last Export Info */}
              {lastExport && (
                <div className="mt-4 rounded-lg bg-gentle-silver/10 p-3">
                  <div className="text-xs font-medium text-mountain-stone">
                    Last Export
                  </div>
                  <div className="text-xs text-soft-gray">
                    {lastExport.format} • {lastExport.size} • {lastExport.date}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
