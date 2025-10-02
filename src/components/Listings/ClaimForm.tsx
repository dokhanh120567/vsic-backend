import React, { useState } from 'react';
import { Listing } from '../../types';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Textarea } from '../UI/Textarea';

interface ClaimFormProps {
  listing: Listing;
  onSubmit: (quantity: number, notes?: string) => void;
  onCancel: () => void;
}

export const ClaimForm: React.FC<ClaimFormProps> = ({
  listing,
  onSubmit,
  onCancel
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(quantity, notes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
        <p className="text-gray-600 mb-4">Available quantity: {listing.quantity}</p>
      </div>

      <Input
        label="Quantity to claim"
        type="number"
        min="1"
        max={listing.quantity}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        required
      />

      <Textarea
        label="Additional notes (optional)"
        placeholder="Any special requests or pickup preferences..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />

      <div className="flex space-x-3">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
        >
          Submit Claim
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};