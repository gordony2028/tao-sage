'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { type Consultation } from '@/lib/supabase/consultations';

interface CulturalInsight {
  id: string;
  category: 'wisdom' | 'symbol' | 'practice' | 'philosophy';
  title: string;
  description: string;
  relevance: string;
  chineseCharacter?: string;
}

interface NoteTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  template: string;
  culturalContext?: string;
}

interface EnhancedNotesEditorProps {
  consultation: Consultation;
  onSave: (
    notes: string,
    tags: string[],
    culturalInsights: CulturalInsight[]
  ) => Promise<void>;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  saving: boolean;
}

const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'reflection',
    name: 'Reflection Journal',
    icon: '🤔',
    description: 'Structured personal reflection',
    template: `## My Situation
[Describe your current situation and feelings about it]

## Hexagram Insights  
[What resonated with you from the I Ching interpretation?]

## Personal Patterns
[What patterns do you notice in your life or this consultation?]

## Action Steps
[What concrete steps will you take based on this wisdom?]

## Future Reference
[Notes for your future self to remember about this moment]`,
    culturalContext:
      'Inspired by traditional Chinese self-cultivation practices (修身 xiū shēn)',
  },
  {
    id: 'wisdom',
    name: 'Wisdom Collection',
    icon: '💎',
    description: 'Capture insights and wisdom',
    template: `## Key Wisdom
[The most important insight from this consultation]

## Ancient Teaching
[How does this connect to traditional Chinese wisdom?]

## Modern Application  
[How can you apply this wisdom in today\'s world?]

## Memorable Quote
[A phrase or sentence that you want to remember]

## Share with Others
[Wisdom that might help family or friends]`,
    culturalContext:
      'Following the tradition of collecting wise sayings (格言 gé yán)',
  },
  {
    id: 'decision',
    name: 'Decision Framework',
    icon: '⚖️',
    description: 'Structured decision making',
    template: `## The Decision
[What decision are you facing?]

## Yin-Yang Analysis
**Passive Approach (Yin 陰):**
[Benefits and drawbacks of waiting, observing, yielding]

**Active Approach (Yang 陽):**
[Benefits and drawbacks of acting, leading, asserting]

## Five Elements Perspective
- **Earth**: Stability and grounding factors
- **Water**: Flow and adaptability needs  
- **Fire**: Passion and energy considerations
- **Metal**: Structure and boundaries required
- **Wood**: Growth and flexibility desired

## Consultation Guidance
[How does the hexagram guide your decision?]

## Final Direction
[Your chosen path and why]`,
    culturalContext:
      'Based on traditional Chinese decision-making using Wu Xing (五行)',
  },
  {
    id: 'relationship',
    name: 'Relationship Harmony',
    icon: '🫶',
    description: 'Navigate relationship dynamics',
    template: `## Relationship Situation
[Describe the relationship and current dynamics]

## My Energy (Self-Understanding)
[Your emotional state, needs, and patterns]

## Other\'s Perspective
[Try to understand their viewpoint with compassion]

## Hexagram Guidance for Relationships
[How does the I Ching wisdom apply to this relationship?]

## Harmony Actions
**To Give (Yang):**
[What you can offer or provide]

**To Receive (Yin):**  
[What you need to accept or allow]

## Communication Plan
[How you will approach conversations or interactions]`,
    culturalContext:
      'Rooted in Confucian teachings on harmonious relationships (和 hé)',
  },
  {
    id: 'seasonal',
    name: 'Seasonal Reflection',
    icon: '🌸',
    description: 'Connect with natural cycles',
    template: `## Current Life Season
[What season does your life feel like now - spring (growth), summer (abundance), autumn (harvest), winter (rest)?]

## Natural Wisdom
[What can you learn from the current actual season?]

## Inner Climate
[Your emotional and spiritual weather right now]

## Seasonal Actions
**Plant (Spring Energy):** [What new things to begin]
**Cultivate (Summer Energy):** [What to nurture and grow]
**Harvest (Autumn Energy):** [What fruits to gather and celebrate]
**Rest (Winter Energy):** [What to release and restore]

## Hexagram\'s Seasonal Message
[How does the consultation connect to natural timing?]

## Living in Rhythm
[How to better align with natural and personal cycles]`,
    culturalContext:
      'Inspired by traditional Chinese seasonal wisdom and agricultural philosophy',
  },
  {
    id: 'gratitude',
    name: 'Gratitude & Flow',
    icon: '🙏',
    description: 'Cultivate appreciation',
    template: `## What I\'m Grateful For
[Three things you appreciate about this situation or consultation]

## Unexpected Gifts
[Surprising wisdom or insights that emerged]

## People to Honor
[Who has supported you or taught you something valuable?]

## Ancestral Wisdom
[How do you feel connected to the wisdom of those before you?]

## Future Gratitude
[What are you looking forward to appreciating?]

## Hexagram\'s Gift
[What gift does this I Ching reading offer you?]

## Sharing Abundance
[How can you share your gratitude and wisdom with others?]`,
    culturalContext:
      'Based on Buddhist and Taoist practices of gratitude and interconnection',
  },
];

const CULTURAL_INSIGHTS = {
  1: {
    category: 'philosophy' as const,
    title: 'The Creative Force',
    description: 'Pure yang energy represents leadership and initiative',
    relevance: 'Times for bold action require strong will',
    chineseCharacter: '乾',
  },
  2: {
    category: 'philosophy' as const,
    title: 'The Receptive Earth',
    description: 'Pure yin energy represents receptivity and nurturing',
    relevance: 'Sometimes following is stronger than leading',
    chineseCharacter: '坤',
  },
  3: {
    category: 'wisdom' as const,
    title: 'Initial Difficulty',
    description: 'New beginnings often face obstacles',
    relevance: 'Patience and persistence overcome early challenges',
    chineseCharacter: '屯',
  },
  4: {
    category: 'practice' as const,
    title: 'Youthful Folly',
    description: 'Learning requires humility and respect',
    relevance: "Approach wisdom with beginner's mind",
    chineseCharacter: '蒙',
  },
  5: {
    category: 'symbol' as const,
    title: 'Waiting',
    description: 'Water above heaven - nourishment will come',
    relevance: 'Trust in natural timing and preparation',
    chineseCharacter: '需',
  },
  // Add more hexagrams as needed
};

export default function EnhancedNotesEditor({
  consultation,
  onSave,
  isEditing,
  setIsEditing,
  saving,
}: EnhancedNotesEditorProps) {
  const [notes, setNotes] = useState(consultation.notes || '');
  const [tags, setTags] = useState(consultation.tags.join(', '));
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [culturalInsights, setCulturalInsights] = useState<CulturalInsight[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<
    'write' | 'templates' | 'insights'
  >('write');

  // Generate cultural insights based on hexagram
  useEffect(() => {
    const hexagramInsights =
      CULTURAL_INSIGHTS[
        consultation.hexagram_number as keyof typeof CULTURAL_INSIGHTS
      ];
    if (hexagramInsights) {
      setCulturalInsights([
        {
          id: `hexagram-${consultation.hexagram_number}`,
          ...hexagramInsights,
        },
      ]);
    }

    // Add insights based on interpretation content
    const additionalInsights: CulturalInsight[] = [];

    if (consultation.interpretation.ancientWisdom) {
      additionalInsights.push({
        id: 'ancient-wisdom',
        category: 'wisdom',
        title: 'Ancient Teaching',
        description:
          consultation.interpretation.ancientWisdom.substring(0, 100) + '...',
        relevance: 'Traditional wisdom for modern times',
        chineseCharacter: '古',
      });
    }

    if (consultation.interpretation.culturalContext) {
      additionalInsights.push({
        id: 'cultural-context',
        category: 'philosophy',
        title: 'Cultural Understanding',
        description:
          consultation.interpretation.culturalContext.substring(0, 100) + '...',
        relevance: 'Deeper cultural appreciation',
        chineseCharacter: '文',
      });
    }

    setCulturalInsights(prev => [...prev, ...additionalInsights]);
  }, [consultation]);

  const handleSaveNotes = async () => {
    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    await onSave(notes, tagArray, culturalInsights);
  };

  const applyTemplate = (template: NoteTemplate) => {
    if (
      notes.trim() &&
      !confirm('This will replace your current notes. Continue?')
    ) {
      return;
    }

    setNotes(template.template);
    setSelectedTemplate(template.id);
    setShowTemplates(false);
    setActiveTab('write');
  };

  const insertCulturalInsight = (insight: CulturalInsight) => {
    const insightText = `
## Cultural Insight: ${insight.title} ${insight.chineseCharacter || ''}
${insight.description}

*Relevance:* ${insight.relevance}

`;
    setNotes(prev => prev + insightText);
    setActiveTab('write');
  };

  if (!isEditing) {
    return (
      <div className="border-t border-stone-gray/20 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="flex items-center font-medium text-mountain-stone">
            <span className="mr-2 text-lg">📝</span>
            Your Wisdom Journal
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={saving}
          >
            {consultation.notes ? 'Edit' : 'Add Notes'}
          </Button>
        </div>

        <div className="pl-0">
          {consultation.notes ? (
            <div className="space-y-3">
              <div className="whitespace-pre-wrap leading-relaxed text-gentle-silver">
                {consultation.notes}
              </div>
              {consultation.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
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
          ) : (
            <p className="italic text-soft-gray">
              No notes yet. Click &quot;Add Notes&quot; to begin your wisdom
              journal with cultural insights and structured reflection
              templates.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-stone-gray/20 pt-4">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            Enhanced Wisdom Journal
          </CardTitle>
          <p className="text-sm text-soft-gray">
            Capture your insights with cultural context and structured
            reflection templates
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 rounded-lg bg-gentle-silver/20 p-1">
            {[
              { id: 'write' as const, label: 'Write', icon: '✍️' },
              { id: 'templates' as const, label: 'Templates', icon: '📋' },
              { id: 'insights' as const, label: 'Cultural', icon: '🏛️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-mountain-stone shadow-sm'
                    : 'text-soft-gray hover:text-mountain-stone'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Write Tab */}
          {activeTab === 'write' && (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Begin your reflection... You can use the Templates tab for structured guidance or the Cultural tab to add I Ching insights."
                className="min-h-[200px] w-full rounded-lg border border-stone-gray/30 p-3 text-sm leading-relaxed focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-mountain-stone">
                  Tags & Categories
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="personal, relationships, career, spiritual-growth..."
                  className="w-full rounded-lg border border-stone-gray/30 p-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                />
                <p className="text-xs text-soft-gray">
                  Add tags to organize and find your notes later. Suggested:
                  personal, work, relationships, decision-making,
                  spiritual-growth
                </p>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-3">
              <p className="text-sm text-soft-gray">
                Choose a structured template to guide your reflection:
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {NOTE_TEMPLATES.map(template => (
                  <Card
                    key={template.id}
                    variant="default"
                    className={`cursor-pointer border-2 transition-all hover:border-flowing-water ${
                      selectedTemplate === template.id
                        ? 'border-flowing-water bg-flowing-water/5'
                        : ''
                    }`}
                    onClick={() => applyTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-mountain-stone">
                            {template.name}
                          </h3>
                          <p className="mt-1 text-xs text-soft-gray">
                            {template.description}
                          </p>
                          {template.culturalContext && (
                            <p className="mt-2 text-xs italic text-gentle-silver">
                              {template.culturalContext}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-3">
              <p className="text-sm text-soft-gray">
                Add cultural context and I Ching wisdom to enrich your notes:
              </p>

              <div className="space-y-2">
                {culturalInsights.map(insight => (
                  <Card
                    key={insight.id}
                    variant="default"
                    className="cursor-pointer transition-all hover:border-flowing-water"
                    onClick={() => insertCulturalInsight(insight)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        {insight.chineseCharacter && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-earth-brown text-sm font-bold text-white">
                            {insight.chineseCharacter}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-mountain-stone">
                              {insight.title}
                            </h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                insight.category === 'wisdom'
                                  ? 'bg-sunset-gold/20 text-sunset-gold'
                                  : insight.category === 'philosophy'
                                    ? 'bg-earth-brown/20 text-earth-brown'
                                    : insight.category === 'practice'
                                      ? 'bg-bamboo-green/20 text-bamboo-green'
                                      : 'bg-flowing-water/20 text-flowing-water'
                              }`}
                            >
                              {insight.category}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gentle-silver">
                            {insight.description}
                          </p>
                          <p className="mt-1 text-xs italic text-soft-gray">
                            {insight.relevance}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {culturalInsights.length === 0 && (
                <div className="py-8 text-center">
                  <div className="mb-2 text-4xl opacity-50">🏛️</div>
                  <p className="text-soft-gray">
                    No cultural insights available for this consultation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 border-t border-gentle-silver/20 pt-4">
            <Button onClick={handleSaveNotes} disabled={saving} size="sm">
              {saving ? 'Saving...' : 'Save Notes'}
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              size="sm"
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
