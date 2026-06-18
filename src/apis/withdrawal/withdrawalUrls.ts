export const WITHDRAWAL_URLS = {
  CREATE: '/withdrawals',
  MY_REQUESTS: '/withdrawals',
  CANCEL: (id: number) => `/withdrawals/${id}`,
} as const;
