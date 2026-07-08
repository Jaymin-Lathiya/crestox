import instance from '@/utils/apiCalls';
import { WITHDRAWAL_URLS } from './withdrawalUrls';

export interface AvailableWithdrawalResponse {
  total_earnings_from_sales: string;
  total_withdrawn: string;
  pending_withdrawal: string;
  wallet_balance: string;
  available_to_withdraw: string;
  withdrawal_platform_fee_rate?: string;
  estimated_platform_fee_on_full_balance?: string;
  estimated_net_on_full_balance?: string;
}

export interface BankDetailsStatus {
  has_fund_account: boolean;
  fund_account_id: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  upi_id: string | null;
}

export interface SubmitBankDetailsDto {
  account_holder_name: string;
  account_number?: string;
  ifsc?: string;
  upi_id?: string;
  upi_phone_number?: string;
}

export interface CreateWithdrawalDto {
  amount: number;
  user_note?: string;
}

export interface WithdrawalRequest {
  id: number;
  amount: string;
  currency: string;
  status: string;
  fund_account_id: string | null;
  razorpay_payout_id: string | null;
  razorpay_payout_status: string | null;
  admin_note: string | null;
  user_note: string | null;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
}

export const getAvailableWithdrawalAmount = async (
  source?: 'artist' | 'collector',
): Promise<AvailableWithdrawalResponse> => {
  const response = await instance.get(WITHDRAWAL_URLS.GET_AVAILABLE_AMOUNT, {
    params: source ? { source } : undefined,
  });
  return response.data?.data ?? response.data;
};

export const getBankDetailsStatus = async (): Promise<BankDetailsStatus> => {
  const response = await instance.get(WITHDRAWAL_URLS.GET_BANK_DETAILS);
  return response.data?.data ?? response.data;
};

export const submitBankDetails = async (data: SubmitBankDetailsDto) => {
  const response = await instance.post(WITHDRAWAL_URLS.SUBMIT_BANK_DETAILS, data);
  return response.data?.data ?? response.data;
};

export const createWithdrawalRequest = async (data: CreateWithdrawalDto) => {
  const response = await instance.post(WITHDRAWAL_URLS.CREATE_REQUEST, data);
  return response.data?.data ?? response.data;
};

export const getMyWithdrawalRequests = async (params?: { status?: string; page?: number; limit?: number }) => {
  const response = await instance.get(WITHDRAWAL_URLS.GET_MY_REQUESTS, { params });
  return response.data?.data ?? response.data;
};

export const cancelWithdrawalRequest = async (id: number) => {
  const response = await instance.delete(WITHDRAWAL_URLS.CANCEL_REQUEST(id));
  return response.data?.data ?? response.data;
};
