import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "./AuroraBackground";
import { NavigationIsland } from "./NavigationIsland";
import { Menu } from "lucide-react";

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
    const [isNavExpanded, setIsNavExpanded] = useState(false); // 👈 collapsed by default

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex">
      
      <NavigationIsland
        activeTab={activeTab}
        onTabChange={onTabChange}
        isExpanded={isNavExpanded}
        onToggleExpand={() => setIsNavExpanded(!isNavExpanded)}
      />

      <motion.main
  className="min-h-screen w-full transition-all duration-300"
  animate={{
    marginLeft: isNavExpanded ? 50 : 0, // 👈 0 instead of 25
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  }}
>
  {/* Hamburger — mobile only */}
{!isNavExpanded && (
  <button
    className="md:hidden fixed top-28 right-4 z-40 p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors shadow-lg"
    onClick={() => setIsNavExpanded(true)}
  >
    <Menu className="w-4 h-4" />
  </button>
)}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};
