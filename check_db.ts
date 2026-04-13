import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: cars } = await supabase.from('cars').select('*');
  console.log('Cars length:', cars?.length);
  if (cars?.length) console.log(cars[0]);
}

checkData();
