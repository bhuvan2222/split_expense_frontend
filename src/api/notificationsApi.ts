import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

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

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<NotificationItem[], { unread?: boolean } | void>({
      query: (params) => ({ url: '/notifications', params: params ? params : undefined }),
      transformResponse: (response: ApiResponse<NotificationItem[]>) => response.data,
      providesTags: ['Notifications']
    }),
    createNotification: builder.mutation<{ created: number }, { userId?: string; userIds?: string[]; title: string; body: string; type?: string; data?: unknown }>({
      query: (body) => ({ url: '/notifications', method: 'POST', body }),
      transformResponse: (response: ApiResponse<{ created: number }>) => response.data,
      invalidatesTags: ['Notifications']
    })
  })
});

export const { useListNotificationsQuery, useCreateNotificationMutation } = notificationsApi;

export default notificationsApi;
