import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

export type Group = {
  id: string;
  name: string;
  description?: string | null;
  emoji?: string | null;
  type?: string;
  currency?: string;
  simplifyDebts?: boolean;
  inviteCode?: string;
  isArchived?: boolean;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  counts?: { members: number; expenses: number };
  membership?: { role: 'ADMIN' | 'MEMBER'; nickname?: string | null } | null;
  members?: Array<{
    id: string;
    role: 'ADMIN' | 'MEMBER';
    nickname?: string | null;
    joinedAt: string;
    user: { id: string; name: string; email: string; avatarUrl?: string | null };
  }>;
};

export type BalanceLine = {
  from: { id: string; name: string; email?: string; avatarUrl?: string | null };
  to: { id: string; name: string; email?: string; avatarUrl?: string | null };
  amount: number;
};

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listGroups: builder.query<Group[], { includeArchived?: boolean } | void>({
      query: (params) => ({ url: '/groups', params: params ? params : undefined }),
      transformResponse: (response: ApiResponse<Group[]>) => response.data,
      providesTags: ['Groups']
    }),
    createGroup: builder.mutation<Group, Partial<Group> & { name: string }>({
      query: (body) => ({ url: '/groups', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Group>) => response.data,
      invalidatesTags: ['Groups']
    }),
    getGroup: builder.query<Group, { id: string }>({
      query: ({ id }) => ({ url: `/groups/${id}` }),
      transformResponse: (response: ApiResponse<Group>) => response.data,
      providesTags: ['Groups']
    }),
    updateGroup: builder.mutation<Group, { id: string; body: Partial<Group> }>({
      query: ({ id, body }) => ({ url: `/groups/${id}`, method: 'PUT', body }),
      transformResponse: (response: ApiResponse<Group>) => response.data,
      invalidatesTags: ['Groups']
    }),
    archiveGroup: builder.mutation<{ id: string; isArchived: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/groups/${id}`, method: 'DELETE' }),
      transformResponse: (response: ApiResponse<{ id: string; isArchived: boolean }>) => response.data,
      invalidatesTags: ['Groups']
    }),
    getBalances: builder.query<{ group: Group; balances: BalanceLine[]; rawBalances: BalanceLine[] }, { id: string }>({
      query: ({ id }) => ({ url: `/groups/${id}/balances` }),
      transformResponse: (response: ApiResponse<{ group: Group; balances: BalanceLine[]; rawBalances: BalanceLine[] }>) =>
        response.data
    }),
    listMembers: builder.query<Group['members'], { id: string }>({
      query: ({ id }) => ({ url: `/groups/${id}/members` }),
      transformResponse: (response: ApiResponse<Group['members']>) => response.data
    }),
    addMember: builder.mutation<unknown, { id: string; userId?: string; email?: string; nickname?: string | null }>({
      query: ({ id, ...body }) => ({ url: `/groups/${id}/members`, method: 'POST', body }),
      transformResponse: (response: ApiResponse<unknown>) => response.data,
      invalidatesTags: ['Groups']
    }),
    removeMember: builder.mutation<{ id: string; removed: boolean }, { id: string; userId: string }>({
      query: ({ id, userId }) => ({ url: `/groups/${id}/members/${userId}`, method: 'DELETE' }),
      transformResponse: (response: ApiResponse<{ id: string; removed: boolean }>) => response.data,
      invalidatesTags: ['Groups']
    }),
    joinByInvite: builder.mutation<unknown, { inviteCode: string }>({
      query: ({ inviteCode }) => ({ url: `/groups/join/${inviteCode}`, method: 'POST' }),
      transformResponse: (response: ApiResponse<unknown>) => response.data,
      invalidatesTags: ['Groups']
    }),
    inviteLink: builder.query<{ inviteCode: string; webLink?: string | null; deepLink?: string | null }, { id: string }>({
      query: ({ id }) => ({ url: `/groups/${id}/invite-link` }),
      transformResponse: (response: ApiResponse<{ inviteCode: string; webLink?: string | null; deepLink?: string | null }>) =>
        response.data
    }),
    getAuditLog: builder.query<unknown[], { id: string }>({
      query: ({ id }) => ({ url: `/groups/${id}/audit` }),
      transformResponse: (response: ApiResponse<unknown[]>) => response.data
    }),
    exportCsv: builder.query<string, { id: string }>({
      query: ({ id }) => ({
        url: `/groups/${id}/export/csv`,
        responseHandler: (response: Response) => response.text()
      }) as any,
      transformResponse: (response: string) => response
    }),
    exportPdf: builder.query<string, { id: string }>({
      query: ({ id }) => ({
        url: `/groups/${id}/export/pdf`,
        responseHandler: (response: Response) => response.text()
      }) as any,
      transformResponse: (response: string) => response
    })
  })
});

export const {
  useListGroupsQuery,
  useCreateGroupMutation,
  useGetGroupQuery,
  useUpdateGroupMutation,
  useArchiveGroupMutation,
  useGetBalancesQuery,
  useListMembersQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useJoinByInviteMutation,
  useInviteLinkQuery,
  useGetAuditLogQuery,
  useExportCsvQuery,
  useExportPdfQuery,
  useLazyExportCsvQuery,
  useLazyExportPdfQuery
} = groupsApi;

export default groupsApi;
