'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'basics' | 'cultural' | 'technical' | 'usage';
  tags: string[];
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const faqData: FAQItem[] = [
    {
      id: 'what-is-iching',
      question: 'What is the I Ching and is this authentic?',
      answer: `The I Ching (易經), also known as the Book of Changes, is a ancient Chinese divination text and philosophical system dating back over 3,000 years. Our application uses traditional hexagram generation methods and interpretations based on the Wilhelm-Baynes translation, enhanced with AI for personalized guidance.

We strive to maintain cultural authenticity by:
• Using traditional 64-hexagram system with accurate names and meanings
• Following classical coin-tossing or yarrow stalk methods for hexagram generation
• Providing historical context and cultural background
• Partnering with scholars to ensure respectful representation
• Clearly distinguishing between traditional wisdom and modern AI insights`,
      category: 'cultural',
      tags: ['authenticity', 'tradition', 'history'],
    },
    {
      id: 'how-accurate-ai',
      question: 'How accurate are the AI interpretations?',
      answer: `Our AI interpretations are designed to complement, not replace, traditional I Ching wisdom. Here's how it works:

**AI Role:**
• Provides personalized insights based on your specific question and context
• Draws from traditional interpretations while making them accessible
• Considers your consultation history for pattern recognition
• Offers practical guidance for modern life situations

**Limitations:**
• AI cannot predict the future or make decisions for you
• Interpretations are suggestions for contemplation, not absolute truth
• The value comes from reflection and self-discovery, not external prediction

**Best Practice:** Use AI insights as a starting point for deeper contemplation and combine them with traditional hexagram meanings and your own intuition.`,
      category: 'technical',
      tags: ['AI', 'accuracy', 'interpretation', 'guidance'],
    },
    {
      id: 'cultural-appropriation',
      question: 'Is using the I Ching cultural appropriation?',
      answer: `This is an important and sensitive question. We believe respectful engagement with wisdom traditions can be beneficial when approached with proper understanding and reverence.

**Cultural Appropriation vs. Appreciation:**
• **Appropriation:** Taking elements without understanding, permission, or respect
• **Appreciation:** Learning with respect, understanding context, and acknowledging origins

**Our Approach:**
• We provide historical context and cultural background
• We acknowledge the Chinese origins and cultural significance
• We encourage learning about Taoist philosophy and Chinese culture
• We work with cultural consultants and I Ching scholars
• We avoid claims of ownership or superficial use

**Your Responsibility:**
• Approach with genuine respect and curiosity
• Learn about the cultural context, not just the practice
• Understand this is a sacred tradition for many people
• Use the wisdom for personal growth, not entertainment
• Consider learning more about Chinese philosophy and history`,
      category: 'cultural',
      tags: ['cultural sensitivity', 'appropriation', 'respect'],
    },
    {
      id: 'questions-to-ask',
      question: 'What questions should I ask the I Ching?',
      answer: `The I Ching works best with thoughtful, open-ended questions that invite wisdom rather than demand predictions.

**Effective Questions:**
• "How can I approach this challenge?"
• "What should I consider about this relationship?"
• "What do I need to understand about this situation?"
• "How can I best support my personal growth right now?"
• "What is the nature of this decision I'm facing?"

**Less Effective Questions:**
• Yes/no questions ("Should I take this job?")
• Specific predictions ("When will I get married?")
• Questions about others' private thoughts or actions
• Repetitive questions about the same issue

**Question Guidelines:**
• Focus on your own path and growth
• Ask about understanding and wisdom, not just outcomes
• Be specific about the area of life you're exploring
• Come with genuine openness to insight
• Frame questions positively when possible`,
      category: 'usage',
      tags: ['consultation', 'questions', 'guidance'],
    },
    {
      id: 'how-often-consult',
      question: 'How often should I consult the I Ching?',
      answer: `The I Ching is most effective when used thoughtfully rather than compulsively. Traditional practice emphasizes quality over quantity.

**Traditional Guidelines:**
• Consult when facing genuine uncertainty or transitions
• Allow time to contemplate previous consultations before asking again
• Avoid asking the same question repeatedly in short periods
• Use it as a tool for reflection, not daily decision-making

**Recommended Frequency:**
• **Daily Guidance:** Light consultation for reflection (our daily feature)
• **Specific Issues:** Deep consultation when facing important decisions
• **Personal Growth:** Regular but spaced consultations for ongoing development
• **Crisis Situations:** May warrant more frequent consultation with careful reflection

**Signs of Overuse:**
• Asking the same question multiple times
• Using it to avoid making your own decisions
• Consulting for trivial daily choices
• Feeling anxious without constant guidance

Remember: The I Ching is meant to develop your inner wisdom, not replace your own judgment.`,
      category: 'usage',
      tags: ['frequency', 'practice', 'wisdom'],
    },
    {
      id: 'hexagram-meanings',
      question: 'Do I need to memorize all 64 hexagram meanings?',
      answer: `No, memorization isn't necessary for meaningful I Ching practice. Understanding develops naturally through experience and study.

**Learning Approach:**
• Start with the hexagrams you receive in consultations
• Learn the basic principles (Yin/Yang, trigrams) first
• Focus on understanding patterns rather than memorizing details
• Use our educational materials to deepen knowledge gradually

**What's Most Important:**
• Understanding the core philosophy of change and balance
• Recognizing Yin and Yang qualities in life situations
• Developing intuition and reflective practice
• Learning from each consultation experience

**Study Tools We Provide:**
• Individual hexagram study pages with detailed explanations
• Progress tracking to see which concepts you've mastered
• Interactive learning features to reinforce understanding
• Search and filter tools to explore hexagrams by theme

**Traditional Perspective:** Even lifelong I Ching scholars continue discovering new layers of meaning. The value is in ongoing contemplation and application, not perfect memorization.`,
      category: 'basics',
      tags: ['learning', 'hexagrams', 'study', 'memory'],
    },
    {
      id: 'daily-vs-consultation',
      question:
        "What's the difference between daily guidance and full consultation?",
      answer: `We offer two types of I Ching experiences designed for different purposes and levels of depth.

**Daily Guidance:**
• Quick, reflective insight for the day ahead
• Simplified interpretation focused on practical wisdom
• Ideal for daily reflection and mindfulness practice
• Usually takes 2-3 minutes to contemplate
• Helps develop regular connection with I Ching wisdom

**Full Consultation:**
• Comprehensive reading for specific questions or situations
• Detailed analysis including changing lines and second hexagram
• Deep AI interpretation considering your personal context
• Traditional and modern perspectives provided
• Designed for important decisions or life transitions
• May take 15-30 minutes for full contemplation

**When to Use Each:**
• **Daily Guidance:** Morning reflection, general life awareness, developing practice
• **Full Consultation:** Major decisions, relationship issues, career changes, spiritual questions

Both approaches are valuable and can complement each other in your I Ching practice.`,
      category: 'usage',
      tags: ['daily guidance', 'consultation', 'practice'],
    },
    {
      id: 'technical-issues',
      question: "I'm having technical issues with the app. What should I do?",
      answer: `We strive to provide a smooth experience for your I Ching practice. Here are common solutions:

**Common Issues & Solutions:**

**App Not Loading:**
• Check your internet connection
• Try refreshing the page
• Clear your browser cache and cookies
• Try using a different browser or device

**Consultation Not Generating:**
• Ensure you're logged in to your account
• Check that JavaScript is enabled in your browser
• Try simplifying your question if it's very long
• Contact support if the issue persists

**History Not Saving:**
• Make sure you're logged into your account
• Check if third-party cookies are blocked
• Try logging out and back in

**PWA Installation Issues:**
• Use a supported browser (Chrome, Safari, Edge, Firefox)
• Make sure you're on a secure (HTTPS) connection
• Look for the install prompt in your browser's address bar

**Performance Issues:**
• Close unnecessary browser tabs
• Check if your device has sufficient storage
• Try using the app on a faster internet connection

**Getting Help:**
If these solutions don't resolve your issue, please contact our support team with:
• Description of the problem
• Your device and browser information
• Screenshots if helpful`,
      category: 'technical',
      tags: ['troubleshooting', 'support', 'technical'],
    },
    {
      id: 'privacy-data',
      question: 'How is my personal data and consultation history protected?',
      answer: `We take your privacy and the sacred nature of your I Ching practice seriously. Your consultations are personal and deserve protection.

**Data Protection:**
• All data is encrypted in transit and at rest
• We use secure, industry-standard database systems
• Access to personal data is strictly limited and audited
• We never share consultation content with third parties

**What We Store:**
• Your consultation questions and hexagram results
• Study progress and achievement data
• Basic account information (email, preferences)
• Usage analytics (anonymized for app improvement)

**What We Don't Store:**
• Credit card information (handled by secure payment processors)
• Unnecessary personal details
• Consultation content is not used to train AI models without consent

**Your Rights:**
• View all your stored data
• Export your consultation history
• Delete your account and all associated data
• Control data sharing preferences

**AI and Privacy:**
• AI interpretations are generated in real-time
• Your consultation context is used only for your session
• We don't create profiles or make assumptions based on your spiritual practice

See our Privacy Policy for complete details on data handling and your rights.`,
      category: 'technical',
      tags: ['privacy', 'data protection', 'security'],
    },
    {
      id: 'different-interpretations',
      question:
        'Why do different I Ching sources give different interpretations?',
      answer: `I Ching interpretations can vary between sources due to the rich, layered nature of this ancient text and different scholarly approaches.

**Reasons for Variation:**

**Historical Development:**
• The I Ching evolved over 3,000 years with contributions from many sages
• Different dynasties and schools emphasized different aspects
• Commentary layers were added by various scholars throughout history

**Translation Challenges:**
• Ancient Chinese concepts don't always have direct English equivalents
• Poetic and symbolic language allows for multiple valid interpretations
• Cultural context affects understanding and translation choices

**Scholarly Approaches:**
• Traditional vs. modern interpretations
• Emphasis on divination vs. philosophy
• Different schools of Chinese thought (Confucian, Taoist, etc.)

**Our Approach:**
• We primarily follow the Wilhelm-Baynes translation (widely respected)
• We provide both traditional and contemporary perspectives
• AI interpretations draw from multiple scholarly sources
• We acknowledge interpretation as part of the contemplative process

**What This Means for You:**
• Multiple perspectives can enrich understanding
• Trust your intuition when evaluating interpretations
• Consider the source and approach of different teachings
• Focus on what resonates and supports your growth

The beauty of the I Ching lies partly in its ability to speak differently to different people while maintaining its essential wisdom.`,
      category: 'basics',
      tags: ['interpretation', 'sources', 'translations', 'variations'],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'basics', name: 'I Ching Basics', icon: '☯️' },
    { id: 'cultural', name: 'Cultural Sensitivity', icon: '🙏' },
    { id: 'technical', name: 'Technical Questions', icon: '⚙️' },
    { id: 'usage', name: 'Usage & Practice', icon: '🎯' },
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-ink-black">
          Frequently Asked Questions
        </h1>
        <p className="mb-6 text-lg text-soft-gray">
          Common questions about I Ching practice, cultural sensitivity, and
          using our application
        </p>
      </div>

      {/* Search and Filters */}
      <Card variant="default" className="mb-8">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-mountain-stone">
                Search Questions
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by keyword..."
                className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-mountain-stone">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-flowing-water text-white'
                    : 'bg-gentle-silver/20 text-mountain-stone hover:bg-gentle-silver/30'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-soft-gray">
        Showing {filteredFAQs.length} questions
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map(faq => {
          const isExpanded = expandedItems.includes(faq.id);

          return (
            <Card key={faq.id} variant="default" className="overflow-hidden">
              <CardHeader
                className="cursor-pointer transition-colors hover:bg-gentle-silver/10"
                onClick={() => toggleExpanded(faq.id)}
              >
                <div className="flex items-start justify-between">
                  <CardTitle className="pr-4 text-lg leading-tight">
                    {faq.question}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap rounded-full bg-flowing-water/10 px-2 py-1 text-xs text-flowing-water">
                      {categories.find(c => c.id === faq.category)?.name}
                    </span>
                    <span
                      className={`transform transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none">
                    {faq.answer.split('\n\n').map((paragraph, index) => {
                      // Handle bold text
                      if (
                        paragraph.startsWith('**') &&
                        paragraph.endsWith('**')
                      ) {
                        return (
                          <h4
                            key={index}
                            className="mb-2 mt-4 font-medium text-mountain-stone"
                          >
                            {paragraph.slice(2, -2)}
                          </h4>
                        );
                      }

                      // Handle bullet points
                      if (paragraph.includes('• ')) {
                        const items = paragraph
                          .split('\n')
                          .filter(line => line.trim().startsWith('• '));
                        return (
                          <ul
                            key={index}
                            className="mb-4 list-inside list-disc space-y-1 text-soft-gray"
                          >
                            {items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item.replace('• ', '')}</li>
                            ))}
                          </ul>
                        );
                      }

                      // Regular paragraph
                      return (
                        <p
                          key={index}
                          className="mb-4 leading-relaxed text-soft-gray"
                        >
                          {paragraph.split('**').map((part, partIndex) =>
                            partIndex % 2 === 1 ? (
                              <strong
                                key={partIndex}
                                className="text-mountain-stone"
                              >
                                {part}
                              </strong>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      );
                    })}
                  </div>

                  {/* Tags */}
                  {faq.tags.length > 0 && (
                    <div className="border-t border-stone-gray/20 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map(tag => (
                          <span
                            key={tag}
                            className="rounded-full bg-gentle-silver/20 px-2 py-1 text-xs text-soft-gray"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredFAQs.length === 0 && (
        <Card variant="default" className="py-12 text-center">
          <CardContent>
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="mb-2 text-xl font-medium text-mountain-stone">
              No questions found
            </h3>
            <p className="mb-4 text-soft-gray">
              Try adjusting your search terms or category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-flowing-water hover:underline"
            >
              Clear filters
            </button>
          </CardContent>
        </Card>
      )}

      {/* Contact Section */}
      <Card variant="elevated" className="mt-8 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">💬</span>
            <div>
              <h3 className="mb-2 font-medium text-blue-800">
                Still have questions?
              </h3>
              <p className="mb-3 text-sm text-blue-700">
                If you can&apos;t find the answer you&apos;re looking for,
                we&apos;re here to help. Our team includes I Ching practitioners
                and cultural consultants.
              </p>
              <div className="flex gap-3 text-sm">
                <a href="/contact" className="text-blue-700 hover:underline">
                  Contact Support
                </a>
                <span className="text-blue-600">•</span>
                <a
                  href="/cultural-respect"
                  className="text-blue-700 hover:underline"
                >
                  Cultural Guidelines
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
