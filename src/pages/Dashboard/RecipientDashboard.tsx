import React from 'react';
import { Search, Heart, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { ListingCard } from '../../components/Listings/ListingCard';

export const RecipientDashboard: React.FC = () => {
  const { data: recentListings, isLoading: loadingRecent } = useQuery({
    queryKey: ['recent-listings'],
    queryFn: () => api.get('/listings?limit=6')
  });

  const { data: myClaims, isLoading: loadingClaims } = useQuery({
    queryKey: ['my-claims'],
    queryFn: () => api.get('/claims/my-claims')
  });

  const { data: stats } = useQuery({
    queryKey: ['recipient-stats'],
    queryFn: () => api.get('/users/stats')
  });

  if (loadingRecent || loadingClaims) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Find Food Near You</h1>
        <Link to="/browse">
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Browse All Food
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Food Claimed</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.food_claimed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Claims</p>
              <p className="text-2xl font-bold text-gray-900">{myClaims?.filter((c: any) => c.status === 'pending').length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Search className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Items</p>
              <p className="text-2xl font-bold text-gray-900">{recentListings?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Available Food */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Available Food</h2>
        {recentListings && recentListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} showClaimButton />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No food available right now</h3>
            <p className="text-gray-600 mb-4">Check back later or browse all listings</p>
            <Link to="/browse">
              <Button>Browse All Food</Button>
            </Link>
          </div>
        )}
      </div>

      {/* My Claims */}
      {myClaims && myClaims.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Claims</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {myClaims.map((claim: any) => (
                <div key={claim.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{claim.listing_title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {claim.quantity}</p>
                    <p className="text-sm text-gray-500">Claimed: {new Date(claim.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    claim.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : claim.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {claim.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};