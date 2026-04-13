require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: cars } = await supabase.from('cars').select('*');
  const { data: kyc } = await supabase.from('kyc_documents').select('*');
  const { data: bookings } = await supabase.from('bookings').select('*');
  const { data: users } = await supabase.from('users').select('*');

  console.log('Cars:', cars);
  console.log('KYC:', kyc);
  console.log('Bookings:', bookings);
  console.log('Users:', users);
}

checkData();
