'use client';

import { CulturalPreferences } from '@/types/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Select from '@/components/ui/Select';

interface CulturalPreferencesPanelProps {
  preferences: CulturalPreferences;
  onUpdate: (updates: Partial<CulturalPreferences>) => void;
}

export function CulturalPreferencesPanel({
  preferences,
  onUpdate,
}: CulturalPreferencesPanelProps) {
  const getLanguageDescription = (lang: string) => {
    switch (lang) {
      case 'en':
        return 'English - Modern interpretations with cultural context';
      case 'zh':
        return '简体中文 - Simplified Chinese with traditional wisdom';
      case 'zh-TW':
        return '繁體中文 - Traditional Chinese characters';
      case 'ja':
        return '日本語 - Japanese with East Asian perspective';
      case 'ko':
        return '한국어 - Korean with Confucian insights';
      default:
        return '';
    }
  };

  const getCulturalContextDescription = (context: string) => {
    switch (context) {
      case 'modern':
        return 'Contemporary interpretations focused on modern life applications';
      case 'traditional':
        return 'Classical interpretations with historical and philosophical depth';
      case 'balanced':
        return 'Harmonious blend of traditional wisdom and modern relevance';
      default:
        return '';
    }
  };

  const getInterpretationStyleDescription = (style: string) => {
    switch (style) {
      case 'concise':
        return 'Brief, practical interpretations for quick guidance';
      case 'detailed':
        return 'Comprehensive analysis with multiple perspectives';
      case 'poetic':
        return 'Lyrical, metaphorical style reflecting classical texts';
      default:
        return '';
    }
  };

  const getPhilosophyDescription = (philosophy: string) => {
    switch (philosophy) {
      case 'confucian':
        return 'Emphasis on social harmony, ethics, and proper relationships';
      case 'taoist':
        return 'Focus on natural flow, wu wei, and spontaneous action';
      case 'buddhist':
        return 'Insights on impermanence, compassion, and mindful living';
      case 'balanced':
        return 'Integrated wisdom from multiple Chinese philosophical traditions';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Language & Localization */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🌍</span>
            Language & Localization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Display Language 显示语言
            </label>
            <Select
              value={preferences.displayLanguage}
              onValueChange={value =>
                onUpdate({
                  displayLanguage:
                    value as CulturalPreferences['displayLanguage'],
                })
              }
            >
              <option value="en">🇺🇸 English 英语</option>
              <option value="zh">🇨🇳 简体中文 Simplified Chinese</option>
              <option value="zh-TW">🇹🇼 繁體中文 Traditional Chinese</option>
              <option value="ja">🇯🇵 日本語 Japanese</option>
              <option value="ko">🇰🇷 한국어 Korean</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              {getLanguageDescription(preferences.displayLanguage)}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Cultural Context 文化背景
            </label>
            <Select
              value={preferences.culturalContext}
              onValueChange={value =>
                onUpdate({
                  culturalContext:
                    value as CulturalPreferences['culturalContext'],
                })
              }
            >
              <option value="modern">🖥️ Modern 现代</option>
              <option value="traditional">🏛️ Traditional 传统</option>
              <option value="balanced">⚖️ Balanced 平衡</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              {getCulturalContextDescription(preferences.culturalContext)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chinese Elements Display */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🀄</span>
            Chinese Characters & Names
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Show Chinese Characters 显示汉字
              </label>
              <p className="text-xs text-soft-gray">
                Display original Chinese characters alongside translations
              </p>
            </div>
            <Toggle
              checked={preferences.showChineseCharacters}
              onCheckedChange={checked =>
                onUpdate({ showChineseCharacters: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Show Pinyin 显示拼音
              </label>
              <p className="text-xs text-soft-gray">
                Include Pinyin romanization for Chinese terms
              </p>
            </div>
            <Toggle
              checked={preferences.showPinyin}
              onCheckedChange={checked => onUpdate({ showPinyin: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Traditional Names 传统名称
              </label>
              <p className="text-xs text-soft-gray">
                Use traditional Chinese names for hexagrams and concepts
              </p>
            </div>
            <Toggle
              checked={preferences.showTraditionalNames}
              onCheckedChange={checked =>
                onUpdate({ showTraditionalNames: checked })
              }
            />
          </div>

          {/* Preview of Chinese Elements */}
          <div className="rounded-lg border border-gentle-silver p-3">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              Preview 预览
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Hexagram 1:</span>{' '}
                {preferences.showTraditionalNames ? (
                  <>
                    {preferences.showChineseCharacters && '乾 '}
                    {preferences.showPinyin && '(Qián) '}
                    The Creative
                  </>
                ) : (
                  'The Creative'
                )}
              </div>
              <div>
                <span className="font-medium">Element:</span>{' '}
                {preferences.showChineseCharacters && '天 '}
                {preferences.showPinyin && '(Tiān) '}
                Heaven
              </div>
              <div>
                <span className="font-medium">Philosophy:</span>{' '}
                {preferences.showChineseCharacters && '无为 '}
                {preferences.showPinyin && '(Wú Wéi) '}
                Non-action
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wisdom & Interpretation Style */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📜</span>
            Interpretation Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Interpretation Style 解释风格
            </label>
            <Select
              value={preferences.interpretationStyle}
              onValueChange={value =>
                onUpdate({
                  interpretationStyle:
                    value as CulturalPreferences['interpretationStyle'],
                })
              }
            >
              <option value="concise">📋 Concise 简洁</option>
              <option value="detailed">📚 Detailed 详细</option>
              <option value="poetic">🎋 Poetic 诗意</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              {getInterpretationStyleDescription(
                preferences.interpretationStyle
              )}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Include Historical Context 包括历史背景
              </label>
              <p className="text-xs text-soft-gray">
                Add historical context and classical commentary to
                interpretations
              </p>
            </div>
            <Toggle
              checked={preferences.includeHistoricalContext}
              onCheckedChange={checked =>
                onUpdate({ includeHistoricalContext: checked })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Philosophical Emphasis 哲学重点
            </label>
            <Select
              value={preferences.emphasizePhilosophy}
              onValueChange={value =>
                onUpdate({
                  emphasizePhilosophy:
                    value as CulturalPreferences['emphasizePhilosophy'],
                })
              }
            >
              <option value="confucian">👨‍🏫 Confucian 儒家</option>
              <option value="taoist">🌊 Taoist 道家</option>
              <option value="buddhist">🧘 Buddhist 佛教</option>
              <option value="balanced">⚖️ Balanced 平衡</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              {getPhilosophyDescription(preferences.emphasizePhilosophy)}
            </p>
          </div>

          {/* Sample Interpretation Preview */}
          <div className="rounded-lg border border-gentle-silver p-3">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              Sample Interpretation 示例解读
            </h4>
            <div className="text-sm text-soft-gray">
              {preferences.interpretationStyle === 'concise' && (
                <p>
                  &ldquo;This hexagram suggests a time of new beginnings. Trust
                  your inner wisdom and take decisive action.&rdquo;
                  {preferences.showChineseCharacters && ' 此卦象征新的开始。'}
                </p>
              )}
              {preferences.interpretationStyle === 'detailed' && (
                <div className="space-y-2">
                  <p>
                    &ldquo;This hexagram represents the creative force of the
                    universe, symbolizing leadership, initiative, and the power
                    to manifest new realities.&rdquo;
                    {preferences.showChineseCharacters &&
                      ' 此卦代表宇宙的创造力。'}
                  </p>
                  {preferences.includeHistoricalContext && (
                    <p className="text-xs italic">
                      Historical note: This interpretation draws from the
                      commentary of Wang Bi (226-249 CE) and later Confucian
                      scholars.
                    </p>
                  )}
                </div>
              )}
              {preferences.interpretationStyle === 'poetic' && (
                <div className="italic">
                  <p>
                    &ldquo;Like the dragon rising through morning mist, your
                    spirit awakens to new possibilities. The ancient wisdom
                    whispers: &lsquo;In stillness, find movement; in movement,
                    find peace.&rsquo;&rdquo;
                    {preferences.showChineseCharacters && ' 如晨雾中升起的龙。'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar & Seasonal Elements */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📅</span>
            Calendar & Seasonal Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Traditional Calendar 传统历法
              </label>
              <p className="text-xs text-soft-gray">
                Show dates according to Chinese lunar calendar alongside
                Gregorian
              </p>
            </div>
            <Toggle
              checked={preferences.useTraditionalCalendar}
              onCheckedChange={checked =>
                onUpdate({ useTraditionalCalendar: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Seasonal Insights 季节洞察
              </label>
              <p className="text-xs text-soft-gray">
                Include seasonal context and timing considerations in
                interpretations
              </p>
            </div>
            <Toggle
              checked={preferences.showSeasonalInsights}
              onCheckedChange={checked =>
                onUpdate({ showSeasonalInsights: checked })
              }
            />
          </div>

          {/* Seasonal Preview */}
          {preferences.showSeasonalInsights && (
            <div className="rounded-lg border border-gentle-silver p-3">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Current Season Context 当前季节背景
              </h4>
              <div className="space-y-1 text-sm text-soft-gray">
                <div>
                  <span className="font-medium">Season:</span> Late Summer
                  (Earth Element)
                  {preferences.showChineseCharacters && ' 长夏（土）'}
                </div>
                <div>
                  <span className="font-medium">Energy:</span> Harvest time,
                  gathering wisdom, centering
                </div>
                <div>
                  <span className="font-medium">Guidance:</span> Focus on
                  grounding and stability in your decisions
                </div>
                {preferences.useTraditionalCalendar && (
                  <div>
                    <span className="font-medium">Lunar Date:</span> 7th month,
                    waxing moon
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cultural Authenticity Notice */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🏛️</span>
            Cultural Authenticity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-l-4 border-earth-brown bg-earth-brown/5 p-4">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              Respectful Practice Notice 尊重实践须知
            </h4>
            <div className="space-y-2 text-xs text-soft-gray">
              <p>
                The I Ching (易經, Yì Jīng) is a profound cultural and
                philosophical work from ancient China, representing thousands of
                years of wisdom and practice.
              </p>
              <p>
                Our interpretations are crafted with deep respect for Chinese
                culture and philosophy, drawing from classical commentaries and
                scholarly traditions while making this wisdom accessible to
                modern practitioners.
              </p>
              <p>
                We encourage users to approach this practice with reverence and
                to continue learning about Chinese philosophy, history, and
                culture to deepen their understanding.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/about/cultural-context"
                className="rounded-md bg-earth-brown px-2 py-1 text-xs text-white hover:bg-earth-brown/80"
              >
                Learn More About I Ching History
              </a>
              <a
                href="/resources/chinese-philosophy"
                className="rounded-md bg-mountain-stone px-2 py-1 text-xs text-white hover:bg-mountain-stone/80"
              >
                Explore Chinese Philosophy
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
