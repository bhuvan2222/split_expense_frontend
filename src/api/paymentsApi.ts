import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

export type SubscriptionStatus = {
  status: string;
  premiumExpiresAt?: string | null;
  planId?: string;
  transactionId?: string | null;
  provider?: string;
  order?: unknown;
  keyId?: string;
  durationDays?: number;
};

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<SubscriptionStatus, { planId?: string; durationDays?: number; amount?: number; currency?: string; provider?: string }>({
      query: (body) => ({ url: '/payments/subscription/create', method: 'POST', body }),
      transformResponse: (response: ApiResponse<SubscriptionStatus>) => response.data,
      invalidatesTags: ['Payments', 'Users']
    }),
    verifySubscription: builder.mutation<SubscriptionStatus, { orderId?: string; paymentId?: string; signature?: string; durationDays?: number; transactionId?: string }>({
      query: (body) => ({ url: '/payments/subscription/verify', method: 'POST', body }),
      transformResponse: (response: ApiResponse<SubscriptionStatus>) => response.data,
      invalidatesTags: ['Payments', 'Users']
    }),
    subscriptionStatus: builder.query<SubscriptionStatus, void>({
      query: () => ({ url: '/payments/subscription/status' }),
      transformResponse: (response: ApiResponse<SubscriptionStatus>) => response.data,
      providesTags: ['Payments']
    })
  })
});

export const { useCreateSubscriptionMutation, useVerifySubscriptionMutation, useSubscriptionStatusQuery } = paymentsApi;

export default paymentsApi;
