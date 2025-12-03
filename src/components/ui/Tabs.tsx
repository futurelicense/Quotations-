import React, { useState } from 'react';
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}
interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}
export function Tabs({
  tabs,
  defaultTab
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  return <div>
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`
                pb-3 px-1 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id ? 'border-primary-400 text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}>
              {tab.label}
            </button>)}
        </nav>
      </div>
      <div className="mt-6">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>;
}