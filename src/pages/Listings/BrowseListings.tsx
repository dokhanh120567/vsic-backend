@@ .. @@
 import React, { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { api } from '../../lib/api';
 import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
 import { ErrorMessage } from '../../components/UI/ErrorMessage';
 import { ListingCard } from '../../components/Listings/ListingCard';
+import { SearchFilters } from '../../components/Listings/SearchFilters';
+import { useAuth } from '../../hooks/useAuth';
 
 export const BrowseListings: React.FC = () => {
+  const { user } = useAuth();
+  const queryClient = useQueryClient();
   const [searchTerm, setSearchTerm] = useState('');
   const [category, setCategory] = useState('');
   const [location, setLocation] = useState('');
@@ .. @@
     }
   });

+  const claimMutation = useMutation({
+    mutationFn: ({ listingId, quantity, notes }: { listingId: string; quantity: number; notes?: string }) =>
+      api.post(`/claims`, { listing_id: listingId, quantity, notes }),
+    onSuccess: () => {
+      queryClient.invalidateQueries({ queryKey: ['listings'] });
+      // Show success message
+    }
+  });
+
+  const handleClaim = (listingId: string, quantity: number, notes?: string) => {
+    claimMutation.mutate({ listingId, quantity, notes });
+  };
+
   if (isLoading) return <LoadingSpinner />;
   if (error) return <ErrorMessage message="Failed to load listings" />;
@@ .. @@
         <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Food</h1>
       </div>

-      {/* Search and Filters */}
-      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
-        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
-          <input
-            type="text"
-            placeholder="Search food items..."
-            value={searchTerm}
-            onChange={(e) => setSearchTerm(e.target.value)}
-            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
-          />
-          <select
-            value={category}
-            onChange={(e) => setCategory(e.target.value)}
-            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
-          >
-            <option value="">All Categories</option>
-            <option value="prepared_food">Prepared Food</option>
-            <option value="fresh_produce">Fresh Produce</option>
-            <option value="packaged_goods">Packaged Goods</option>
-            <option value="dairy">Dairy</option>
-            <option value="bakery">Bakery</option>
-            <option value="other">Other</option>
-          </select>
-          <input
-            type="text"
-            placeholder="Location or area..."
-            value={location}
-            onChange={(e) => setLocation(e.target.value)}
-            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
-          />
-        </div>
-      </div>
+      <SearchFilters
+        searchTerm={searchTerm}
+        onSearchChange={setSearchTerm}
+        category={category}
+        onCategoryChange={setCategory}
+        location={location}
+        onLocationChange={setLocation}
+      />
 
       {/* Listings Grid */}
       {listings && listings.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {listings.map((listing: any) => (
-            <ListingCard key={listing.id} listing={listing} />
+            <ListingCard 
+              key={listing.id} 
+              listing={listing} 
+              showClaimButton={user?.role === 'individual_recipient'}
+              onClaim={handleClaim}
+            />
           ))}
         </div>
       ) : (