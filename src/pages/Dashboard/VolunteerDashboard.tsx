import React from 'react';
import { Truck, Users, Clock, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
export const VolunteerDashboard: React.FC = () => {

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['available-listings'],
    queryFn: () => api.listings.getAll()
  });

  if (isLoading) return <LoadingSpinner />;

  const stats = {
    deliveries_made: 0,
    people_helped: 0,
    miles_driven: 0,
    hours_volunteered: 0,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deliveries</p>
              <p className="text-3xl font-bold text-gray-900">{stats.deliveries_made}</p>
            </div>
            <Truck className="w-12 h-12 text-blue-500" />
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
              <p className="text-sm text-gray-600">Miles Driven</p>
              <p className="text-3xl font-bold text-gray-900">{stats.miles_driven}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hours</p>
              <p className="text-3xl font-bold text-gray-900">{stats.hours_volunteered}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Deliveries</h2>
        {listings.length === 0 ? (
          <p className="text-gray-500">No deliveries available at the moment.</p>
        ) : (
          <div className="space-y-4">
            {listings.map((listing: any) => (
              <div key={listing.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold">{listing.title}</h3>
                <p className="text-sm text-gray-600">Pickup: {listing.pickup_location}</p>
                <p className="text-sm text-gray-600">Quantity: {listing.quantity}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
