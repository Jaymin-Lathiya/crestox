import instance from "@/utils/apiCalls";
import { myPortfolioURLS } from "./myPortfolioUrls";

export type PortfolioArtworkStatus = "APPROVED" | "PENDING";

export interface MyPortfolioArtworkItem {
  artwork_id: number;
  status: PortfolioArtworkStatus;
  primary_image_url: string | null;
}

export const getMyPortfolioArtworks =
  (artistProfileId: number) => async () => {
    const response = await instance.get(myPortfolioURLS.MY_PORTFOLIO(artistProfileId));
    return response;
  };

export interface PortfolioDashboardRecentTransaction {
  transaction_id: number;
  created_at: string;
  share_quantity: number;
  trade_value: number;
  artist_net_after_platform_fee: number;
  artwork: { artwork_id: number; name: string } | null;
}

export interface PortfolioDashboard {
  artist_profile_id: number;
  portfolio_valuation: number;
  fractal_price: number;
  fractals_sold: number;
  total_fractals: number;
  available_fractals: number;
  earnings_from_trades: number;
  earnings_from_royalties: number;
  total_earnings: number;
  recent_transactions: PortfolioDashboardRecentTransaction[];
  live_artwork_count: number;
  pending_approval_artwork_count: number;
  total_collectors: number;
}

export const getPortfolioDashboard = () => async () => {
  const response = await instance.get(myPortfolioURLS.PORTFOLIO_DASHBOARD);
  return response;
};

// --- Authenticated artist profile (settings tab) ---

export interface MyArtistProfileAchievement {
  id: number;
  title: string;
  description: string | null;
  media: {
    media_id: number;
    file_path: string;
    original_file_name: string;
  } | null;
  display_order: number;
  created_at: string;
}

export interface MyArtistProfile {
  artist_profile_id: number;
  artist_name: string;
  artist_bio: string | null;
  collector_message: string | null;
  avatar_url: string | null;
  avatar_media_id: number | null;
  email: string;
  phone_number: string | null;
  location: string | null;
  university: string | null;
  website: string | null;
  instagram: string | null;
  social_media_links: { platform: string; url: string }[];
  achievements: MyArtistProfileAchievement[];
  is_approved: boolean;
}

export interface UpdateMyArtistProfilePayload {
  artist_name?: string;
  artist_bio?: string;
  collector_message?: string;
  location?: string;
  university?: string;
  website_portfolio_link?: string;
  avatar_media_id?: number | null;
  email?: string;
  phone_number?: string;
  social_links?: { platform: string; url: string }[];
}

export const getMyArtistProfile = () => async () => {
  const response = await instance.get(myPortfolioURLS.MY_ARTIST_PROFILE);
  return response;
};

export const updateMyArtistProfile =
  (payload: UpdateMyArtistProfilePayload) => async () => {
    const response = await instance.patch(
      myPortfolioURLS.MY_ARTIST_PROFILE,
      payload
    );
    return response;
  };

export interface AddAchievementPayload {
  title: string;
  description?: string;
  media_id?: number;
}

export const addMyAchievement =
  (payload: AddAchievementPayload) => async () => {
    const response = await instance.post(
      myPortfolioURLS.MY_ARTIST_ACHIEVEMENTS,
      payload
    );
    return response;
  };

export const deleteMyAchievement =
  (achievementId: number) => async () => {
    const response = await instance.delete(
      myPortfolioURLS.MY_ARTIST_ACHIEVEMENT(achievementId)
    );
    return response;
  };
