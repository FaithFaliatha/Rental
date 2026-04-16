-- Skema Database SewaMobil (Supabase PostgreSQL)
-- DIBUAT DARI AWAL (FRESH INSTALL)

-- 1. Table: users
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  role text check (role in ('admin', 'customer')) default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table: cars
create table public.cars (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text default 'Toyota',
  category text not null,
  type text not null,
  price numeric not null,
  capacity integer not null,
  transmission text not null,
  image_url text,
  is_available boolean default true,
  stock integer default 1,
  total_stock integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table: kyc_documents
create table public.kyc_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  id_card_url text not null, 
  selfie_url text not null,  
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Table: bookings
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  car_id uuid references public.cars(id) not null,
  start_date date not null,
  end_date date not null,
  total_price numeric not null,
  status text check (status in ('pending_payment', 'pending_kyc', 'active', 'completed', 'cancelled', 'refunded')) default 'pending_payment',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Table: payments
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  midtrans_order_id text unique not null,
  amount numeric not null,
  payment_type text,
  status text check (status in ('pending', 'settlement', 'expire', 'cancel', 'refund')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Policies
alter table public.users enable row level security;
alter table public.cars enable row level security;
alter table public.kyc_documents enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

-- Basic Policies
create policy "Public cars are viewable by everyone." on public.cars for select using (true);
create policy "Users can view their own profile." on public.users for select using (auth.uid() = id);

-- Fungsi trigger updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_kyc_modtime before update on kyc_documents for each row execute procedure update_updated_at_column();
create trigger update_payment_modtime before update on payments for each row execute procedure update_updated_at_column();

-- ==========================================
-- ISI DATA MOCK KE TABEL CARS
-- ==========================================
INSERT INTO public.cars (id, category, name, type, price, capacity, transmission, image_url, stock, total_stock, brand)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Umum', 'Toyota Avanza', 'MVP Keluarga', 450000, 7, 'Automatic', '/api/images?car=toyota_avanza', 5, 5, 'Toyota'),
  ('22222222-2222-2222-2222-222222222222', 'Umum', 'Honda Brio', 'City Car', 350000, 5, 'Automatic', '/api/images?car=honda_brio', 3, 3, 'Honda'),
  ('33333333-3333-3333-3333-333333333333', 'Umum', 'Suzuki Ertiga', 'MVP Keluarga', 400000, 7, 'Manual', '/api/images?car=suzuki_ertiga', 2, 4, 'Suzuki'),
  ('44444444-4444-4444-4444-444444444444', 'Premium', 'Toyota Innova Zenix', 'Premium MVP', 850000, 7, 'Automatic', '/api/images?car=toyota_innova_zenix', 2, 3, 'Toyota'),
  ('55555555-5555-5555-5555-555555555555', 'Premium', 'Honda CR-V', 'Premium SUV', 900000, 5, 'Automatic', '/api/images?car=honda_crv', 1, 2, 'Honda'),
  ('66666666-6666-6666-6666-666666666666', 'Premium', 'Mitsubishi Pajero Sport', 'Premium SUV', 1000000, 7, 'Automatic', '/api/images?car=mitsubishi_pajero_sport', 3, 3, 'Mitsubishi'),
  ('77777777-7777-7777-7777-777777777777', 'Exclusive', 'Toyota Alphard', 'Luxury MVP', 2500000, 7, 'Automatic', '/api/images?car=toyota_alphard', 0, 2, 'Toyota'),
  ('88888888-8888-8888-8888-888888888888', 'Exclusive', 'Lexus LM', 'Ultra Luxury MVP', 4500000, 4, 'Automatic', '/api/images?car=lexus_lm', 1, 1, 'Lexus'),
  ('99999999-9999-9999-9999-999999999999', 'Exclusive', 'Mercedes-Benz S-Class', 'Luxury Sedan', 5000000, 4, 'Automatic', '/api/images?car=mercedes_s_class', 1, 1, 'Mercedes'),
  ('00000000-0000-0000-0000-000000000000', 'Exclusive', 'BMW 7 Series', 'Luxury Sedan', 4800000, 4, 'Automatic', '/api/images?car=bmw_7_series', 2, 2, 'BMW');
