/*
  # Initial Food Sharing Platform Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `phone_number` (text)
      - `role` (text) - business_donor, individual_recipient, volunteer
      - `rating_avg` (numeric)
      - `rating_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `listings`
      - `id` (uuid, primary key)
      - `donor_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `quantity` (integer)
      - `image_url` (text, optional)
      - `pickup_location` (text)
      - `pickup_instructions` (text, optional)
      - `expiry_date` (timestamptz)
      - `status` (text) - available, claimed, delivered
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `claims`
      - `id` (uuid, primary key)
      - `listing_id` (uuid, references listings)
      - `recipient_id` (uuid, references profiles)
      - `quantity` (integer)
      - `notes` (text, optional)
      - `status` (text) - pending, approved, completed, cancelled
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `reviews`
      - `id` (uuid, primary key)
      - `from_user_id` (uuid, references profiles)
      - `to_user_id` (uuid, references profiles)
      - `listing_id` (uuid, references listings)
      - `rating` (integer, 1-5)
      - `comment` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to listings
    - Add policies for claiming and reviewing
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone_number text,
  role text NOT NULL CHECK (role IN ('business_donor', 'individual_recipient', 'volunteer')),
  rating_avg numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  image_url text,
  pickup_location text NOT NULL,
  pickup_instructions text,
  expiry_date timestamptz NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'delivered')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Listings policies
CREATE POLICY "Anyone can view available listings"
  ON listings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Donors can create listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = donor_id);

-- Claims policies
CREATE POLICY "Users can view claims they're involved in"
  ON claims FOR SELECT
  TO authenticated
  USING (
    auth.uid() = recipient_id OR
    auth.uid() IN (SELECT donor_id FROM listings WHERE id = listing_id)
  );

CREATE POLICY "Recipients can create claims"
  ON claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Recipients can update own claims"
  ON claims FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Donors can update claims on their listings"
  ON claims FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT donor_id FROM listings WHERE id = listing_id)
  )
  WITH CHECK (
    auth.uid() IN (SELECT donor_id FROM listings WHERE id = listing_id)
  );

-- Reviews policies
CREATE POLICY "Users can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_donor_id ON listings(donor_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_expiry_date ON listings(expiry_date);
CREATE INDEX IF NOT EXISTS idx_claims_listing_id ON claims(listing_id);
CREATE INDEX IF NOT EXISTS idx_claims_recipient_id ON claims(recipient_id);
CREATE INDEX IF NOT EXISTS idx_reviews_to_user_id ON reviews(to_user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
