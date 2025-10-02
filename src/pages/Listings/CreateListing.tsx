import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Textarea } from '../../components/UI/Textarea';
import { Select } from '../../components/UI/Select';

const createListingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  pickup_location: z.string().min(1, 'Pickup location is required'),
  pickup_instructions: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal(''))
});

type CreateListingData = z.infer<typeof createListingSchema>;

export default function CreateListing() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateListingData>({
    resolver: zodResolver(createListingSchema)
  });

  const mutation = useMutation({
    mutationFn: (data: CreateListingData) => api.post('/listings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      navigate('/dashboard');
    }
  });

  const onSubmit = (data: CreateListingData) => {
    mutation.mutate(data);
  };

  const categories = [
    { value: 'prepared_food', label: 'Prepared Food' },
    { value: 'fresh_produce', label: 'Fresh Produce' },
    { value: 'packaged_goods', label: 'Packaged Goods' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Share Food with Your Community</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <Input
          label="Food Title"
          placeholder="e.g., Fresh sandwiches from lunch event"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label="Description"
          placeholder="Describe the food, ingredients, preparation details..."
          error={errors.description?.message}
          rows={3}
          {...register('description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Category"
            options={[{ value: '', label: 'Select category' }, ...categories]}
            error={errors.category?.message}
            {...register('category')}
          />

          <Input
            label="Quantity"
            type="number"
            min="1"
            placeholder="Number of servings/items"
            error={errors.quantity?.message}
            {...register('quantity', { valueAsNumber: true })}
          />
        </div>

        <Input
          label="Expiry Date"
          type="datetime-local"
          error={errors.expiry_date?.message}
          {...register('expiry_date')}
        />

        <Input
          label="Pickup Location"
          placeholder="Address or general area for pickup"
          error={errors.pickup_location?.message}
          {...register('pickup_location')}
        />

        <Textarea
          label="Pickup Instructions (Optional)"
          placeholder="Special instructions for pickup (e.g., ask for manager, use back entrance)"
          rows={2}
          {...register('pickup_instructions')}
        />

        <Input
          label="Image URL (Optional)"
          type="url"
          placeholder="https://example.com/food-image.jpg"
          {...register('image_url')}
        />

        <div className="flex space-x-4">
          <Button
            type="submit"
            loading={mutation.isPending}
            className="flex-1"
          >
            Share Food
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}