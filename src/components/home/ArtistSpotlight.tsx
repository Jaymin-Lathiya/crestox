import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import GradientButton from '../ui/gradiant-button';

interface FeaturedArtist {
  id: string;
  name: string;
  title: string;
  image: string;
  artworks: string[];
  fundingProgress: number;
  fundingGoal: string;
  raised: string;
  description: string;
  style: string;
}

const featuredArtists: FeaturedArtist[] = [
  {
    id: '1',
    name: 'Amara Okafor',
    title: 'The Ancestors Speak',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=800&fit=crop',
    artworks: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544967082-aa16c2c4b54d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&h=800&fit=crop'
    ],
    fundingProgress: 73,
    fundingGoal: '$500,000',
    raised: '$365,000',
    description: 'A monumental bronze installation exploring the continuity of African spiritual traditions in the diaspora.',
    style: 'Contemporary Sculpture'
  },
  {
    id: '2',
    name: 'Viktor Sorokin',
    title: 'Digital Ruins',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop',
    artworks: [
      'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515405295579-ba7b45490615?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=800&fit=crop'
    ],
    fundingProgress: 45,
    fundingGoal: '$250,000',
    raised: '$112,500',
    description: 'An immersive AR experience mapping the decay of Soviet-era monuments onto contemporary urban landscapes.',
    style: 'New Media Art'
  },
  {
    id: '3',
    name: 'Isabella Reyes',
    title: 'Chromatic Prayers',
    image: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=600&h=800&fit=crop',
    artworks: [
      'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1520699918507-6c3c3e2e21b2?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584143990664-9f79b6d8a2c2?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596707165076-239618e47526?w=600&h=800&fit=crop'
    ],
    fundingProgress: 89,
    fundingGoal: '$180,000',
    raised: '$160,200',
    description: 'Large-scale textile works incorporating traditional Oaxacan weaving with fluorescent industrial fibers.',
    style: 'Textile Art'
  },
];

const ArtistCard = ({ artist, index }: { artist: FeaturedArtist; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % artist.artworks.length);
      }, 1500); // Change image every 1.5 seconds
    } else {
      setCurrentImageIndex(0); // Reset to main image when not hovered
    }
    return () => clearInterval(interval);
  }, [isHovered, artist.artworks.length]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale }}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
    >
      {/* Image */}
      <motion.div
        className="relative w-full md:w-1/2 aspect-[3/4] max-w-md"
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 rounded-lg overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={artist.artworks[currentImageIndex]}
              alt={artist.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
        </div>

        {/* Floating funding badge */}
        <motion.div
          className="absolute -bottom-4 -right-4 md:right-auto md:-left-4 glass-card rounded-lg p-4 z-10"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="terminal-text text-muted-foreground text-[10px] mb-1">FUNDING PROGRESS</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="font-display text-2xl italic text-gradient-gold">{artist.fundingProgress}%</span>
            <span className="font-mono text-xs text-muted-foreground">of {artist.fundingGoal}</span>
          </div>
          <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-gold rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${artist.fundingProgress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Golden frame accent */}
        <div className="absolute inset-0 rounded-lg border border-primary/20 pointer-events-none z-20" />
        <div className="absolute -inset-1 rounded-lg border border-primary/10 pointer-events-none z-20" />

        {/* Slider Indicator Dots (Optional, but nice for UX) */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
          >
            {artist.artworks.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${idx === currentImageIndex ? 'bg-primary' : 'bg-primary/20'}`}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <div className="w-full md:w-1/2 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="terminal-text text-primary text-xs tracking-[0.3em] mb-2">{artist.style}</p>
          <h3 className="font-display text-3xl md:text-4xl italic text-foreground mb-2">{artist.title}</h3>
          <p className="font-mono text-muted-foreground mb-4">by {artist.name}</p>

          <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
            {artist.description}
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-6">
            <div>
              <p className="terminal-text text-muted-foreground text-[10px] mb-1">RAISED</p>
              <p className="font-mono text-lg text-primary">{artist.raised}</p>
            </div>
            <div>
              <p className="terminal-text text-muted-foreground text-[10px] mb-1">GOAL</p>
              <p className="font-mono text-lg text-foreground">{artist.fundingGoal}</p>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            className=" text-primary font-mono text-sm tracking-wider uppercase rounded transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GradientButton variant="primary" label='Back This Artist'>

            </GradientButton>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ArtistSpotlight = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="artists"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-muted noise"
    >
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="terminal-text text-primary text-xs tracking-[0.4em] mb-4">EMERGING ARTISTS</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl italic text-foreground mb-6">
            Fund the
            <span className="text-gradient-gold"> Future of Art</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-xl mx-auto">
            Your investment directly supports creators bringing bold visions to life.
            Watch your fractals appreciate as their careers ascend.
          </p>
        </motion.div>

        {/* Artist cards */}
        <div className="space-y-32">
          {featuredArtists.map((artist, index) => (
            <ArtistCard key={artist.id} artist={artist} index={index} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-20"
        >
          <motion.button
            className="group inline-flex items-center gap-3  font-mono text-sm tracking-wider uppercase rounded hover:border-primary hover:text-primary transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GradientButton variant="primary" label='Explore All Artists'>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </GradientButton>

          </motion.button>
        </motion.div>


      </div>
    </section>
  );
};

export default ArtistSpotlight;
