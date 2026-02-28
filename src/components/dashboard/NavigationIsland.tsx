import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  User,
  Settings,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ... navItems same as before ...
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
const navItems: NavItem[] = [
  { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
  { id: "artworks", label: "ARTWORKS", icon: Image },
  { id: "analytics", label: "ANALYTICS", icon: TrendingUp },
  { id: "profile", label: "PROFILE", icon: User },
  { id: "settings", label: "SETTINGS", icon: Settings },
];
interface NavigationIslandProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const NavigationIsland = ({
  activeTab,
  onTabChange,
  isExpanded,
  onToggleExpand,
}: NavigationIslandProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggleExpand}
          />
        )}
      </AnimatePresence>

      <motion.nav
        className={cn(
          "nav-island fixed md:relative z-30 h-screen",
          !isExpanded && "max-md:-translate-x-full max-md:invisible",
        )}
        style={{
          // 👇 force blur background on mobile, overrides nav-island CSS
          ...((
            typeof window !== "undefined" &&
            window.innerWidth < 768 &&
            isExpanded
          ) ?
            {
              background: "rgba(10, 10, 20, 0.4)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }
          : {}),
        }}
        animate={{
          x: 0,
          opacity: 1,
          width:
            typeof window !== "undefined" && window.innerWidth < 768 ?
              isExpanded ? "100vw"
              : 0
            : isExpanded ? 240
            : 64,
        }}
      >
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-6 py-5 border-b border-border/30">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Menu
          </span>
          <button
            onClick={onToggleExpand}
            className="text-muted-foreground hover:text-foreground pr-6"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav items — larger on mobile */}
        <div className="py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 768) onToggleExpand();
                }}
                className={cn(
                  "nav-item flex items-center gap-4 px-6 py-3 transition-all duration-200",
                  "md:px-4 md:py-2 md:rounded-md md:gap-2",
                  isActive && "active",
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon
                  className={cn("w-5 h-5 nav-icon", isActive && "text-primary")}
                />
                {/* Always show labels on mobile */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-label md:hidden block"
                >
                  {item.label}
                </motion.span>
                {/* Desktop: only show when expanded */}
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-label hidden md:block"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Desktop expand toggle only */}
        <div className="absolute bottom-4 left-0 right-0 hidden md:flex justify-center">
          <button
            onClick={onToggleExpand}
            className="w-8 h-8 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors"
          >
            {isExpanded ?
              <ChevronLeft className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>
    </>
  );
};
