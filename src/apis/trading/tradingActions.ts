import instance from '@/utils/apiCalls';

export interface ResaleFeePreview {
  artist_profile_id: number;
  crestox_fee_percentage: number;
  royalty_enabled: boolean;
  royalty_percentage: number;
  total_platform_fee_percentage: number;
  gross_amount?: string;
  platform_fee_amount?: string;
  crestox_fee_amount?: string;
  royalty_amount?: string;
  net_payout?: string;
}

export async function getResaleFeePreview(
  artistProfileId: number,
  grossAmount?: number,
): Promise<ResaleFeePreview> {
  const response = await instance.get(`/trading/resale-fees/${artistProfileId}`, {
    params: grossAmount != null ? { gross_amount: grossAmount } : undefined,
  });
  return response.data?.data ?? response.data;
}
