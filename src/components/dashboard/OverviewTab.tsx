"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { Skeleton } from "@/components/ui/skeleton";
import { getPrimaryCreatorRole } from "@/utils/userRoles";
import { ArtistOverview } from "./ArtistOverview";
import { CuratorOverview } from "./CuratorOverview";
import { OwnerOverview } from "./OwnerOverview";
import { BecomeCreatorOverview } from "./BecomeCreatorOverview";

/**
 * Role-aware dispatcher for the portfolio "Overview" tab. Handles the shared
 * not-signed-in / profile-loading states, then renders the onboarding + dashboard
 * appropriate to the user's creator role (artist / curator / owner). Users with
 * no creator role (collectors / skipped selection) get a chooser to apply for one.
 */
export const OverviewTab = () => {
  const { user, isLoading: profileLoading, isInitialized: profileInitialized } = useUserStore();

  // Profile still loading (e.g. a hard refresh): show a skeleton instead of the
  // signed-out message, which would otherwise flash for logged-in users.
  if (!user && (profileLoading || !profileInitialized)) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-40 mb-3" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full rounded-xl lg:col-span-2" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">Overview</h1>
          <p className="text-muted-foreground text-sm">Sign in to see your portfolio analytics.</p>
        </motion.div>
      </div>
    );
  }

  const role = getPrimaryCreatorRole(user);
  if (role === "artist") return <ArtistOverview />;
  if (role === "curator") return <CuratorOverview />;
  if (role === "owner") return <OwnerOverview />;

  // No creator role yet (collector / skipped): let them apply for one.
  return <BecomeCreatorOverview />;
};
