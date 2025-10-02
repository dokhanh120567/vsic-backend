@@ .. @@
 import React from 'react';
 import { useForm } from 'react-hook-form';
 import { zodResolver } from '@hookform/resolvers/zod';
 import { z } from 'zod';
 import { useMutation, useQueryClient } from '@tanstack/react-query';
 import { useNavigate } from 'react-router-dom';
 import { api } from '../../lib/api';
+import { Button } from '../../components/UI/Button';
+import { Input } from '../../components/UI/Input';
+import { Textarea } from '../../components/UI/Textarea';
+import { Select } from '../../components/UI/Select';
 
 const createListingSchema = z.object({
@@ .. @@
   const navigate = useNavigate();
   const queryClient = useQueryClient();
 
-  const { register, handleSubmit, formState: { errors } } = useForm<CreateListingData>({
+  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateListingData>({
     resolver: zodResolver(createListingSchema)
   });
@@ .. @@
   const mutation = useMutation({
     mutationFn: (data: CreateListingData) => api.post('/listings', data),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['listings'] });
-      navigate('/browse');
+      navigate('/dashboard');
     }
   });
@@ .. @@
     mutation.mutate(data);
   };

+  const categories = [
+    { value: 'prepared_food', label: 'Prepared Food' },
+    { value: 'fresh_produce', label: 'Fresh Produce' },
+    { value: 'packaged_goods', label: 'Packaged Goods' },
+    { value: 'dairy', label: 'Dairy' },
+    { value: 'bakery', label: 'Bakery' },
+    { value: 'other', label: 'Other' }
+  ];
+
   return (
     <div className="max-w-2xl mx-auto">
       <h1 className="text-3xl font-bold text-gray-900 mb-8">Share Food with Your Community</h1>
@@ .. @@
       <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
-        <div>
-          <label className="block text-sm font-medium text-gray-700 mb-2">
-            Food Title
-          </label>
-          <input
-            {...register('title')}
-            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-            placeholder="e.g., Fresh sandwiches from lunch event"
-          />
-          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
-        </div>
+        <Input
+          label="Food Title"
+          placeholder="e.g., Fresh sandwiches from lunch event"
+          error={errors.title?.message}
+          {...register('title')}
+        />
 
-        <div>
-          <label className="block text-sm font-medium text-gray-700 mb-2">
-            Description
-          </label>
-          <textarea
-            {...register('description')}
-            rows={3}
-            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-            placeholder="Describe the food, ingredients, preparation details..."
-          />
-          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
-        </div>
+        <Textarea
+          label="Description"
+          placeholder="Describe the food, ingredients, preparation details..."
+          error={errors.description?.message}
+          rows={3}
+          {...register('description')}
+        />
 
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
-          <div>
-            <label className="block text-sm font-medium text-gray-700 mb-2">
-              Category
-            </label>
-            <select
-              {...register('category')}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-            >
-              <option value="">Select category</option>
-              <option value="prepared_food">Prepared Food</option>
-              <option value="fresh_produce">Fresh Produce</option>
-              <option value="packaged_goods">Packaged Goods</option>
-              <option value="dairy">Dairy</option>
-              <option value="bakery">Bakery</option>
-              <option value="other">Other</option>
-            </select>
-            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
-          </div>
+          <Select
+            label="Category"
+            options={[{ value: '', label: 'Select category' }, ...categories]}
+            error={errors.category?.message}
+            {...register('category')}
+          />
 
-          <div>
-            <label className="block text-sm font-medium text-gray-700 mb-2">
-              Quantity
-            </label>
-            <input
-              type="number"
-              min="1"
-              {...register('quantity', { valueAsNumber: true })}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-              placeholder="Number of servings/items"
-            />
-            {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
-          </div>
+          <Input
+            label="Quantity"
+            type="number"
+            min="1"
+            placeholder="Number of servings/items"
+            error={errors.quantity?.message}
+            {...register('quantity', { valueAsNumber: true })}
+          />
         </div>
 
-        <div>
-          <label className="block text-sm font-medium text-gray-700 mb-2">
-            Expiry Date
-          </label>
-          <input
-            type="datetime-local"
-            {...register('expiry_date')}
-            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-          />
-          {errors.expiry_date && <p className="text-red-600 text-sm mt-1">{errors.expiry_date.message}</p>}
-        </div>
+        <Input
+          label="Expiry Date"
+          type="datetime-local"
+          error={errors.expiry_date?.message}
+          {...register('expiry_date')}
+        />
 
-        <div>
-          <label className="block text-sm font-medium text-gray-700 mb-2">
-            Pickup Location
-          </label>
-          <input
-            {...register('pickup_location')}
-            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-            placeholder="Address or general area for pickup"
-          />
-          {errors.pickup_location && <p className="text-red-600 text-sm mt-1">{errors.pickup_location.message}</p>}
-        </div>
+        <Input
+          label="Pickup Location"
+          placeholder="Address or general area for pickup"
+          error={errors.pickup_location?.message}
+          {...register('pickup_location')}
+        />
 
-        <div>
-          <label className="block text-sm font-medium text-gray-700 mb-2">
-            Pickup Instructions (Optional)
-          </label>
-          <textarea
-            {...register('pickup_instructions')}
-            rows={2}
-            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-            placeholder="Special instructions for pickup (e.g., ask for manager, use back entrance)"
-          />
-        </div>
+        <Textarea
+          label="Pickup Instructions (Optional)"
+          placeholder="Special instructions for pickup (e.g., ask for manager, use back entrance)"
+          rows={2}
+          {...register('pickup_instructions')}
+        />
 
-        <div>
-          <label className="block text-sm font-medium text-gray-700 mb-2">
-            Image URL (Optional)
-          </label>
-          <input
-            type="url"
-            {...register('image_url')}
-            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-            placeholder="https://example.com/food-image.jpg"
-          />
-        </div>
+        <Input
+          label="Image URL (Optional)"
+          type="url"
+          placeholder="https://example.com/food-image.jpg"
+          {...register('image_url')}
+        />
 
         <div className="flex space-x-4">
-          <button
+          <Button
             type="submit"
-            disabled={mutation.isPending}
-            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
+            loading={mutation.isPending}
+            className="flex-1"
           >
-            {mutation.isPending ? 'Creating...' : 'Share Food'}
-          </button>
-          <button
+            Share Food
+          </Button>
+          <Button
             type="button"
+            variant="outline"
             onClick={() => navigate('/dashboard')}
-            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
+            className="flex-1"
           >
             Cancel
-          </button>
+          </Button>
         </div>
       </form>
     </div>