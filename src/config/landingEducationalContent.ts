/**
 * Single source of truth for homepage educational copy used on the landing page
 * and the About Us → Crestox tab.
 */

export const HERO_TAGLINE =
  'Own verified shares of curated artworks, starting from a lower entry point.';

export const HERO_STATS = [
  { value: '\u20B92.5Cr+', label: 'Trading Volume', emphasize: true as const },
  { value: '1,200+', label: 'Collectors', emphasize: false as const },
  { value: '85+', label: 'Artists', emphasize: false as const },
] as const;

export const FRACTAL_SECTION = {
  kicker: 'THE CONCEPT',
  title: 'How Fractional Ownership Works',
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
      title: 'Curated Artwork',
      description: 'Each piece is selected, verified, and prepared for fractional ownership.',
    },
  },
  {
    front: {
      icon: 'Sparkles' as const,
      title: 'Fractionalized',
      description: 'The artwork is divided into 5,000 digital "fractals" representing verified ownership.',
    },
    back: {
      title: 'Own a Share',
      description: 'Buy a fraction of the artwork through secure digital ownership units.',
    },
  },
  {
    front: {
      icon: 'TrendingUp' as const,
      title: 'Trade & Profit',
      description: 'Buy fractals starting at ₹1,000 and trade as the artwork appreciates.',
    },
    back: {
      title: 'Trade or Exit',
      description: 'Track value over time and sell your share when the market allows.',
    },
  },
] as const;

export const FOR_COLLECTORS = {
  kicker: 'FOR COLLECTORS',
  title: 'Own, Track, and Trade Artwork Shares',
  lead: 'Collect exceptional art with lower entry points, clear provenance, and market-linked visibility.',
  items: [
    {
      icon: 'Shield' as const,
      title: 'Verified Provenance',
      description: 'Every artwork is authenticated and insured before fractionalization.',
    },
    {
      icon: 'BarChart3' as const,
      title: 'Live Market Insights',
      description: 'Track your portfolio value with live market data and analytics.',
    },
    {
      icon: 'TrendingUp' as const,
      title: 'Secondary Sale Access',
      description: 'Buy and sell fractals instantly on our liquid marketplace.',
    },
  ],
} as const;

export const FOR_ARTISTS = {
  kicker: 'FOR ARTISTS',
  title: 'Raise Funding Without Giving Up Ownership',
  lead: 'Retain control of your work while earning royalties from eligible secondary sales.',
  items: [
    {
      icon: 'Users' as const,
      title: 'Reach New Collectors',
      description: "Reach thousands of art enthusiasts who couldn't afford full pieces.",
    },
    {
      icon: 'TrendingUp' as const,
      title: 'Earn Secondary Sale Royalties',
      description: 'Earn from every trade on the secondary market automatically.',
    },
    {
      icon: 'Shield' as const,
      title: 'Set Your Terms',
      description: 'You decide pricing, edition size, and retain all IP rights.',
    },
  ],
} as const;

export const TRUST_MATRIX_FEATURE_CONTENT = [
  {
    icon: 'compliance' as const,
    title: 'Encrypted Custody',
    description: 'All assets are held in encrypted, secure custody with institutional-grade protection.',
    stat: 'Encrypted',
    statLabel: 'Custody',
  },
  {
    icon: 'ledger' as const,
    title: 'Audit-Ready Records',
    description: 'Every ownership transfer and transaction is recorded and available for audit.',
    stat: 'Audit-Ready',
    statLabel: 'Records',
  },
  {
    icon: 'vault' as const,
    title: 'Transparent History',
    description: 'Full transaction history available for every asset, ensuring complete transparency.',
    stat: 'Transparent',
    statLabel: 'Transaction History',
  },
  {
    icon: 'settlement' as const,
    title: 'Compliance-First',
    description: 'Operations designed with regulatory compliance as a foundational priority.',
    stat: 'Compliant',
    statLabel: 'Operations',
  },
] as const;

export const TRUST_MATRIX_SECTION = {
  kicker: 'TRUST INFRASTRUCTURE',
  titleLine1: 'Security, Custody,',
  titleAccent: ' and Compliance',
  subtitle:
    'Built with verified ownership records, secure custody, and compliance-first operations.',
} as const;

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover & Verify',
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
    title: 'Trade Anytime',
    description:
      "Trade your fractions on secondary markets or participate in governance decisions about the physical artwork's future.",
  },
  {
    number: '04',
    title: 'Track Performance',
    description:
      'Earn from appreciation, exhibition royalties, and eventual sale proceeds distributed proportionally to token holders.',
  },
] as const;
