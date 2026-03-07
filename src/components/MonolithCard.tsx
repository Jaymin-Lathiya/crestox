import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Award, Zap, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface MonolithCardProps {
  artistName: string;
  artworkUrl: string;
  totalFractals: number;
  investedAmount: number;
  currentValue: number;
  gainLossPerc: number;
  onSell: () => void;
  onCertificate: () => void;
  artistId: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const MonolithCard: React.FC<MonolithCardProps> = ({
  artistId,
  artistName,
  artworkUrl,
  totalFractals,
  investedAmount,
  currentValue,
  gainLossPerc,
  onSell,
  onCertificate,
}) => {
  const isPositive = gainLossPerc >= 0;
  const router = useRouter();

  return (
    <motion.div
      className="relative max-w-7xl mx-auto px-4 md:px-6 h-auto min-h-[180px] md:h-[180px] overflow-hidden border border-border/50 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.01,
        borderColor: "hsl(var(--primary))",
        boxShadow: "0 0 30px hsl(var(--primary) / 0.1)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Background Artwork */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center grayscale brightness-50 contrast-125 transition-all duration-700"
        style={{ backgroundImage: `url(${artworkUrl})` }}
        whileHover={{ scale: 1.1, filter: "grayscale(0%) brightness(0.6)" }}
        transition={{ duration: 0.8 }}
      />

      {/* Overlay so artist name, Verified Artist, totalFractals, Invested, etc. stay readable */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-background via-background/90 to-transparent"
        aria-hidden
      />

      {/* Content wrapper: flex row on desktop so left + right (buttons) sit side by side and are both visible */}
      <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[180px] w-full">
      {/* Left Section */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-4 md:py-0">
        <div className="space-y-1">
          <h2 className="font-renaissance text-2xl md:text-3xl text-foreground tracking-wide font-bold">
            {artistName}
          </h2>
          <div className="flex flex-wrap items-center gap-2 font-cyber text-xs text-muted-foreground uppercase tracking-widest">
            <span className="bg-secondary px-2 py-0.5 whitespace-nowrap">
              Verified Artist
            </span>{" "}
            {/* 👈 whitespace-nowrap */}
            <span>•</span>
            <span className="whitespace-nowrap">
              {totalFractals} Fractals Owned
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6 md:mt-4">
          {" "}
          {/* 👈 grid instead of flex-wrap */}
          <div className="flex flex-col">
            <span className="font-cyber text-[10px] uppercase text-muted-foreground mb-1">
              Invested
            </span>
            <span className="font-cyber text-sm md:text-lg text-foreground/90">
              {formatCurrency(investedAmount)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-cyber text-[10px] uppercase text-muted-foreground mb-1">
              Current Val
            </span>
            <span className="font-cyber text-sm md:text-lg text-primary text-glow-lime">
              {formatCurrency(currentValue)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-cyber text-[10px] uppercase text-muted-foreground mb-1">
              Return
            </span>
            <div
              className={`flex items-center gap-1 font-cyber text-sm md:text-lg font-bold ${isPositive ? "text-primary" : "text-destructive"}`}
            >
              {isPositive ?
                <ArrowUpRight size={16} />
              : <ArrowDownRight size={16} />}
              <span>{Math.abs(gainLossPerc)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Actions - always visible beside left on desktop, below on mobile */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-center md:justify-center gap-3 shrink-0 w-full md:w-auto py-3 md:py-4 md:pl-6 md:pr-6 border-t md:border-t-0 md:border-l border-border/50 bg-transparent backdrop-blur-sm">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onCertificate();
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          title="Download Authenticity Certificate"
        >
          <Award size={20} strokeWidth={1.5} />
          <span className="font-cyber text-[10px] uppercase md:hidden">
            Certify
          </span>{" "}
          {/* 👈 always show on mobile */}
        </motion.button>

        <motion.button
          whileHover={{
            backgroundColor: "hsl(var(--primary) / 0.2)",
            borderColor: "hsl(var(--primary))",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onSell();
          }}
          className="group/btn relative px-4 py-2.5 border-2 border-primary/80 overflow-hidden transition-all duration-300 whitespace-nowrap bg-background text-primary shadow-sm"
        >
          <div className="absolute inset-0 w-0 bg-primary/10 transition-all duration-250 ease-out group-hover/btn:w-full" />
          <div className="flex items-center gap-2 relative z-10">
            <Zap size={14} className="text-primary" />
            <span className="font-cyber text-xs md:text-sm text-primary tracking-widest font-bold">
              LIQUIDATE
            </span>
          </div>
        </motion.button>

        <button
          className="flex items-center gap-2"
          onClick={() => router.push(`/artist/${artistId}`)}
        >
          <User size={14} className="text-primary" />
          <span className="font-cyber text-xs md:text-sm text-primary tracking-widest font-bold whitespace-nowrap">
            Artist Profile
          </span>
        </button>
      </div>
      </div>
    </motion.div>
  );
};

export default MonolithCard;
