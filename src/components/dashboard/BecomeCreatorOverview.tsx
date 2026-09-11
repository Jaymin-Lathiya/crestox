"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Palette, Landmark, Crown, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OverviewHeader } from "./overviewShared";
import { ArtistOverview } from "./ArtistOverview";
import { CuratorOverview } from "./CuratorOverview";
import { OwnerOverview } from "./OwnerOverview";
import type { CreatorRole } from "@/utils/userRoles";

type RoleOption = {
  role: CreatorRole;
  title: string;
  description: string;
  icon: LucideIcon;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "artist",
    title: "Become an Artist",
    description: "List your work and grow your collector base.",
    icon: Palette,
  },
  {
    role: "curator",
    title: "Become a Curator",
    description: "Curate exhibitions and feature standout work.",
    icon: Landmark,
  },
  {
    role: "owner",
    title: "Become an Owner",
    description: "Showcase and manage your art collection.",
    icon: Crown,
  },
];

/**
 * Shown in the portfolio Overview tab to users without a creator role (i.e. they
 * signed up as a collector or skipped role selection). Lets them pick a role to
 * apply for; selecting one renders that role's onboarding flow. The chosen role
 * is only committed server-side once they submit step 1 of the wizard, at which
 * point the profile refetch promotes them and the parent dispatcher takes over.
 */
export const BecomeCreatorOverview = () => {
  const [selected, setSelected] = useState<CreatorRole | null>(null);

  if (selected) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Choose a different role
        </button>
        {selected === "artist" && <ArtistOverview />}
        {selected === "curator" && <CuratorOverview />}
        {selected === "owner" && <OwnerOverview />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OverviewHeader subtitle="You're set up as a collector. Want to do more on Crestox? Apply to become an artist, curator, or owner." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROLE_OPTIONS.map((opt, i) => {
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.role}
              type="button"
              onClick={() => setSelected(opt.role)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-capsule p-6 text-left flex flex-col gap-4 group hover:border-accent/40 hover:bg-accent/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-light text-foreground tracking-tight mb-1">
                  {opt.title}
                </h3>
                <p className="text-sm text-muted-foreground">{opt.description}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                Get started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
