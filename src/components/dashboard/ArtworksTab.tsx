import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ArtworkCard } from "./ArtworkCard";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "live" | "pending" | "draft";

// Mock artwork data
const mockArtworks = [
  {
    id: "1",
    title: "Ethereal Dawn",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop",
    status: "live" as const,
    grade: "A+",
    fractalsTotal: 100,
    fractalsSold: 67,
    price: 4250,
  },
  {
    id: "2",
    title: "Midnight Bloom",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop",
    status: "live" as const,
    grade: "A",
    fractalsTotal: 100,
    fractalsSold: 42,
    price: 3800,
  },
  {
    id: "3",
    title: "Urban Decay III",
    imageUrl: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600&h=800&fit=crop",
    status: "pending" as const,
    grade: "B+",
    fractalsTotal: 100,
    fractalsSold: 0,
    price: 2500,
  },
  {
    id: "4",
    title: "Solitude",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop",
    status: "live" as const,
    grade: "A",
    fractalsTotal: 100,
    fractalsSold: 89,
    price: 5200,
  },
  {
    id: "5",
    title: "Chromatic Fusion",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=800&fit=crop",
    status: "draft" as const,
    grade: "-",
    fractalsTotal: 100,
    fractalsSold: 0,
    price: 0,
  },
  {
    id: "6",
    title: "The Observer",
    imageUrl: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&h=800&fit=crop",
    status: "live" as const,
    grade: "A+",
    fractalsTotal: 100,
    fractalsSold: 100,
    price: 8500,
  },
  {
    id: "7",
    title: "Fragments of Time",
    imageUrl: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600&h=800&fit=crop",
    status: "pending" as const,
    grade: "A",
    fractalsTotal: 100,
    fractalsSold: 0,
    price: 4800,
  },
  {
    id: "8",
    title: "Abstract Motion",
    imageUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=800&fit=crop",
    status: "draft" as const,
    grade: "-",
    fractalsTotal: 100,
    fractalsSold: 0,
    price: 0,
  },
];

export const ArtworksTab = () => {
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filteredArtworks = filter === "all" 
    ? mockArtworks 
    : mockArtworks.filter(a => a.status === filter);

  const filterButtons: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "live", label: "Live" },
    { value: "pending", label: "Pending" },
    { value: "draft", label: "Draft" },
  ];

  return (
    <div className="space-y-8 px-20">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
            My Artworks
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your portfolio and track fractal sales
          </p>
        </div>

        {/* Add New Button */}
        <motion.button
          className="btn-liquid-metal flex items-center gap-2 px-6 py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
                ? "bg-zinc-800 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {btn.label}
          </button>
        ))}
      </motion.div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {filteredArtworks.map((artwork, index) => (
          <ArtworkCard 
            key={artwork.id} 
            artwork={artwork} 
            index={index}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredArtworks.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border border-border rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No artworks found</p>
        </motion.div>
      )}
    </div>
  );
};
