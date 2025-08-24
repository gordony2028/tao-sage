import React, { useState, createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  value,
  onValueChange,
  children,
  className = '',
}: TabsProps) {
  return (
    <TabsContext.Provider
      value={{ activeTab: value, setActiveTab: onValueChange }}
    >
      <div className={`${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex border-b border-stone-gray ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className = '',
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        px-4 py-2 text-sm font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-flowing-water focus:ring-offset-2
        ${
          isActive
            ? 'border-b-2 border-flowing-water text-flowing-water'
            : disabled
              ? 'cursor-not-allowed text-stone-gray'
              : 'border-b-2 border-transparent text-soft-gray hover:border-stone-gray hover:text-mountain-stone'
        }
        ${className}
      `}
      onClick={() => !disabled && setActiveTab(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className = '',
}: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { activeTab } = context;

  if (activeTab !== value) {
    return null;
  }

  return <div className={`pt-4 ${className}`}>{children}</div>;
}
