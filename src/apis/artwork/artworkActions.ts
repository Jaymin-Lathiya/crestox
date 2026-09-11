import instance from "@/utils/apiCalls";
import { ARTWORK_URLS } from "./artworkUrls";

export type PriceApprovalStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED"
    | "SUPERSEDED";

export interface PriceApprovalDetails {
    status: PriceApprovalStatus;
    artwork_id: number;
    artwork_name: string | null;
    artist_name: string | null;
    price_before: number;
    price_after: number;
    notes: string | null;
    expires_at: string;
    responded_at: string | null;
}

export interface PriceApprovalResponseResult {
    status: "APPROVED" | "REJECTED";
    artwork_id: number;
    message: string;
}

export const getPriceApproval =
    (token: string) => async (): Promise<PriceApprovalDetails> => {
        const response = await instance.get<{ data?: PriceApprovalDetails }>(
            ARTWORK_URLS.PRICE_APPROVAL_GET(token)
        );
        const payload = response.data?.data as PriceApprovalDetails | undefined;
        if (!payload) {
            throw new Error("Missing price approval payload");
        }
        return payload;
    };

export const respondToPriceApproval =
    (token: string, action: "approve" | "reject") =>
    async (): Promise<PriceApprovalResponseResult> => {
        const response = await instance.post<{ data?: PriceApprovalResponseResult }>(
            ARTWORK_URLS.PRICE_APPROVAL_RESPOND(token),
            { action }
        );
        const payload = response.data?.data as
            | PriceApprovalResponseResult
            | undefined;
        if (!payload) {
            throw new Error("Missing price approval response payload");
        }
        return payload;
    };
