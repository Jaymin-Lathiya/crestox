"use client";

import ExplodedCanvas from "@/components/canvas/ExplodedCanvas";
import { useCallback, useEffect, useRef, useState } from "react";
import CollectModule from "@/components/artist/CollectModule";
import AnalyticsTab from "@/components/artist/AnalyticsTab";
import ManifestoBlock from "@/components/ManifestoBlock";
import TechSpecs from "@/components/TechSpecs";
import ArtistReel from "@/components/ArtistReel";
import NavigationPill from "@/components/NavigationPill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getArtworkById,
  getArtworksByArtist,
  getArtworkAnalytics,
  type ArtworkAnalyticsPayload,
} from "@/apis/artwork/artworkActions";
import { useParams, useRouter } from "next/navigation";
import { ImageOrientation } from "@/components/ScrollImagesReveal";

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

function mapArtworkToReelItem(a: ArtworkListItem): { id: string; title: string; imageUrl: string; price: number, primary_image_orientation: ImageOrientation } {
  const filePath = a.artwork_media?.[0]?.media?.file_path ?? "";
  const price = parseFloat(a.valuation ?? a.starting_price ?? "0") || 0;
  return {
    id: String(a.id),
    title: a.name,
    imageUrl: filePath,
    price,
    primary_image_orientation: a.artwork_media[0].media.orientation as ImageOrientation
  };
}

const Index = () => {
  const [exploded, setExploded] = useState(false);
  const [artwork, setArtwork] = useState<ArtworkDetail | null>(null);
  const [artworkByArtist, setArtworkByArtist] = useState<ArtworkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<ArtworkAnalyticsPayload | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const interactionRef = useRef<HTMLDivElement>(null);
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number, y: number } | null>(null);

  const toggleExplode = () => setExploded(!exploded);

  const handlePointerDown = (e: React.PointerEvent) => {
    setMouseDownPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!mouseDownPos) return;
    const dist = Math.sqrt(
      Math.pow(e.clientX - mouseDownPos.x, 2) +
      Math.pow(e.clientY - mouseDownPos.y, 2)
    );
    // If not exploded, do nothing on the background plane. The canvas image mesh handles its own clicks.
    // If exploded, a quick global click un-explodes it.
    if (dist < 5 && exploded) {
      toggleExplode();
    }
    setMouseDownPos(null);
  };

  const handleCollect = async () => {
    const artistId = artwork?.artist_profile_id ?? artwork?.artist_profile?.id;
    if (artistId != null) {
      router.push(`/artist/${artistId}`);
    }
  };

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

  const fetchAnalytics = useCallback(async () => {
    if (!id || typeof id !== "string") return;
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const res = await getArtworkAnalytics(id)();
      if (res?.status === 200 && res?.data?.data) {
        setAnalytics(res.data.data as ArtworkAnalyticsPayload);
      } else {
        setAnalyticsError("Could not load analytics.");
        setAnalytics(null);
      }
    } catch {
      setAnalyticsError("Could not load analytics.");
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArtworkById();
    fetchAnalytics();
  }, [fetchArtworkById, fetchAnalytics]);

  const artworkImageUrl = artwork?.artwork_media?.[0]?.media?.file_path ?? "";
  const metadata = buildDetailsMetadata(artwork);
  const reelArtworks = artworkByArtist.map(mapArtworkToReelItem).filter((a) => a.imageUrl);
  const artistName = artwork?.artist_profile?.artist_name ?? "";
  const pricePerFractal = artwork?.shares?.[0]?.current_price
    ? parseFloat(artwork.shares[0].current_price)
    : parseFloat(artwork?.starting_price ?? "0");
  const totalFractals = artwork?.number_of_shares ?? 0;
  const soldCount = artwork?.shares?.length ?? 0;
  const availableFractals = Math.max(0, totalFractals - soldCount);
  const totalValuation = artwork?.valuation ? parseFloat(artwork.valuation) : 0;

  if (loading) {
    return (
      <>
        <ArtDetailSkeleton />
        <NavigationPill />
      </>
    );
  }

  console.log({ exploded });


  return (
    <main className="bg-void min-h-screen relative">
      <div className="noise-overlay" />

      {/* Hero Section with 3D Canvas */}
      <div className="w-full h-[90vh] relative z-20">
        <ExplodedCanvas
          exploded={exploded}
          onToggle={toggleExplode}
          eventSource={interactionRef}
          artworkUrl={artwork.artwork_media[0].media.file_path}
          artworkName={artwork.name}
          orientation={ImageOrientation.LANDSCAPE}
        />
        <div
          ref={interactionRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className={`absolute top-0 left-0 w-full z-20 pointer-events-auto cursor-pointer ${exploded ? "h-[60vh]" : "h-[90vh]"} `}
        />
      </div>

      {artwork ? (
        <CollectModule
          layout="floating"
          pricePerFractal={pricePerFractal}
          totalSupply={totalFractals}
          available={availableFractals}
          available_fractals={availableFractals}
          total_fractals={totalFractals}
          firstArtworkId={artwork.id}
          isAtwork
          collectContextLabel={artistName || artwork.artist_profile?.artist_name || "Artist"}
          onCollectSuccess={fetchArtworkById}
        />
      ) : null}

      {/* Content Section */}
      <div className="relative z-10 px-8 md:px-16 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20">
        <div className="space-y-12">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-12 bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="about" className="data-[state=active]:bg-white/10 font-mono text-[10px] tracking-widest uppercase">
                About
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white/10 font-mono text-[10px] tracking-widest uppercase">
                Technical
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 font-mono text-[10px] tracking-widest uppercase">
                Market
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <ManifestoBlock statement={artwork.description} />
            </TabsContent>

            <TabsContent value="details" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <TechSpecs metadata={metadata} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <AnalyticsTab
                loading={analyticsLoading}
                error={analyticsError}
                analytics={analytics}
              />
            </TabsContent>
          </Tabs>


        </div>
      </div>
      <ArtistReel
        artworks={reelArtworks}
        artistName={artistName || "Artist"}
        className="pb-32"
      />
    </main>
  );
}

export default Index;
