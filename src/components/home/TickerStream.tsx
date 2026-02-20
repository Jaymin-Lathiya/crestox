import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientButton from '../ui/gradiant-button';

interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  fractalPrice: number;
  change24h: number;
  totalValue: string;
  fractalsRemaining: number;
  bio: string;
}

const artPieces: ArtPiece[] = [
  {
    id: '1',
    title: 'Ethereal Dawn',
    artist: 'Marina Volkov',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
    fractalPrice: 24.50,
    change24h: 12.4,
    totalValue: '$245,000',
    fractalsRemaining: 420,
    bio: 'Russian-born abstract expressionist known for her luminous color fields and meditative compositions.'
  },
  {
    id: '2',
    title: 'Urban Decay #7',
    artist: 'Marcus Chen',
    thumbnail: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=200&h=200&fit=crop',
    fractalPrice: 18.75,
    change24h: -3.2,
    totalValue: '$187,500',
    fractalsRemaining: 156,
    bio: 'Hong Kong street artist exploring themes of urban transformation and cultural identity.'
  },
  {
    id: '3',
    title: 'Quantum Garden',
    artist: 'Sophie Laurent',
    thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&h=200&fit=crop',
    fractalPrice: 156.00,
    change24h: 8.7,
    totalValue: '$1,560,000',
    fractalsRemaining: 89,
    bio: 'French digital artist pioneering the intersection of generative algorithms and classical aesthetics.'
  },
  {
    id: '4',
    title: 'Silent Witness',
    artist: 'Kwame Asante',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop',
    fractalPrice: 42.30,
    change24h: 5.1,
    totalValue: '$423,000',
    fractalsRemaining: 312,
    bio: 'Ghanaian sculptor and painter whose work confronts colonial histories and celebrates African futurism.'
  },
  {
    id: '5',
    title: 'Neon Requiem',
    artist: 'Yuki Tanaka',
    thumbnail: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=200&h=200&fit=crop',
    fractalPrice: 67.80,
    change24h: -1.4,
    totalValue: '$678,000',
    fractalsRemaining: 567,
    bio: 'Tokyo-based new media artist blending traditional ukiyo-e techniques with cyberpunk aesthetics.'
  },
  {
    id: '6',
    title: 'Fragments of Memory',
    artist: 'Elena Rossi',
    thumbnail: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=200&h=200&fit=crop',
    fractalPrice: 89.25,
    change24h: 15.3,
    totalValue: '$892,500',
    fractalsRemaining: 234,
    bio: 'Italian mixed-media artist known for her haunting explorations of nostalgia and collective memory.'
  },
];

const TickerItem = ({ piece, onHover }: { piece: ArtPiece; onHover: (piece: ArtPiece | null) => void }) => {
  const isPositive = piece.change24h >= 0;

  return (
    <motion.div
      className="flex items-center gap-4 px-6 py-3 cursor-pointer group"
      onMouseEnter={() => onHover(piece)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.02 }}
    >
      {/* Thumbnail */}
      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
        <img
          src={piece.thumbnail}
          alt={piece.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <span className="font-display text-sm text-foreground truncate">{piece.title}</span>
        <span className="terminal-text text-muted-foreground text-[10px]">{piece.artist}</span>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end ml-4">
        <span className="font-mono text-sm text-foreground">${piece.fractalPrice.toFixed(2)}</span>
        <span className={`font-mono text-xs ${isPositive ? 'text-terminal' : 'text-signal'}`}>
          {isPositive ? '+' : ''}{piece.change24h.toFixed(1)}%
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-8 bg-border ml-4" />
    </motion.div>
  );
};

const HolographicCard = ({ piece }: { piece: ArtPiece }) => {
  const isPositive = piece.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 glass-card rounded-lg p-6 holographic z-50"
    >
      {/* Image */}
      <div className="relative w-full h-40 rounded overflow-hidden mb-4">
        <img
          src={piece.thumbnail}
          alt={piece.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Scarcity badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-destructive/90 rounded">
          <span className="font-mono text-xs text-foreground">
            Only {piece.fractalsRemaining} left
          </span>
        </div>
      </div>

      {/* Title & Artist */}
      <h3 className="font-display text-xl italic text-foreground mb-1">{piece.title}</h3>
      <p className="terminal-text text-primary mb-3">{piece.artist}</p>

      {/* Bio */}
      <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-4">
        {piece.bio}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-secondary/50 rounded">
        <div className="text-center">
          <p className="terminal-text text-muted-foreground text-[10px] mb-1">FLOOR</p>
          <p className="font-mono text-sm text-foreground">${piece.fractalPrice}</p>
        </div>
        <div className="text-center">
          <p className="terminal-text text-muted-foreground text-[10px] mb-1">24H</p>
          <p className={`font-mono text-sm ${isPositive ? 'text-terminal' : 'text-signal'}`}>
            {isPositive ? '+' : ''}{piece.change24h}%
          </p>
        </div>
        <div className="text-center">
          <p className="terminal-text text-muted-foreground text-[10px] mb-1">VALUE</p>
          <p className="font-mono text-sm text-foreground">{piece.totalValue}</p>
        </div>
      </div>

      {/* Action */}
      <GradientButton label='View Fractals' className="w-full mt-2">
      </GradientButton>
    </motion.div>
  );
};

const TickerStream = () => {
  const [hoveredPiece, setHoveredPiece] = useState<ArtPiece | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless loop
  const duplicatedPieces = [...artPieces, ...artPieces];

  return (
    <section id="market" className="relative py-12 bg-background border-y border-border overflow-hidden">
      {/* Label */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <span className="terminal-text text-primary text-xs tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">
          LIVE MARKET
        </span>
      </div>

      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Ticker */}
      <div
        ref={tickerRef}
        className="relative flex animate-ticker hover:pause-animation ml-16"
        style={{ width: 'max-content' }}
      >
        {duplicatedPieces.map((piece, index) => (
          <TickerItem
            key={`${piece.id}-${index}`}
            piece={piece}
            onHover={setHoveredPiece}
          />
        ))}
      </div>

      {/* Holographic card on hover */}
      <AnimatePresence>
        {hoveredPiece && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
            <HolographicCard piece={hoveredPiece} />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TickerStream;
