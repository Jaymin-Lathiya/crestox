import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  User,
  Settings,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <motion.nav
      className="nav-island"
      initial={{ x: -100, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isExpanded ? 240 : 64,
      }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        width: { duration: 0.3 }
      }}
    >
      {/* Logo Area */}
      {/* <div className="h-16 flex items-center justify-center border-b border-border">
        <motion.div
          className="text-foreground font-semibold tracking-wider"
          animate={{ opacity: isExpanded ? 1 : 0 }}
        >
          {isExpanded ? "CRESTOX" : ""}
        </motion.div>
        {!isExpanded && (
          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">C</span>
          </div>
        )}
      </div> */}

      {/* Navigation Items */}
      <div className="py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "nav-item flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                isActive && "active"
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon
                className={cn(
                  "w-5 h-5 nav-icon transition-all duration-200",
                  isActive && "text-primary"
                )}
              />
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-label"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Expand Toggle */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button
          onClick={onToggleExpand}
          className="w-8 h-8 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.nav>
  );
};
