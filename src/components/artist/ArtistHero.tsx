import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Heart, MapPin, BadgeCheck } from 'lucide-react';
import SocialButton from '../ui/social-button';

interface ArtistData {
  name: string;
  bio: string;
  location: string;
  profileImage: string;
  isVerified: boolean;
  rank?: string;
  isWishlisted?: boolean;
}

interface ArtistHeroProps {
  artist: ArtistData;
}

const ArtistHero: React.FC<ArtistHeroProps> = ({ artist }) => {
  const {
    name,
    bio,
    location,
    profileImage,
    isVerified,
    rank = "Top 1% Global",
  } = artist;

  return (
    <div className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-end justify-center pb-12 md:pb-24 overflow-hidden bg-void noise-overlay">

      {/* Ambient Background - The Void with Aurora */}
      <div className="absolute inset-0 z-0">
        {/* Primary Aurora */}
        <div className="aurora top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20" />
        {/* Secondary Aurora */}
        <div
          className="aurora top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-900/10"
          style={{ animationDelay: '-10s' }}
        />
        {/* Ambient Light from Top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-end">

        {/* Left Column: The "Manifesto" (Text) */}
        <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col space-y-8">

          {/* Metadata Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-wrap items-center gap-3 md:gap-6 text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase"
          >
            <span className="flex items-center space-x-2">
              <MapPin size={12} />
              <span>{location}</span>
            </span>
            <span className="hidden md:block w-px h-3 bg-border" />
            <span className="text-primary">{rank}</span>
          </motion.div>

          {/* Artist Name - Massive Display Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground leading-[0.9] -ml-1"
          >
            {name}
            {isVerified && (
              <BadgeCheck className="inline-block ml-3 text-accent w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 align-top" />
            )}
          </motion.h1>

          {/* Bio - Rational Typography */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-mono text-muted-foreground text-sm leading-relaxed max-w-lg border-l border-border pl-6"
          >
            {bio}
          </motion.p>

          {/* Action Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap items-center gap-3 md:gap-4 pt-4"
          >
            <ActionButton icon={Heart} label="Watchlist" />
            <ActionButton icon={Share2} label="Share" />
            <SocialButton />
          </motion.div>
        </div>

        {/* Right Column: The "Image" (Visual) */}
        <div className="lg:col-span-5 order-1 lg:order-2 relative h-[400px] sm:h-[500px] lg:h-[650px]">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0 group"
          >
            {/* Image Container with Fade Mask */}
            <div className="relative w-full h-full overflow-hidden rounded-sm mask-fade-bottom">
              <img
                src={profileImage}
                alt={name}
                className="w-full h-full object-cover transition-all duration-700 ease-out grayscale-[30%] group-hover:grayscale-0 scale-100 group-hover:scale-105"
              />
              {/* Lens Effect Overlay on Hover */}
              <div className="absolute inset-0 bg-void/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Floating Glass Status Tag */}
            <div className="absolute bottom-8 right-4 lg:right-8 glass px-4 py-2 rounded-full flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-mono text-xs text-foreground">Live Auction</span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

// Atomic Action Button Component
interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label }) => (
  <button className="group flex items-center space-x-2 md:space-x-3 px-4 md:px-5 py-2.5 md:py-3 border border-border rounded-full hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
    <Icon size={14} className="md:w-4 md:h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
    <span className="font-mono text-xs text-foreground uppercase tracking-wide group-hover:text-primary transition-colors duration-300">
      {label}
    </span>
  </button>
);

export default ArtistHero;
