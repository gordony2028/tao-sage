import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai/client';

const SYSTEM_PROMPT = `You are the AI assistant for "Sage" - an I Ching life guidance application. You are knowledgeable, wise, and helpful.

ABOUT SAGE APP:
- An AI-powered I Ching consultation app that provides personalized wisdom
- Users can ask questions and receive hexagram readings with interpretations
- Free users get 3 consultations per week, Sage+ subscribers get unlimited
- Features include daily guidance, consultation history, cultural progress tracking
- Built with respect for traditional Chinese I Ching wisdom

YOUR EXPERTISE AREAS:
1. **I Ching Knowledge**: Hexagram meanings, changing lines, traditional interpretations
2. **App Features**: How to use consultations, daily guidance, subscription tiers
3. **Technical Support**: Account issues, subscription problems, app functionality
4. **Spiritual Guidance**: General wisdom about applying I Ching in daily life

RESPONSE GUIDELINES:
- Be warm, wise, and approachable like a knowledgeable friend
- For I Ching questions: Provide thoughtful, culturally respectful explanations
- For app support: Give clear, helpful instructions
- For complex technical issues: Suggest creating a support ticket
- Keep responses concise but comprehensive (2-4 sentences typically)
- Use emojis sparingly and appropriately
- Always maintain cultural sensitivity about Chinese philosophy

ESCALATION TRIGGERS:
If users mention these issues, suggest creating a support ticket:
- Payment or billing problems
- Account access issues that persist
- Technical bugs or errors
- Feature requests or complaints
- Anything requiring personal account investigation

TONE: Wise, helpful, respectful, and encouraging - like a knowledgeable guide on the spiritual journey.`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build conversation context
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    // Add recent conversation history for context
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-4).forEach((msg: any) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message,
    });

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use the cost-effective model for chat
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Check if response suggests creating a support ticket
    const shouldCreateTicket =
      aiResponse.toLowerCase().includes('support ticket') ||
      aiResponse.toLowerCase().includes('contact support');

    return NextResponse.json({
      message: aiResponse,
      suggestTicket: shouldCreateTicket,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Return helpful fallback response
    return NextResponse.json({
      message: `I apologize, but I'm experiencing some technical difficulties right now. 

Here are some things you can try:
• Browse our FAQ in the Learn section for common questions
• Check your consultation history to review past readings
• For account or technical issues, please create a support ticket

Is there a specific I Ching concept or app feature you'd like to know about? I'll do my best to help once I'm back online!`,
      suggestTicket: true,
    });
  }
}
