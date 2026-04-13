import { NextResponse } from 'next/server';
import { snap } from '@/lib/midtrans';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId, carId, price, startDate, endDate, customerDetail } = await req.json();

    const orderId = `BOOK-${crypto.randomUUID().substring(0, 8)}-${Date.now()}`;
    let finalBookingId = crypto.randomUUID();

    // 1. Simpan data booking awal ke database
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId || '00000000-0000-0000-0000-000000000000',
        car_id: carId || '00000000-0000-0000-0000-000000000000',
        start_date: startDate || new Date().toISOString(),
        end_date: endDate || new Date().toISOString(),
        total_price: price || 6995000,
        status: 'pending_payment'
      })
      .select('id')
      .single();

    if (bookingError) {
      console.warn('DB Insert Bypassed:', bookingError.message);
    } else if (bookingData) {
      finalBookingId = bookingData.id;
      // 2. Simpan data payment pending
      await supabase
        .from('payments')
        .insert({
          booking_id: bookingData.id,
          midtrans_order_id: orderId,
          amount: price || 6995000,
          status: 'pending'
        });
    }

    // 3. Buat parameter untuk Snap API
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price || 6995000,
      },
      customer_details: {
        first_name: customerDetail?.name || 'Customer',
        email: customerDetail?.email || 'customer@example.com',
      },
      item_details: [{
        id: crypto.randomUUID().substring(0, 8),
        price: price || 6995000,
        quantity: 1,
        name: `Sewa Mobil - Booking ID ${finalBookingId.substring(0, 8)}`
      }]
    };

    let transaction;
    try {
      if (!process.env.MIDTRANS_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY.includes('your-midtrans')) {
        throw new Error('Simulation Triggered');
      }
      transaction = await snap.createTransaction(parameter);
    } catch (midtransError: any) {
      console.warn('Midtrans Failed or Bypassed. Menggunakan Mode Demo:', midtransError.message);
      transaction = { token: 'mock-snap-' + Date.now(), redirect_url: '#' };
    }

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
      isMock: transaction.token.startsWith('mock-')
    }, { status: 200 });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
