export const WITHDRAWAL_URLS = {
  CREATE_REQUEST: '/withdrawals',
  GET_MY_REQUESTS: '/withdrawals',
  GET_AVAILABLE_AMOUNT: '/withdrawals/available-amount',
  GET_BANK_DETAILS: '/withdrawals/bank-details',
  SUBMIT_BANK_DETAILS: '/withdrawals/bank-details',
  CANCEL_REQUEST: (id: number) => `/withdrawals/${id}`,
};
