"use client";

import ExplodedCanvas from "@/components/canvas/ExplodedCanvas";
import { useCallback, useEffect, useState } from "react";
import FinancialHUD from "@/components/FinancialHUD";
import AnalyticsTab from "@/components/artist/AnalyticsTab";
import ManifestoBlock from "@/components/ManifestoBlock";
import TechSpecs from "@/components/TechSpecs";
import ArtistReel from "@/components/ArtistReel";
import NavigationPill from "@/components/NavigationPill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getArtworkById, getArtworksByArtist, getPriceHistory } from "@/apis/artwork/artworkActions";
import { useParams, useRouter } from "next/navigation";

/** API artwork media item */
interface ArtworkMediaItem {
  id: number;
  artwork_id: number;
  media_id: number;
  display_order: number;
  is_primary: boolean;
  media: {
    media_id: number;
    file_path: string;
    original_file_name?: string;
    mimetype?: string;
    file_name?: string;
    size?: number;
    orientation?: string;
  };
}

/** API artwork share item */
interface ArtworkShare {
  id: number;
  artwork_id: number;
  current_price: string;
  active_flag: boolean;
}

/** API artwork by id response */
export interface ArtworkDetail {
  id: number;
  name: string;
  description: string;
  materials_used: string;
  height: number;
  length: number;
  breadth: number;
  demensions_unit: string;
  approval_status: string;
  number_of_shares: number;
  starting_price: string;
  valuation: string;
  quality_score: string;
  market_premium?: string;
  created_at: string;
  updated_at: string;
  artist_profile_id?: number;
  artist_profile?: { id: number; artist_name: string; user_id: number };
  artwork_media?: ArtworkMediaItem[];
  shares?: ArtworkShare[];
}

/** API artwork list item (same shape as detail, used in artist reel) */
export type ArtworkListItem = ArtworkDetail;

function ArtDetailSkeleton() {
  return (
    <main className="bg-void min-h-screen relative">
      <div className="noise-overlay" />
      <div className="w-full h-[90vh] relative z-20 flex items-center justify-center bg-background/5">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="relative z-10 px-8 md:px-16 py-10 space-y-8">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="max-w-[800px] space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </main>
  );
}

function buildDetailsMetadata(artwork: ArtworkDetail | null): { label: string; value: string | null }[] {
  if (!artwork) return [];
  const dims = [artwork.height, artwork.length, artwork.breadth].filter((n) => n != null && n > 0).join(" × ");
  const dimensions = dims ? `${dims} ${artwork.demensions_unit || ""}`.trim() : null;
  return [
    { label: "Medium", value: artwork.materials_used || null },
    { label: "Dimensions", value: dimensions || null },
    { label: "Number of shares", value: String(artwork.number_of_shares) },
    { label: "Starting price", value: artwork.starting_price ? `₹${artwork.starting_price}` : null },
    { label: "Valuation", value: artwork.valuation ? `₹${artwork.valuation}` : null },
    { label: "Quality score", value: artwork.quality_score || null },
    { label: "Approval status", value: artwork.approval_status || null },
    {
      label: "Created",
      value: artwork.created_at
        ? new Date(artwork.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : null,
    },
  ];
}

function mapArtworkToReelItem(a: ArtworkListItem): { id: string; title: string; imageUrl: string; price: number } {
  const filePath = a.artwork_media?.[0]?.media?.file_path ?? "";
  const price = parseFloat(a.valuation ?? a.starting_price ?? "0") || 0;
  return {
    id: String(a.id),
    title: a.name,
    imageUrl: filePath,
    price,
  };
}

const Index = () => {
  const [exploded, setExploded] = useState(false);
  const [artwork, setArtwork] = useState<ArtworkDetail | null>(null);
  const [artworkByArtist, setArtworkByArtist] = useState<ArtworkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  const fetchArtworkById = useCallback(async () => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    try {
      const res = await getArtworkById(id)();
      if (res?.status === 200 && res?.data?.data) {
        const data = res.data.data as ArtworkDetail;
        setArtwork(data);
        const artistId = data.artist_profile_id ?? data.artist_profile?.id;
        if (artistId != null) {
          const artistRes = await getArtworksByArtist(String(artistId))();
          if (artistRes?.status === 200 && Array.isArray(artistRes.data?.data)) {
            setArtworkByArtist(artistRes.data.data);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchPriceHistory = async () => {
    if (!id || typeof id !== "string") return;
    let params = {
        price_type: "VALUATION",
    }
    const res = await getPriceHistory(id as string,params)();
    console.log("res", res);
  }

  useEffect(() => {
    fetchArtworkById();
    fetchPriceHistory();
  }, [fetchArtworkById]);

  const handleCollect = async () => {
    const artistId = artwork?.artist_profile_id ?? artwork?.artist_profile?.id;
    if (artistId != null) {
      router.push(`/artist/${artistId}`);
    }
  };

  const artworkImageUrl = artwork?.artwork_media?.[0]?.media?.file_path ?? "";
  const metadata = buildDetailsMetadata(artwork);
  const reelArtworks = artworkByArtist.map(mapArtworkToReelItem).filter((a) => a.imageUrl);
  const artistName = artwork?.artist_profile?.artist_name ?? "";
  const pricePerFractal = artwork?.shares?.[0]?.current_price
    ? parseFloat(artwork.shares[0].current_price)
    : parseFloat(artwork?.starting_price ?? "0");
  const totalValuation = artwork?.valuation ? parseFloat(artwork.valuation) : 0;
  const totalFractals = artwork?.number_of_shares ?? 0;
  const soldCount = artwork?.shares?.length ?? 0;
  const availableFractals = Math.max(0, totalFractals - soldCount);

  if (loading) {
    return (
      <>
        <ArtDetailSkeleton />
        <NavigationPill />
      </>
    );
  }

  return (
    <main className="bg-void min-h-screen relative">
      <div className="noise-overlay" />

      <div className="w-full h-[90vh] relative z-20">
        <ExplodedCanvas
          exploded={exploded}
          onToggle={() => setExploded(!exploded)}
          artworkUrl={artworkImageUrl || "/placeholder-art.jpg"}
          artworkName={artwork?.name}
        />
      </div>

      <FinancialHUD
        pricePerFractal={pricePerFractal}
        totalValuation={totalValuation}
        availableFractals={availableFractals}
        totalFractals={totalFractals}
        onCollect={handleCollect}
      />

      <div className="relative z-10 px-8 md:px-16 py-10 md:pr-[400px]">
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="mb-8 bg-black/40 border border-white/10 text-white/70">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none">
              About
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none">
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-0">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <ManifestoBlock statement={artwork?.description ?? ""} className="mb-24" />
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <TechSpecs metadata={metadata} className="mb-24" />
          </TabsContent>
        </Tabs>
      </div>

      <ArtistReel
        artworks={reelArtworks}
        artistName={artistName || "Artist"}
        className="pb-32"
      />

      <NavigationPill />
    </main>
  );
};

export default Index;
