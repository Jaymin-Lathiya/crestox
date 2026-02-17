import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ArtworkStatus = "live" | "pending" | "draft";

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  status: ArtworkStatus;
  grade: string;
  fractalsTotal: number;
  fractalsSold: number;
  price: number;
}

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
}

export const ArtworkCard = ({ artwork, index }: ArtworkCardProps) => {
  return (
    <motion.div
      className="artwork-card break-inside-avoid mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover"
        />
        
        {/* Status Beacon */}
        <div className="absolute top-4 right-4">
          <div 
            className={cn(
              "status-beacon",
              artwork.status
            )}
          />
        </div>

        {/* Hover Overlay */}
        <div className="artwork-overlay">
          <h3 className="text-editorial mb-2">{artwork.title}</h3>
          <div className="flex items-center justify-between">
            <span className="grade-badge">{artwork.grade}</span>
            <span className="text-xs font-mono text-muted-foreground">
              {artwork.fractalsSold}/{artwork.fractalsTotal} sold
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fractal Price</span>
            <span className="text-sm font-mono text-foreground">
              ${(artwork.price / artwork.fractalsTotal).toFixed(2)}
            </span>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 text-xs uppercase tracking-wider border border-border text-foreground hover:bg-zinc-900 transition-colors">
              Edit
            </button>
            <button className="flex-1 py-2 text-xs uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:bg-zinc-900 transition-colors">
              View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
