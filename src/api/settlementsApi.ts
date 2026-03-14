import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

export type Settlement = {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  note?: string | null;
  settledAt?: string | null;
  createdAt: string;
  fromUser?: { id: string; name: string; email?: string; avatarUrl?: string | null };
  toUser?: { id: string; name: string; email?: string; avatarUrl?: string | null };
};

export const settlementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSettlements: builder.query<Settlement[], { groupId?: string } | void>({
      query: (params) => ({ url: '/settlements', params: params ? params : undefined }),
      transformResponse: (response: ApiResponse<Settlement[]>) => response.data,
      providesTags: ['Settlements']
    }),
    createSettlement: builder.mutation<Settlement, Record<string, unknown>>({
      query: (body) => ({ url: '/settlements', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Settlement>) => response.data,
      invalidatesTags: ['Settlements', 'Groups']
    }),
    initiateUpi: builder.mutation<{ settlement: Settlement; upiIntent: string }, Record<string, unknown>>({
      query: (body) => ({ url: '/settlements/upi/initiate', method: 'POST', body }),
      transformResponse: (response: ApiResponse<{ settlement: Settlement; upiIntent: string }>) => response.data
    }),
    verifyUpi: builder.mutation<Settlement, Record<string, unknown>>({
      query: (body) => ({ url: '/settlements/upi/verify', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Settlement>) => response.data,
      invalidatesTags: ['Settlements']
    }),
    updateSettlementStatus: builder.mutation<Settlement, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/settlements/${id}/status`, method: 'PUT', body: { status } }),
      transformResponse: (response: ApiResponse<Settlement>) => response.data,
      invalidatesTags: ['Settlements']
    })
  })
});

export const {
  useListSettlementsQuery,
  useCreateSettlementMutation,
  useInitiateUpiMutation,
  useVerifyUpiMutation,
  useUpdateSettlementStatusMutation
} = settlementsApi;

export default settlementsApi;
