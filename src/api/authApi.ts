import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  preferredLanguage?: string;
  isPremium?: boolean;
  premiumExpiresAt?: string | null;
};

export type TokenPair = { accessToken: string; refreshToken: string };

export type AuthResponse = { user: SafeUser; tokens: TokenPair };
export type PhoneOtpResponse = { pinId: string };

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, { name: string; email: string; password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data
    }),
    me: builder.query<SafeUser, void>({
      query: () => ({ url: '/auth/me' }),
      transformResponse: (response: ApiResponse<SafeUser>) => response.data
    }),
    refresh: builder.mutation<TokenPair, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/refresh', method: 'POST', body }),
      transformResponse: (response: ApiResponse<TokenPair>) => response.data
    }),
    logout: builder.mutation<{ message: string }, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/logout', method: 'POST', body }),
      transformResponse: (response: ApiResponse<{ message: string }>) => response.data
    }),
    googleMobile: builder.mutation<AuthResponse, { idToken?: string | null; accessToken?: string | null }>({
      query: (body) => ({ url: '/auth/google/mobile', method: 'POST', body }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data
    }),
    requestPhoneOtp: builder.mutation<PhoneOtpResponse, { phoneNumber: string }>({
      query: (body) => ({ url: '/auth/phone/request', method: 'POST', body }),
      transformResponse: (response: ApiResponse<PhoneOtpResponse>) => response.data
    }),
    verifyPhoneOtp: builder.mutation<AuthResponse, { phoneNumber: string; pinId: string; pin: string }>({
      query: (body) => ({ url: '/auth/phone/verify', method: 'POST', body }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data
    })
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useRefreshMutation,
  useLogoutMutation,
  useGoogleMobileMutation,
  useRequestPhoneOtpMutation,
  useVerifyPhoneOtpMutation
} = authApi;
