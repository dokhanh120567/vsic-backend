export interface User {
  id: string;
  email: string;
  name: string;
  full_name: string;
  role: 'donor' | 'recipient' | 'volunteer' | 'business_donor' | 'individual_recipient';
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  quantity: number;
  category: string;
  status: 'available' | 'claimed' | 'delivered';
  donor_id: string;
  donor_name?: string;
  created_at: string;
  expires_at: string;
  expiry_date?: string;
  image_url?: string;
  location?: string;
  pickup_location?: string;
  pickup_instructions?: string;
}

export interface Claim {
  id: string;
  listing_id: string;
  recipient_id: string;
  status: 'pending' | 'approved' | 'completed';
  created_at: string;
}
