import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  preferredLanguage: string;
  isPremium: boolean;
  premiumExpiresAt?: string | null;
  createdAt?: string;
};

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: unknown;
  isRead: boolean;
  createdAt: string;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => ({ url: '/users/profile' }),
      transformResponse: (response: ApiResponse<UserProfile>) => response.data,
      providesTags: ['Users']
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (body) => ({ url: '/users/profile', method: 'PUT', body }),
      transformResponse: (response: ApiResponse<UserProfile>) => response.data,
      invalidatesTags: ['Users']
    }),
    registerFcmToken: builder.mutation<{ registered: boolean }, { token: string }>({
      query: (body) => ({ url: '/users/fcm-token', method: 'POST', body }),
      transformResponse: (response: ApiResponse<{ registered: boolean }>) => response.data
    }),
    searchUsers: builder.query<Array<{ id: string; name: string; email: string; avatarUrl?: string | null }>, { q: string }>({
      query: ({ q }) => ({ url: '/users/search', params: { q } }),
      transformResponse: (response: ApiResponse<Array<{ id: string; name: string; email: string; avatarUrl?: string | null }>>) =>
        response.data
    }),
    getNotifications: builder.query<NotificationItem[], void>({
      query: () => ({ url: '/users/notifications' }),
      transformResponse: (response: ApiResponse<NotificationItem[]>) => response.data,
      providesTags: ['Notifications']
    }),
    markNotificationRead: builder.mutation<NotificationItem, { id: string }>({
      query: ({ id }) => ({ url: `/users/notifications/${id}/read`, method: 'PUT' }),
      transformResponse: (response: ApiResponse<NotificationItem>) => response.data,
      invalidatesTags: ['Notifications']
    }),
    deleteAccount: builder.mutation<{ deleted: boolean }, void>({
      query: () => ({ url: '/users/account', method: 'DELETE' }),
      transformResponse: (response: ApiResponse<{ deleted: boolean }>) => response.data
    })
  })
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useRegisterFcmTokenMutation,
  useSearchUsersQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteAccountMutation
} = usersApi;

export default usersApi;
