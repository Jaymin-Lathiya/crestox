import instance from "@/utils/apiCalls";
import { WITHDRAWAL_URLS } from "./withdrawalUrls";

export type WithdrawalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface WithdrawalRequest {
  id: number;
  amount: string;
  currency: string;
  status: WithdrawalRequestStatus;
  fund_account_id: string | null;
  razorpay_payout_id: string | null;
  razorpay_payout_status: string | null;
  admin_note: string | null;
  user_note: string | null;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
}

export interface CreateWithdrawalRequestDto {
  amount: number;
  user_note?: string;
}

export interface WithdrawalRequestsResponse {
  requests: WithdrawalRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const createWithdrawalRequest =
  (data: CreateWithdrawalRequestDto) => async () => {
    const response = await instance.post(WITHDRAWAL_URLS.CREATE, data);
    return response;
  };

export const getMyWithdrawalRequests =
  (params?: { status?: WithdrawalRequestStatus; page?: number; limit?: number }) =>
  async () => {
    const response = await instance.get(WITHDRAWAL_URLS.MY_REQUESTS, { params });
    return response;
  };

export const cancelWithdrawalRequest = (id: number) => async () => {
  const response = await instance.delete(WITHDRAWAL_URLS.CANCEL(id));
  return response;
};
