@@ .. @@
 import React from 'react';
 import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 import { Layout } from './components/Layout/Layout';
 import { Home } from './pages/Home';
 import { Login } from './pages/Auth/Login';
 import { Register } from './pages/Auth/Register';
 import { BrowseListings } from './pages/Listings/BrowseListings';
 import { CreateListing } from './pages/Listings/CreateListing';
+import { Dashboard } from './pages/Dashboard/Dashboard';
 import { useAuth } from './hooks/useAuth';
 
 const queryClient = new QueryClient({
@@ .. @@
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/browse" element={<BrowseListings />} />
+          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
           <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
         </Routes>
       </Layout>