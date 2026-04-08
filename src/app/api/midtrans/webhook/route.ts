import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Helper verifikasi signature Midtrans
function verifySignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string, signatureKey: string) {
  const hash = crypto.createHash('sha512').update(orderId + statusCode + grossAmount + serverKey).digest('hex');
  return hash === signatureKey;
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Verifikasi Payload Asli dari Midtrans
    const isValidSignature = verifySignature(
      payload.order_id,
      payload.status_code,
      payload.gross_amount,
      process.env.MIDTRANS_SERVER_KEY || '',
      payload.signature_key
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature key' }, { status: 403 });
    }

    const { transaction_status, order_id, fraud_status } = payload;
    let paymentStatus = 'pending';

    if (transaction_status == 'capture') {
      if (fraud_status == 'accept') {
        paymentStatus = 'settlement';
      }
    } else if (transaction_status == 'settlement') {
      paymentStatus = 'settlement';
    } else if (transaction_status == 'cancel' || transaction_status == 'deny' || transaction_status == 'expire') {
      paymentStatus = 'cancel'; // Atau expire, dll sesuai business logic
    } else if (transaction_status == 'pending') {
      paymentStatus = 'pending';
    }

    // Update status di Supabase tabel payments
    const { error } = await supabase
      .from('payments')
      .update({ status: paymentStatus })
      .eq('midtrans_order_id', order_id);

    if (error) {
      console.error('Error updating payment status:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
