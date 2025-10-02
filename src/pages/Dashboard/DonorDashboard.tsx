import React, { useState } from 'react';
import { Plus, Package, TrendingUp, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
import { ListingCard } from '../../components/Listings/ListingCard';

export const DonorDashboard: React.FC = () => {
  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['donor-listings'],
    queryFn: () => api.get('/listings/my-listings')
  });

  const { data: stats } = useQuery({
    queryKey: ['donor-stats'],
    queryFn: () => api.get('/users/stats')
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load dashboard" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
        <Link to="/create-listing">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_listings || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">People Helped</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.people_helped || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Food Saved (lbs)</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.food_saved || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Listings</h2>
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-4">Start sharing food with your community</p>
            <Link to="/create-listing">
              <Button>Create Your First Listing</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};