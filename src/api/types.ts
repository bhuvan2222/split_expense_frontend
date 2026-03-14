export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { code: string; message: string; fields?: { field: string; message: string }[] };
};

export type ApiError = {
  status: number;
  data?: {
    success?: boolean;
    error?: { code?: string; message?: string; fields?: { field: string; message: string }[] };
  };
};
