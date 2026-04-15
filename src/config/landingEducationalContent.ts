/**
 * Single source of truth for homepage educational copy used on the landing page
 * and the About Us → Crestox tab.
 */

export const HERO_TAGLINE =
  'Invest in masterpieces by owning fractional shares. Crestox democratizes fine art collecting through blockchain-powered fractionalization.';

export const HERO_STATS = [
  { value: '\u20B92.5Cr+', label: 'Trading Volume', emphasize: true as const },
  { value: '1,200+', label: 'Collectors', emphasize: false as const },
  { value: '85+', label: 'Artists', emphasize: false as const },
] as const;

export const FRACTAL_SECTION = {
  kicker: 'THE CONCEPT',
  title: 'What are Art Fractals?',
} as const;

export const FRACTAL_FLIP_CARDS = [
  {
    front: {
      icon: 'Palette' as const,
      title: 'Original Artwork',
      description:
        'A physical masterpiece valued at ₹50 lakhs is authenticated and securely stored in a vault.',
    },
    back: {
      title: 'Secure Storage',
      description: 'Vault-grade protection, insured asset, and blockchain verification ensure authenticity.',
    },
  },
  {
    front: {
      icon: 'Sparkles' as const,
      title: 'Fractionalized',
      description: 'The artwork is divided into 5,000 digital "fractals" representing verified ownership.',
    },
    back: {
      title: 'Digital Ownership',
      description: 'Each fractal is recorded transparently and securely on-chain.',
    },
  },
  {
    front: {
      icon: 'TrendingUp' as const,
      title: 'Trade & Profit',
      description: 'Buy fractals starting at ₹1,000 and trade as the artwork appreciates.',
    },
    back: {
      title: 'Marketplace',
      description: 'Seamless trading experience with transparent price discovery.',
    },
  },
] as const;

export const FOR_COLLECTORS = {
  kicker: 'FOR COLLECTORS',
  title: 'Invest in Art Like Never Before',
  lead: 'No longer reserved for the ultra-wealthy. Start your collection with any budget and build a diversified portfolio of blue-chip artworks.',
  items: [
    {
      icon: 'Shield' as const,
      title: 'Verified Authenticity',
      description: 'Every artwork is authenticated and insured before fractionalization.',
    },
    {
      icon: 'BarChart3' as const,
      title: 'Real-time Valuations',
      description: 'Track your portfolio value with live market data and analytics.',
    },
    {
      icon: 'TrendingUp' as const,
      title: 'Secondary Market',
      description: 'Buy and sell fractals instantly on our liquid marketplace.',
    },
  ],
} as const;

export const FOR_ARTISTS = {
  kicker: 'FOR ARTISTS',
  title: 'Fund Your Art, Keep Your Rights',
  lead: 'Get funding for new works without giving up ownership. Earn royalties on every secondary sale, forever.',
  items: [
    {
      icon: 'Users' as const,
      title: 'Access New Collectors',
      description: "Reach thousands of art enthusiasts who couldn't afford full pieces.",
    },
    {
      icon: 'TrendingUp' as const,
      title: '5% Perpetual Royalties',
      description: 'Earn from every trade on the secondary market automatically.',
    },
    {
      icon: 'Shield' as const,
      title: 'Full Creative Control',
      description: 'You decide pricing, edition size, and retain all IP rights.',
    },
  ],
} as const;

export const TRUST_MATRIX_FEATURE_CONTENT = [
  {
    icon: 'compliance' as const,
    title: 'Compliance Shield',
    description: 'SEC-registered securities. Every transaction is fully compliant with federal regulations.',
    stat: '100%',
    statLabel: 'Compliant',
  },
  {
    icon: 'ledger' as const,
    title: 'Transparent Ledger',
    description: 'Blockchain-verified ownership. Every fractal, every transfer, permanently recorded.',
    stat: '2.4M+',
    statLabel: 'Transactions',
  },
  {
    icon: 'vault' as const,
    title: 'Vault Security',
    description: 'Bank-grade encryption. Cold storage for digital assets. Insured custody.',
    stat: '$840M',
    statLabel: 'Assets Secured',
  },
  {
    icon: 'settlement' as const,
    title: 'Instant Settlement',
    description: 'T+0 settlement on all trades. No waiting periods. Immediate liquidity.',
    stat: '<1s',
    statLabel: 'Avg. Settlement',
  },
] as const;

export const TRUST_MATRIX_SECTION = {
  kicker: 'TRUST INFRASTRUCTURE',
  titleLine1: 'Built for',
  titleAccent: ' Security',
  subtitle:
    'Your investments protected by institutional-grade security, regulatory compliance, and transparent blockchain technology.',
} as const;

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover & Authenticate',
    description:
      'Browse curated masterpieces verified through our AI authentication protocol. Each piece undergoes rigorous provenance analysis.',
  },
  {
    number: '02',
    title: 'Acquire Fractions',
    description:
      'Purchase fractional ownership tokens representing real shares of authenticated artworks. Start with as little as 0.1 ETH.',
  },
  {
    number: '03',
    title: 'Trade & Govern',
    description:
      "Trade your fractions on secondary markets or participate in governance decisions about the physical artwork's future.",
  },
  {
    number: '04',
    title: 'Collect Returns',
    description:
      'Earn from appreciation, exhibition royalties, and eventual sale proceeds distributed proportionally to token holders.',
  },
] as const;
