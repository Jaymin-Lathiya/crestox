import React from 'react';
import { motion } from 'framer-motion';

interface NavigationPillProps {
  className?: string;
}

const NavigationPill: React.FC<NavigationPillProps> = ({ className = "" }) => {
  return (
    <motion.nav 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 ${className}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-6">
        <NavItem label="GALLERY" active />
        <NavItem label="ARTISTS" />
        <NavItem label="AUCTIONS" />
        <NavItem label="ABOUT" />
      </div>
    </motion.nav>
  );
};

const NavItem: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => {
  return (
    <button 
      className={`font-mono text-[11px] tracking-[0.15em] uppercase transition-colors duration-200 ${
        active ? 'text-acid' : 'text-ghost hover:text-marble'
      }`}
    >
      {label}
    </button>
  );
};

export default NavigationPill;
