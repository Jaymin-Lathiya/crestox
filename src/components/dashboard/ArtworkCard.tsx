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
      <div className="relative overflow-hidden">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-auto"
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
      </div>
    </motion.div>
  );
};
