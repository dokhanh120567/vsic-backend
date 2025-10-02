import React from 'react';
import { MapPin, Clock, Package, User } from 'lucide-react';
import { Listing } from '../../types';
import { Button } from '../UI/Button';

interface ListingCardProps {
  listing: Listing;
  showClaimButton?: boolean;
  onClaim?: (listingId: string, quantity: number) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  showClaimButton = false,
  onClaim 
}) => {
  const handleClaim = () => {
    if (onClaim) {
      onClaim(listing.id, 1); // Default to claiming 1 item
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {listing.image_url && (
        <img 
          src={listing.image_url} 
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{listing.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{listing.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>Expires: {new Date(listing.expiry_date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Package className="w-4 h-4 mr-1" />
            <span>{listing.quantity} available</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <User className="w-4 h-4 mr-1" />
            <span>{listing.donor_name}</span>
          </div>
        </div>
        
        {showClaimButton && listing.status === 'available' && (
          <div className="mt-4">
            <Button 
              onClick={handleClaim}
              className="w-full"
              size="sm"
            >
              Claim Food
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};