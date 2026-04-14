import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1); // 1px tolerance
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-full group">
      
      {/* Mobile/Small Screen Arrows */}
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1d24] text-white shadow-xl hover:bg-[#2a2d34] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1d24] text-white shadow-xl hover:bg-[#2a2d34] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto pb-2 -mx-4 px-10 md:mx-0 md:px-0 md:justify-center scrollbar-hide relative snap-x"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-flex min-h-[44px] items-center p-1 md:bg-card/80 md:border md:border-border rounded-full md:backdrop-blur-md min-w-max shrink-0"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 md:px-5 py-2 md:font-mono text-[15px] font-sans md:text-xs font-medium transition-colors duration-200 rounded-full whitespace-nowrap snap-center ${
                activeTab === tab.id 
                  ? 'text-white md:text-foreground' 
                  : 'text-zinc-500 hover:text-foreground'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-[#0a0a0a] md:bg-muted rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </motion.div>
      </div>

    </div>
  );
};

export default ArtistTabs;
