export interface CarData {
  id: number;
  category: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  transmission: string;
  image: string;
}

export const MOCK_CARS: CarData[] = [
  // Umum
  { 
    id: 1, category: 'Umum', name: 'Toyota Avanza', type: 'MVP Keluarga', price: 450000, 
    capacity: 7, transmission: 'Automatic', 
    image: '/api/images?car=toyota_avanza'
  },
  { 
    id: 2, category: 'Umum', name: 'Honda Brio', type: 'City Car', price: 350000, 
    capacity: 5, transmission: 'Automatic', 
    image: '/api/images?car=honda_brio'
  },
  { 
    id: 3, category: 'Umum', name: 'Suzuki Ertiga', type: 'MVP Keluarga', price: 400000, 
    capacity: 7, transmission: 'Manual', 
    image: '/api/images?car=suzuki_ertiga'
  },
  
  // Premium
  { 
    id: 4, category: 'Premium', name: 'Toyota Innova Zenix', type: 'Premium MVP', price: 850000, 
    capacity: 7, transmission: 'Automatic', 
    image: '/api/images?car=toyota_innova_zenix'
  },
  { 
    id: 5, category: 'Premium', name: 'Honda CR-V', type: 'Premium SUV', price: 900000, 
    capacity: 5, transmission: 'Automatic', 
    image: '/api/images?car=honda_crv'
  },
  { 
    id: 6, category: 'Premium', name: 'Mitsubishi Pajero Sport', type: 'Premium SUV', price: 1000000, 
    capacity: 7, transmission: 'Automatic', 
    image: '/api/images?car=mitsubishi_pajero_sport'
  },

  // Exclusive
  { 
    id: 7, category: 'Exclusive', name: 'Toyota Alphard', type: 'Luxury MVP', price: 2500000, 
    capacity: 7, transmission: 'Automatic', 
    image: '/api/images?car=toyota_alphard'
  },
  { 
    id: 8, category: 'Exclusive', name: 'Lexus LM', type: 'Ultra Luxury MVP', price: 4500000, 
    capacity: 4, transmission: 'Automatic', 
    image: '/api/images?car=lexus_lm'
  },
  { 
    id: 9, category: 'Exclusive', name: 'Mercedes-Benz S-Class', type: 'Luxury Sedan', price: 5000000, 
    capacity: 4, transmission: 'Automatic', 
    image: '/api/images?car=mercedes_s_class'
  },
  { 
    id: 10, category: 'Exclusive', name: 'BMW 7 Series', type: 'Luxury Sedan', price: 4800000, 
    capacity: 4, transmission: 'Automatic', 
    image: '/api/images?car=bmw_7_series'
  },
];
