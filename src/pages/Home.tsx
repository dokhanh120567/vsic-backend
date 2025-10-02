@@ .. @@
 import React from 'react';
 import { Link } from 'react-router-dom';
-import { Heart, Users, Truck, ArrowRight } from 'lucide-react';
+import { Heart, Users, Truck, ArrowRight, Search, Plus } from 'lucide-react';
+import { Button } from '../components/UI/Button';
+import { useAuth } from '../hooks/useAuth';
 
 export const Home: React.FC = () => {
+  const { user } = useAuth();
+
   return (
     <div className="space-y-16">
       {/* Hero Section */}
@@ .. @@
           <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
             Connect food donors with those in need. Reduce waste, fight hunger, and build stronger communities together.
           </p>
-          <div className="flex flex-col sm:flex-row gap-4 justify-center">
-            <Link
-              to="/browse"
-              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center"
-            >
-              Find Food Near You
-              <ArrowRight className="ml-2 w-5 h-5" />
-            </Link>
-            <Link
-              to="/register"
-              className="border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors inline-flex items-center justify-center"
-            >
-              Join as Donor
-            </Link>
+          
+          <div className="flex flex-col sm:flex-row gap-4 justify-center">
+            {user ? (
+              <>
+                <Link to="/browse">
+                  <Button size="lg">
+                    <Search className="w-5 h-5 mr-2" />
+                    Browse Available Food
+                  </Button>
+                </Link>
+                {user.role === 'business_donor' && (
+                  <Link to="/create-listing">
+                    <Button variant="outline" size="lg">
+                      <Plus className="w-5 h-5 mr-2" />
+                      Share Food
+                    </Button>
+                  </Link>
+                )}
+              </>
+            ) : (
+              <>
+                <Link to="/browse">
+                  <Button size="lg">
+                    Find Food Near You
+                    <ArrowRight className="ml-2 w-5 h-5" />
+                  </Button>
+                </Link>
+                <Link to="/register">
+                  <Button variant="outline" size="lg">
+                    Join as Donor
+                  </Button>
+                </Link>
+              </>
+            )}
           </div>
         </div>
       </div>
@@ .. @@
           </div>
         </div>
       </div>
+
+      {/* Call to Action */}
+      {!user && (
+        <div className="bg-emerald-50 rounded-2xl p-12 text-center">
+          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
+          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
+            Join thousands of people already using VSIC to share food and build stronger communities.
+          </p>
+          <div className="flex flex-col sm:flex-row gap-4 justify-center">
+            <Link to="/register">
+              <Button size="lg">
+                Get Started Today
+                <ArrowRight className="ml-2 w-5 h-5" />
+              </Button>
+            </Link>
+            <Link to="/browse">
+              <Button variant="outline" size="lg">
+                Browse Available Food
+              </Button>
+            </Link>
+          </div>
+        </div>
+      )}
     </div>
   );