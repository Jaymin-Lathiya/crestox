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
