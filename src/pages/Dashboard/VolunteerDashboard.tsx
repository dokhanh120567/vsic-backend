import React from 'react';
import { Truck, Users, MapPin, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { Button } from '../../components/UI/Button';

export const VolunteerDashboard: React.FC = () => {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['volunteer-assignments'],
    queryFn: () => api.get('/volunteers/assignments')
  });

  const { data: stats } = useQuery({
    queryKey: ['volunteer-stats'],
    queryFn: () => api.get('/users/stats')
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
        <Button>
          <Truck className="w-4 h-4 mr-2" />
          Available for Pickup
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Deliveries Made</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.deliveries_made || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">People Helped</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.people_helped || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Miles Driven</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.miles_driven || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Volunteered</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.hours_volunteered || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Assignments</h2>
        {assignments && assignments.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {assignments.map((assignment: any) => (
                <div key={assignment.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.status === 'assigned' 
                        ? 'bg-blue-100 text-blue-800'
                        : assignment.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {assignment.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Pickup: {assignment.pickup_location}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Delivery: {assignment.delivery_location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Contact: {assignment.contact_info}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <Button size="sm">Mark as Picked Up</Button>
                    <Button size="sm" variant="outline">Contact Donor</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No current assignments</h3>
            <p className="text-gray-600 mb-4">Check back later for new volunteer opportunities</p>
            <Button>Mark Yourself Available</Button>
          </div>
        )}
      </div>
    </div>
  );
};