import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
import { ListingCard } from '../../components/Listings/ListingCard';
import { SearchFilters } from '../../components/Listings/SearchFilters';
import { useAuth } from '../../hooks/useAuth';

export const BrowseListings: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['listings', searchTerm, category, location],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      
      const response = await api.get(`/listings?${params.toString()}`);
      return response.data;
    }
  });

  const claimMutation = useMutation({
    mutationFn: ({ listingId, quantity, notes }: { listingId: string; quantity: number; notes?: string }) =>
      api.post(`/claims`, { listing_id: listingId, quantity, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      // Show success message
    }
  });

  const handleClaim = (listingId: string, quantity: number, notes?: string) => {
    claimMutation.mutate({ listingId, quantity, notes });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load listings" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Food</h1>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        location={location}
        onLocationChange={setLocation}
      />

      {/* Listings Grid */}
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              showClaimButton={user?.role === 'individual_recipient'}
              onClaim={handleClaim}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};