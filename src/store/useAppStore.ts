import { create } from 'zustand';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  totalShards: number;
  availableShards: number;
  pricePerShard: number;
  priceChange24h: number; // percentage
  volume24h: number;
  marketCap: number;
}

export interface Holding {
  artworkId: string;
  artworkTitle: string;
  artist: string;
  imageUrl: string;
  shardsOwned: number;
  shardsAvailable: number; // Shards not listed for sale
  totalShards: number;
  purchasePrice: number; // Total amount spent including fees
  currentValue: number; // Current market value
  pricePerShard: number; // Current price per shard
  priceChange24h: number; // percentage
}

export interface Listing {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artist: string;
  quantity: number;
  listingPrice: number; // Price per fractal
  sellingPeriod: number; // Days
  createdAt: Date;
  expiresAt: Date;
}

export interface WatchlistArtist {
  artist: string;
  artistId: string;
  imageUrl?: string;
}

interface AppState {
  // Navigation
  currentView: 'home' | 'marketplace' | 'detail' | 'vault';
  setCurrentView: (view: 'home' | 'marketplace' | 'detail' | 'vault') => void;
  
  // Selected Artwork
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (artwork: Artwork | null) => void;
  
  // Artworks data
  artworks: Artwork[];
  
  // Collection/Holdings data
  holdings: Holding[];
  setHoldings: (holdings: Holding[]) => void;
  addDummyHoldings: () => void;
  createListing: (artworkId: string, quantity: number, price: number, sellingPeriod: number) => void;
  cancelListing: (listingId: string) => void;
  
  // Listings
  listings: Listing[];
  
  // Watchlist
  watchlist: WatchlistArtist[];
  addToWatchlist: (artist: string, artistId: string, imageUrl?: string) => void;
  removeFromWatchlist: (artistId: string) => void;
  
  // Camera position for 3D scenes
  cameraZ: number;
  setCameraZ: (z: number) => void;
  
  // UI States
  isExploded: boolean;
  setIsExploded: (exploded: boolean) => void;
}

const SAMPLE_ARTWORKS: Artwork[] = [
  {
    id: '#001-ALPHA',
    title: 'The Liquid Abstract',
    artist: 'Elena Vostok',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop',
    totalShards: 3600,
    availableShards: 2412,
    pricePerShard: 2500,
    priceChange24h: 12.5,
    volume24h: 4500000,
    marketCap: 9000000,
  },
  {
    id: '#002-BETA',
    title: 'Midnight Reverie',
    artist: 'Marcus Chen',
    imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=800&auto=format&fit=crop',
    totalShards: 5000,
    availableShards: 3200,
    pricePerShard: 1800,
    priceChange24h: -3.2,
    volume24h: 2100000,
    marketCap: 9000000,
  },
  {
    id: '#003-GAMMA',
    title: 'Digital Renaissance',
    artist: 'Sophia Laurent',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop',
    totalShards: 2500,
    availableShards: 800,
    pricePerShard: 4200,
    priceChange24h: 28.7,
    volume24h: 8900000,
    marketCap: 10500000,
  },
  {
    id: '#004-DELTA',
    title: 'Fractured Light',
    artist: 'Yuki Tanaka',
    imageUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop',
    totalShards: 4000,
    availableShards: 2800,
    pricePerShard: 1500,
    priceChange24h: 5.8,
    volume24h: 1800000,
    marketCap: 6000000,
  },
  {
    id: '#005-EPSILON',
    title: 'Void Symphony',
    artist: 'Andre Dubois',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    totalShards: 3000,
    availableShards: 1500,
    pricePerShard: 3500,
    priceChange24h: -8.4,
    volume24h: 5200000,
    marketCap: 10500000,
  },
  {
    id: '#006-ZETA',
    title: 'Chromatic Pulse',
    artist: 'Ava Sterling',
    imageUrl: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=800&auto=format&fit=crop',
    totalShards: 6000,
    availableShards: 4200,
    pricePerShard: 950,
    priceChange24h: 15.3,
    volume24h: 3400000,
    marketCap: 5700000,
  },
];

const DUMMY_HOLDINGS: Holding[] = [
  {
    artworkId: '#001-ALPHA',
    artworkTitle: 'The Liquid Abstract',
    artist: 'Elena Vostok',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop',
    shardsOwned: 150,
    shardsAvailable: 150,
    totalShards: 3600,
    purchasePrice: 300000, // Includes GST and fees
    currentValue: 375000, // 150 * 2500
    pricePerShard: 2500,
    priceChange24h: 12.5,
  },
];

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),
  
  selectedArtwork: SAMPLE_ARTWORKS[0],
  setSelectedArtwork: (artwork) => set({ selectedArtwork: artwork }),
  
  artworks: SAMPLE_ARTWORKS,
  
  holdings: [],
  setHoldings: (holdings) => set({ holdings }),
  addDummyHoldings: () => set({ holdings: DUMMY_HOLDINGS }),
  
  listings: [],
  
  createListing: (artworkId, quantity, price, sellingPeriod) => {
    set((state) => {
      const holding = state.holdings.find(h => h.artworkId === artworkId);
      if (!holding || holding.shardsAvailable < quantity) {
        return state;
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + sellingPeriod * 24 * 60 * 60 * 1000);
      
      const newListing: Listing = {
        id: `listing-${Date.now()}`,
        artworkId,
        artworkTitle: holding.artworkTitle,
        artist: holding.artist,
        quantity,
        listingPrice: price,
        sellingPeriod,
        createdAt: now,
        expiresAt,
      };

      // Update holding to reduce available shards
      const updatedHoldings = state.holdings.map(h =>
        h.artworkId === artworkId
          ? { ...h, shardsAvailable: h.shardsAvailable - quantity }
          : h
      );

      return {
        ...state,
        holdings: updatedHoldings,
        listings: [...state.listings, newListing],
      };
    });
  },
  
  cancelListing: (listingId) => {
    set((state) => {
      const listing = state.listings.find(l => l.id === listingId);
      if (!listing) return state;

      // Return shards to available
      const updatedHoldings = state.holdings.map(h =>
        h.artworkId === listing.artworkId
          ? { ...h, shardsAvailable: h.shardsAvailable + listing.quantity }
          : h
      );

      return {
        ...state,
        holdings: updatedHoldings,
        listings: state.listings.filter(l => l.id !== listingId),
      };
    });
  },
  
  watchlist: [],
  addToWatchlist: (artist, artistId, imageUrl) => {
    set((state) => {
      if (state.watchlist.some(w => w.artistId === artistId)) {
        return state;
      }
      return {
        ...state,
        watchlist: [...state.watchlist, { artist, artistId, imageUrl }],
      };
    });
  },
  removeFromWatchlist: (artistId) => {
    set((state) => ({
      ...state,
      watchlist: state.watchlist.filter(w => w.artistId !== artistId),
    }));
  },
  
  cameraZ: 0,
  setCameraZ: (z) => set({ cameraZ: z }),
  
  isExploded: false,
  setIsExploded: (exploded) => set({ isExploded: exploded }),
}));
