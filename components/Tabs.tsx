'use client';

import { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '');

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div>
      {/* Pestañas */}
      <div className="flex items-center border-b border-gray-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-body transition-all duration-fast border-b-2 ${
              activeTab === tab.id
                ? 'text-gray-text-primary font-semibold relative'
                : 'text-gray-text-tertiary hover:text-gray-text-primary border-transparent'
            }`}
            style={activeTab === tab.id ? {
              borderBottomColor: 'rgba(100, 150, 200, 0.2)',
              textShadow: '0px 0px 8px rgba(100, 150, 200, 0.15)',
            } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de Pestaña Activa */}
      <div className="mt-4">{activeContent}</div>
    </div>
  );
}

