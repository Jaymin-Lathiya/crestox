import React from 'react';
import { motion } from 'framer-motion';

type TabType = 'artworks' | 'analytics' | 'achievements' | 'history' | 'collectors';

interface ArtistTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'artworks', label: 'Artworks' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'history', label: 'History' },
  { id: 'collectors', label: 'Collectors' },
];

const ArtistTabs: React.FC<ArtistTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="inline-flex h-11 items-center p-1 bg-card/80 border border-border rounded-full backdrop-blur-md min-w-max"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-3 md:px-5 py-2 font-mono text-xs font-medium transition-colors duration-200 rounded-full whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-muted rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default ArtistTabs;
