'use client'

import { ReactNode, useState, createContext, useContext } from 'react';

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

interface Tab {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
}

export function Tabs({ children, defaultValue, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={`flex w-full overflow-x-auto scrollbar-hide border-b mb-4 ${className || ''}`}>
      <div className="flex min-w-full sm:min-w-0 space-x-1">
        {children}
      </div>
    </div>
  );
}

export function TabsTrigger({ children, value }: { children: ReactNode, value: string }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  const { activeTab, setActiveTab } = context;

  return (
    <button 
      className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
        activeTab === value 
          ? 'border-b-2 border-black' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value }: { children: ReactNode, value: string }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  const { activeTab } = context;

  if (activeTab !== value) return null;
  return <div className="w-full overflow-x-auto">{children}</div>;
}