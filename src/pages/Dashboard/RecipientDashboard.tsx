import React from 'react';
import { Search, Heart, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { ListingCard } from '../../components/Listings/ListingCard';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export const RecipientDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['recipient-claims', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('claims')
        .select('*, listings(*)')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['available-listings'],
    queryFn: () => api.listings.getAll()
  });

  if (isLoading) return <LoadingSpinner />;

  const stats = {
    food_claimed: claims.length,
    pending_claims: claims.filter((c: any) => c.status === 'pending').length,
    completed_claims: claims.filter((c: any) => c.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Recipient Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-3xl font-bold text-gray-900">{stats.food_claimed}</p>
            </div>
            <Heart className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Claims</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending_claims}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completed_claims}</p>
            </div>
            <Search className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Claims</h2>
          <Link to="/browse">
            <Button>Browse Food</Button>
          </Link>
        </div>

        {claims.length === 0 ? (
          <p className="text-gray-500">No claims yet. Browse available food to get started!</p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim: any) => (
              <div key={claim.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{claim.listings?.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {claim.quantity}</p>
                    <p className="text-sm text-gray-600">Status: <span className="capitalize">{claim.status}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Food Nearby</h2>
        {listings.length === 0 ? (
          <p className="text-gray-500">No available listings at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 6).map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
