import React from 'react';
import { Plus, Package, TrendingUp, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
import { ListingCard } from '../../components/Listings/ListingCard';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ['donor-listings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const { data: claims = [] } = useQuery({
    queryKey: ['donor-claims', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('claims')
        .select('*, listings!inner(*)')
        .eq('listings.donor_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load dashboard" />;

  const stats = {
    total_listings: listings.length,
    people_helped: claims.filter((c: any) => c.status === 'completed').length,
    food_saved: listings.reduce((sum: number, l: any) => sum + (l.quantity || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
        <Link to="/create-listing">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Share Food
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Listings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_listings}</p>
            </div>
            <Package className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">People Helped</p>
              <p className="text-3xl font-bold text-gray-900">{stats.people_helped}</p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Items Shared</p>
              <p className="text-3xl font-bold text-gray-900">{stats.food_saved}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Listings</h2>
        {listings.length === 0 ? (
          <p className="text-gray-500">No listings yet. Create your first listing to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
