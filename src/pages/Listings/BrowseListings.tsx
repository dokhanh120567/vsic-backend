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

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ['listings', searchTerm, category, location],
    queryFn: () => api.listings.getAll()
  });

  const claimMutation = useMutation({
    mutationFn: ({ listingId, quantity, notes }: { listingId: string; quantity: number; notes?: string }) =>
      api.claims.create(listingId, quantity, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    }
  });

  const handleClaim = (listingId: string, quantity: number, notes?: string) => {
    claimMutation.mutate({ listingId, quantity, notes });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load listings" />;

  const filteredListings = listings.filter((listing: any) => {
    const matchesSearch = !searchTerm ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || listing.category === category;
    const matchesLocation = !location ||
      listing.pickup_location?.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Browse Available Food</h1>

      <SearchFilters
        searchTerm={searchTerm}
        category={category}
        location={location}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onLocationChange={setLocation}
      />

      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing: any) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showClaimButton={user?.role === 'individual_recipient'}
              onClaim={handleClaim}
            />
          ))}
        </div>
      )}
    </div>
  );
};
