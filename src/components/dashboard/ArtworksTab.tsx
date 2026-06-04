"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ArtworkCard } from "./ArtworkCard";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import {
  getMyPortfolioArtworks,
  type MyPortfolioArtworkItem,
} from "@/apis/my-portfolio/myPortfolioActions";
import { strings } from "@/utils/strings";

type FilterStatus = "all" | "live" | "pending" | "draft";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

function buildMediaUrl(filePath: string | null | undefined): string {
  if (!filePath) return PLACEHOLDER_IMAGE;
  if (filePath.startsWith("http")) return filePath;
  const base = strings.base_url?.replace(/\/api\/?$/, "") ?? "";
  return filePath.startsWith("/") ? `${base}${filePath}` : `${base}/${filePath}`;
}

/** Card UI status: Live = APPROVED, Pending = PENDING, Draft unused (API has no drafts). */
function apiStatusToCardStatus(
  status: MyPortfolioArtworkItem["status"]
): "live" | "pending" | "draft" {
  if (status === "APPROVED") return "live";
  return "pending";
}

function mapToCardArtwork(item: MyPortfolioArtworkItem) {
  return {
    id: String(item.artwork_id),
    title: `Artwork #${item.artwork_id}`,
    imageUrl: buildMediaUrl(item.primary_image_url),
    status: apiStatusToCardStatus(item.status),
    grade: "—",
    fractalsTotal: 0,
    fractalsSold: 0,
    price: 0,
  };
}

export const ArtworksTab = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [filter, setFilter] = useState<FilterStatus>("all");

  const artistProfileId = user?.artist_profile_id ?? null;

  const { data: portfolioItems = [], isLoading, isError, error } = useQuery({
    queryKey: ["my-portfolio", artistProfileId],
    queryFn: async () => {
      const res = await getMyPortfolioArtworks(artistProfileId!)();
      const payload = res?.data as { data?: MyPortfolioArtworkItem[] };
      return payload?.data ?? [];
    },
    enabled: typeof artistProfileId === "number" && !Number.isNaN(artistProfileId),
  });

  useEffect(() => {
    if (!isError || !error) return;
    const msg =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Failed to load artworks";
    toast.error(msg, { id: "my-portfolio-load-error" });
  }, [isError, error]);

  const filteredArtworks = useMemo(() => {
    if (filter === "all") return portfolioItems;
    if (filter === "live") {
      return portfolioItems.filter((a) => a.status === "APPROVED");
    }
    if (filter === "pending") {
      return portfolioItems.filter((a) => a.status === "PENDING");
    }
    // Draft: not returned by this API
    return [];
  }, [portfolioItems, filter]);

  const cardArtworks = useMemo(
    () => filteredArtworks.map(mapToCardArtwork),
    [filteredArtworks]
  );

  console.log(cardArtworks);

  const canAddArtwork = user?.artist_profile_approved === true;

  const handleAddArtwork = () => {
    if (canAddArtwork) {
      router.push("/portfolio/artwork/create");
    } else {
      toast.error("Your artist profile is not verified yet");
    }
  };

  const filterButtons: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "live", label: "Live" },
    { value: "pending", label: "Pending" },
    { value: "draft", label: "Draft" },
  ];

  return (
    <div className="space-y-8 md:px-20">
      {/* Header */}
      <motion.div
        className="flex gap-1 p-1 bg-card/40 backdrop-blur-sm border border-border w-fit max-w-full overflow-x-auto scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
            My Artworks
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your portfolio and track fractal sales
          </p>
        </div>

        {/* Add New Button - only enabled when artist profile is approved */}
        <motion.button
          className={cn(
            "flex items-center gap-2 px-6 py-3",
            canAddArtwork ? "btn-liquid-metal" : "opacity-60 cursor-not-allowed bg-muted"
          )}
          whileHover={canAddArtwork ? { scale: 1.02 } : undefined}
          whileTap={canAddArtwork ? { scale: 0.98 } : undefined}
          onClick={handleAddArtwork}
          title={
            !canAddArtwork
              ? "Your artist profile must be approved to add artworks"
              : undefined
          }
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm uppercase tracking-wider">Add Artwork</span>
        </motion.button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-1 p-1 bg-card/40 backdrop-blur-sm border border-border w-fit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={cn(
              "px-4 py-2 text-xs uppercase tracking-wider transition-all duration-200",
              filter === btn.value
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {btn.label}
          </button>
        ))}
      </motion.div>

      {!artistProfileId && (
        <p className="text-sm text-muted-foreground">
          Create or link an artist profile to see your artworks here.
        </p>
      )}

      {isLoading && artistProfileId ? (
        <p className="text-sm text-muted-foreground">Loading artworks…</p>
      ) : null}

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {cardArtworks.map((artwork, index) => (
          <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {artistProfileId && !isLoading && cardArtworks.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            type="button"
            onClick={handleAddArtwork}
            title={
              !canAddArtwork
                ? "Your artist profile must be approved to add artworks"
                : "Add artwork"
            }
            className={cn(
              "w-16 h-16 border border-border rounded-full flex items-center justify-center mb-4 transition-colors",
              canAddArtwork
                ? "hover:border-foreground hover:bg-muted/50 cursor-pointer"
                : "opacity-60 cursor-not-allowed"
            )}
          >
            <Plus className="w-6 h-6 text-muted-foreground" />
          </button>
          <p className="text-muted-foreground">No artworks found</p>
        </motion.div>
      )}
    </div>
  );
};
