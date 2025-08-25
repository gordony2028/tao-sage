'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 Hello! I'm your AI guide for Sage - I Ching wisdom.

I can help you with:
🔮 **I Ching interpretations** - Understand your hexagrams and readings
🧭 **App guidance** - Learn how to use Sage features
💡 **Spiritual questions** - General wisdom about the I Ching path
🎯 **Account help** - Subscriptions, limits, and technical issues

What would you like to know?`,
  timestamp: new Date(),
};

export default function ChatWidget({ isOpen, onToggle }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I'm having trouble connecting right now. 

For immediate help, you can:
• Check our FAQ in the Learn section
• Create a support ticket for personal assistance
• Try asking your question again in a moment

Is there anything specific I can help you with about the I Ching or using Sage?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="group fixed bottom-6 right-6 z-50 rounded-full bg-flowing-water p-4 text-white shadow-lg transition-all duration-300 hover:bg-flowing-water/90 hover:shadow-xl"
        aria-label="Open chat support"
      >
        <MessageCircle size={24} />
        <span className="absolute -right-2 -top-2 flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-sunset-gold text-xs text-white">
          ?
        </span>
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 flex h-[500px] w-96 flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg bg-flowing-water p-4 text-white">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} />
          <h3 className="font-medium">Sage AI Assistant</h3>
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 transition-colors hover:text-white"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={onToggle}
            className="text-white/80 transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-yang p-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-flowing-water text-white'
                      : 'border bg-white text-mountain-stone shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div
                    className={`mt-2 text-xs ${
                      message.role === 'user'
                        ? 'text-white/70'
                        : 'text-soft-gray'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg border bg-white p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-flowing-water"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-flowing-water"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-flowing-water"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-sm text-soft-gray">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <CardContent className="border-t p-4">
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                ref={inputRef}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask about the I Ching or how to use Sage..."
                className="flex-1 rounded-lg border border-stone-gray/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flowing-water"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputMessage.trim() || isLoading}
                className="px-3"
              >
                <Send size={16} />
              </Button>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  );
}
