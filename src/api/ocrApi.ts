import { baseApi } from './baseApi';
import type { ApiResponse } from './types';

export type OcrResult = {
  text: string;
  total?: number | null;
  currency?: string;
  merchant?: string | null;
  detectedAt: string;
};

export const ocrApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ocrScanReceipt: builder.mutation<OcrResult, Record<string, unknown>>({
      query: (body) => ({ url: '/ocr/scan', method: 'POST', body }),
      transformResponse: (response: ApiResponse<OcrResult>) => response.data
    })
  })
});

export const { useOcrScanReceiptMutation } = ocrApi;

export default ocrApi;
