-- UPDATE EXISTING SCHEMA (IF ALREADY CREATED, IF NOT JUST USE THE SCHEMA.SQL FIRST)
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS type text,
  ADD COLUMN IF NOT EXISTS capacity integer,
  ADD COLUMN IF NOT EXISTS transmission text,
  ADD COLUMN IF NOT EXISTS stock integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_stock integer DEFAULT 1,
  RENAME COLUMN price_per_day TO price;

-- To prevent errors, some defaults might be necessary if tables already had data. We omit strict constraints for alter.

-- CLEAR OLD DATA
DELETE FROM public.cars;

-- INSERT NEW MOCK DATA
-- Note: UUIDs are predefined here so that they remain consistent and testable.
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
