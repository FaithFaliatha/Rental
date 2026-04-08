// @ts-expect-error - no type declaration available for midtrans-client
import midtransClient from 'midtrans-client';

const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

// Konfigurasi Snap API Client
export const snap = new midtransClient.Snap({
  isProduction: isProduction,
  serverKey: serverKey,
  clientKey: clientKey,
});

// Konfigurasi Core API Client (Untuk Refund)
export const coreApi = new midtransClient.CoreApi({
  isProduction: isProduction,
  serverKey: serverKey,
  clientKey: clientKey,
});
