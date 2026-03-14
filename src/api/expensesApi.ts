import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

export type ExpenseShare = {
  id: string;
  userId: string;
  amount: number;
  percentage?: number | null;
  shares?: number | null;
  isPaid?: boolean;
  items?: unknown;
};

export type Expense = {
  id: string;
  groupId: string;
  paidById: string;
  title: string;
  description?: string | null;
  amount: number;
  currency: string;
  category: string;
  splitType: string;
  receiptUrl?: string | null;
  billSource?: string | null;
  billData?: unknown;
  date: string;
  isSettlement: boolean;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  paidBy?: { id: string; name: string; email?: string; avatarUrl?: string | null };
  shares?: ExpenseShare[];
};

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listExpenses: builder.query<Expense[], { groupId?: string } | void>({
      query: (params) => ({ url: '/expenses', params: params ? params : undefined }),
      transformResponse: (response: ApiResponse<Expense[]>) => response.data,
      providesTags: ['Expenses']
    }),
    createExpense: builder.mutation<Expense, Partial<Expense> & { groupId: string; title: string; amount: number }>({
      query: (body) => ({ url: '/expenses', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Expense>) => response.data,
      invalidatesTags: ['Expenses', 'Groups']
    }),
    getExpense: builder.query<Expense, { id: string }>({
      query: ({ id }) => ({ url: `/expenses/${id}` }),
      transformResponse: (response: ApiResponse<Expense>) => response.data
    }),
    updateExpense: builder.mutation<Expense, { id: string; body: Partial<Expense> }>({
      query: ({ id, body }) => ({ url: `/expenses/${id}`, method: 'PUT', body }),
      transformResponse: (response: ApiResponse<Expense>) => response.data,
      invalidatesTags: ['Expenses', 'Groups']
    }),
    deleteExpense: builder.mutation<{ id: string; deleted: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/expenses/${id}`, method: 'DELETE' }),
      transformResponse: (response: ApiResponse<{ id: string; deleted: boolean }>) => response.data,
      invalidatesTags: ['Expenses', 'Groups']
    }),
    expenseAudit: builder.query<unknown[], { id: string }>({
      query: ({ id }) => ({ url: `/expenses/${id}/audit` }),
      transformResponse: (response: ApiResponse<unknown[]>) => response.data
    }),
    importBill: builder.mutation<Expense, Record<string, unknown>>({
      query: (body) => ({ url: '/expenses/import-bill', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Expense>) => response.data,
      invalidatesTags: ['Expenses', 'Groups']
    }),
    scanReceipt: builder.mutation<unknown, Record<string, unknown>>({
      query: (body) => ({ url: '/expenses/scan-receipt', method: 'POST', body }),
      transformResponse: (response: ApiResponse<unknown>) => response.data
    })
  })
});

export const {
  useListExpensesQuery,
  useCreateExpenseMutation,
  useGetExpenseQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useExpenseAuditQuery,
  useImportBillMutation,
  useScanReceiptMutation
} = expensesApi;

export default expensesApi;
