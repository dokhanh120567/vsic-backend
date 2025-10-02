import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Truck, ArrowRight, Search, Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useAuth } from '../hooks/useAuth';

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-20 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Share Food, Share Hope
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect food donors with those in need. Reduce waste, fight hunger, and build stronger communities together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/browse">
                  <Button size="lg">
                    <Search className="w-5 h-5 mr-2" />
                    Browse Available Food
                  </Button>
                </Link>
                {user.role === 'business_donor' && (
                  <Link to="/create-listing">
                    <Button variant="outline" size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Share Food
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/browse">
                  <Button size="lg">
                    Find Food Near You
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Join as Donor
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How VSIC Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Share with Care</h3>
            <p className="text-gray-600">
              Businesses and individuals can easily list surplus food items that would otherwise go to waste.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect Communities</h3>
            <p className="text-gray-600">
              Find food donations near you and connect with local organizations and individuals in need.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Pickup</h3>
            <p className="text-gray-600">
              Coordinate pickup times and locations through our platform for seamless food sharing.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 rounded-2xl p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Making an Impact Together</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">10,000+</div>
              <div className="text-gray-600">Meals Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Communities Served</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!user && (
        <div className="bg-emerald-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of people already using VSIC to share food and build stronger communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg">
                Browse Available Food
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};