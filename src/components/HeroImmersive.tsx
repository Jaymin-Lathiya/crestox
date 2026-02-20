import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface HeroProps {
  artworkUrl: any;
  title: string;
  artistName: string;
  className?: string;
}

const HeroImmersive: React.FC<HeroProps> = ({
  artworkUrl,
  title,
  artistName,
  className = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    setMousePosition({ x, y });
  };

  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    springX.set(mousePosition.x);
    springY.set(mousePosition.y);
  }, [mousePosition, springX, springY]);

  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  const yImage = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div
      className={`relative w-full h-[90vh] bg-void overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* The Artwork Layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          y: yImage,
          x: useTransform(springX, (val) => val * -15),
          scale: 1.05
        }}
      >
        <div className="relative w-[90%] h-[85%] overflow-hidden">
          <motion.img
            src={artworkUrl}
            alt={title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
            onLoad={() => setIsLoaded(true)}
          />

          {/* Slit Scan Curtain Effect */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-void z-20" />
          )}
          <motion.div
            className="absolute inset-0 bg-void z-10"
            initial={{ scaleY: 1 }}
            animate={isLoaded ? { scaleY: 0 } : { scaleY: 1 }}
            style={{ transformOrigin: 'bottom' }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
          />
        </div>
      </motion.div>

      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-vignette opacity-80" />

      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* Typography Layer */}
      <motion.div
        className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-30"
        style={{
          y: yText,
          x: useTransform(springX, (val) => val * 10)
        }}
      >
        <div className="flex flex-col items-start gap-2 max-w-4xl">
          {/* Artist Name */}
          <motion.span
            className="font-mono text-acid text-xs md:text-sm tracking-[0.2em] uppercase mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {artistName} /// Creator
          </motion.span>

          {/* Title - Massive Serif with Blend Mode */}
          <motion.h1
            className="font-serif text-marble text-5xl md:text-[8rem] leading-[0.85] tracking-tighter blend-difference italic"
            initial={{ opacity: 0, y: 50 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          >
            {title}
          </motion.h1>

          {/* Decorative Line */}
          <motion.div
            className="h-[1px] bg-acid mt-8"
            initial={{ width: 0 }}
            animate={isLoaded ? { width: 96 } : {}}
            transition={{ delay: 1.0, duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Lightbox Trigger */}
      <motion.button
        className="absolute top-8 right-8 z-40 border border-border p-4 rounded-full hover:bg-acid hover:border-acid transition-colors duration-300 group"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        aria-label="Expand Artwork"
      >
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-marble group-hover:text-void transition-colors"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </motion.button>
    </div>
  );
};

export default HeroImmersive;
