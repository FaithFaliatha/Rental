-- Skema Database SewaMobil (Supabase PostgreSQL)

-- Active: 1698765432100@@127.0.0.1@5432@postgres

-- 1. Table: users
-- Extend auth.users from Supabase
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
  brand text not null,
  category text not null,
  price_per_day numeric not null,
  image_url text, -- URL to Supabase storage
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table: kyc_documents
create table public.kyc_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  id_card_url text not null, -- URL to KTP
  selfie_url text not null,  -- URL to Wajah
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

-- Basic Policies (Examples)
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
