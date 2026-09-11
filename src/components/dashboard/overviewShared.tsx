"use client";

import { motion } from "framer-motion";

/** Animated "Overview" heading with an optional subtitle, shared across roles. */
export const OverviewHeader = ({ subtitle }: { subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">Overview</h1>
    {subtitle ? <p className="text-muted-foreground text-sm">{subtitle}</p> : null}
  </motion.div>
);

/** A single-message panel (pending review, approved confirmation, etc.). */
export const OverviewMessagePanel = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="glass-capsule p-8 max-w-2xl"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <div className="text-foreground text-base leading-relaxed">{children}</div>
  </motion.div>
);
