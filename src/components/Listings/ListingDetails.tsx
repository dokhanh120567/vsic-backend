import React, { useState } from 'react';
import { MapPin, Clock, Users, Package } from 'lucide-react';
import { Listing } from '../../types';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { ClaimForm } from './ClaimForm';

interface ListingDetailsProps {
  listing: Listing;
  onClaim?: (listingId: string, quantity: number, notes?: string) => void;
  canClaim?: boolean;
}

export const ListingDetails: React.FC<ListingDetailsProps> = ({
  listing,
  onClaim,
  canClaim = false
}) => {
  const [showClaimModal, setShowClaimModal] = useState(false);

  const handleClaim = (quantity: number, notes?: string) => {
    if (onClaim) {
      onClaim(listing.id, quantity, notes);
      setShowClaimModal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {listing.image_url && (
        <div className="aspect-video w-full">
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h2>
            <p className="text-gray-600">{listing.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              listing.status === 'available' 
                ? 'bg-green-100 text-green-800'
                : listing.status === 'claimed'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {listing.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <Package className="w-5 h-5 mr-2" />
            <span>Quantity: {listing.quantity}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>Expires: {listing.expiry_date ? new Date(listing.expiry_date).toLocaleDateString() : 'N/A'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{listing.pickup_location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2" />
            <span>By: {listing.donor_name}</span>
          </div>
        </div>

        {listing.pickup_instructions && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Pickup Instructions</h3>
            <p className="text-gray-600">{listing.pickup_instructions}</p>
          </div>
        )}

        {canClaim && listing.status === 'available' && (
          <Button
            onClick={() => setShowClaimModal(true)}
            className="w-full"
          >
            Claim This Food
          </Button>
        )}
      </div>

      <Modal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Claim Food Item"
      >
        <ClaimForm
          listing={listing}
          onSubmit={handleClaim}
          onCancel={() => setShowClaimModal(false)}
        />
      </Modal>
    </div>
  );
};