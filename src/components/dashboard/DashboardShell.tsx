import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "./AuroraBackground";
import { NavigationIsland } from "./NavigationIsland";

interface DashboardShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardShell = ({
  children,
  activeTab,
  onTabChange,
}: DashboardShellProps) => {
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex">
      {/* The Breath - Aurora Background */}
      {/* <AuroraBackground /> */}

      {/* The Command Center - Navigation Island */}
      <NavigationIsland
        activeTab={activeTab}
        onTabChange={onTabChange}
        isExpanded={isNavExpanded}
        onToggleExpand={() => setIsNavExpanded(!isNavExpanded)}
      />

      {/* Main Content Area */}
      <motion.main
        className="min-h-screen transition-all duration-300"
        animate={{
          marginLeft: isNavExpanded ? 50 : 25,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};
