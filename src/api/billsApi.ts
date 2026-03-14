import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

export type ParsedBill = {
  source: string;
  merchant: string | null;
  total: number;
  currency: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  note?: string | null;
  rawText?: string | null;
};

export const billsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    parseBill: builder.mutation<ParsedBill, Record<string, unknown>>({
      query: (body) => ({ url: '/bills/parse', method: 'POST', body }),
      transformResponse: (response: ApiResponse<ParsedBill>) => response.data
    }),
    parseSwiggy: builder.mutation<ParsedBill, Record<string, unknown>>({
      query: (body) => ({ url: '/bills/swiggy', method: 'POST', body }),
      transformResponse: (response: ApiResponse<ParsedBill>) => response.data
    }),
    parseZomato: builder.mutation<ParsedBill, Record<string, unknown>>({
      query: (body) => ({ url: '/bills/zomato', method: 'POST', body }),
      transformResponse: (response: ApiResponse<ParsedBill>) => response.data
    }),
    parseBlinkit: builder.mutation<ParsedBill, Record<string, unknown>>({
      query: (body) => ({ url: '/bills/blinkit', method: 'POST', body }),
      transformResponse: (response: ApiResponse<ParsedBill>) => response.data
    })
  })
});

export const { useParseBillMutation, useParseSwiggyMutation, useParseZomatoMutation, useParseBlinkitMutation } = billsApi;

export default billsApi;
