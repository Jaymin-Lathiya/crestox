export const WITHDRAWAL_URLS = {
  CREATE_REQUEST: '/withdrawals',
  GET_MY_REQUESTS: '/withdrawals',
  GET_AVAILABLE_AMOUNT: '/withdrawals/available-amount',
  GET_BANK_DETAILS: '/withdrawals/bank-details',
  SUBMIT_BANK_DETAILS: '/withdrawals/bank-details',
  SEND_BANK_DETAILS_LINK: '/withdrawals/bank-details/send-link',
  CANCEL_REQUEST: (id: number) => `/withdrawals/${id}`,
};
