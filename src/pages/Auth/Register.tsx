@@ .. @@
 import { useNavigate, Link } from 'react-router-dom';
 import { z } from 'zod';
 import { authService } from '../../lib/auth';
 import { useAuth } from '../../hooks/useAuth';
+import { Button } from '../../components/UI/Button';
+import { Input } from '../../components/UI/Input';
+import { Select } from '../../components/UI/Select';
 
 const registerSchema = z.object({
@@ .. @@
   const navigate = useNavigate();
   const { login } = useAuth();
 
-  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
+  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterData>({
     resolver: zodResolver(registerSchema)
   });
@@ .. @@
       const response = await authService.register(data);
       login(response.user, response.access_token);
       navigate('/dashboard');
     } catch (error) {
-      console.error('Registration failed:', error);
+      setError('root', { message: 'Registration failed. Please try again.' });
     } finally {
       setLoading(false);
     }
   };

+  const roleOptions = [
+    { value: '', label: 'Select your role' },
+    { value: 'business_donor', label: 'Business/Restaurant (Donate Food)' },
+    { value: 'individual_recipient', label: 'Individual (Receive Food)' },
+    { value: 'volunteer', label: 'Volunteer (Help with Delivery)' }
+  ];
+
   return (
     <div className="max-w-md mx-auto">
       <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
         <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Join VSIC</h2>
         
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
-          <div>
-            <label className="block text-sm font-medium text-gray-700 mb-2">
-              Full Name
-            </label>
-            <input
-              {...register('full_name')}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-              placeholder="Your full name"
-            />
-            {errors.full_name && <p className="text-red-600 text-sm mt-1">{errors.full_name.message}</p>}
-          </div>
+          {errors.root && (
+            <div className="bg-red-50 border border-red-200 rounded-md p-3">
+              <p className="text-red-600 text-sm">{errors.root.message}</p>
+            </div>
+          )}
+
+          <Input
+            label="Full Name"
+            placeholder="Your full name"
+            error={errors.full_name?.message}
+            {...register('full_name')}
+          />
 
-          <div>
-            <label className="block text-sm font-medium text-gray-700 mb-2">
-              Email
-            </label>
-            <input
-              type="email"
-              {...register('email')}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-              placeholder="your@email.com"
-            />
-            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
-          </div>
+          <Input
+            label="Email"
+            type="email"
+            placeholder="your@email.com"
+            error={errors.email?.message}
+            {...register('email')}
+          />
 
-          <div>
-            <label className="block text-sm font-medium text-gray-700 mb-2">
-              Password
-            </label>
-            <input
-              type="password"
-              {...register('password')}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-              placeholder="Create a password"
-            />
-            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
-          </div>
+          <Input
+            label="Password"
+            type="password"
+            placeholder="Create a password"
+            error={errors.password?.message}
+            {...register('password')}
+          />
 
-          <div>
-            <label className="block text-sm font-medium text-gray-700 mb-2">
-              Phone Number
-            </label>
-            <input
-              type="tel"
-              {...register('phone_number')}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-              placeholder="Your phone number"
-            />
-            {errors.phone_number && <p className="text-red-600 text-sm mt-1">{errors.phone_number.message}</p>}
-          </div>
+          <Input
+            label="Phone Number"
+            type="tel"
+            placeholder="Your phone number"
+            error={errors.phone_number?.message}
+            {...register('phone_number')}
+          />
 
-          <div>
-            <label className="block text-sm font-medium text-gray-700 mb-2">
-              Role
-            </label>
-            <select
-              {...register('role')}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
-            >
-              <option value="">Select your role</option>
-              <option value="business_donor">Business/Restaurant (Donate Food)</option>
-              <option value="individual_recipient">Individual (Receive Food)</option>
-              <option value="volunteer">Volunteer (Help with Delivery)</option>
-            </select>
-            {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
-          </div>
+          <Select
+            label="Role"
+            options={roleOptions}
+            error={errors.role?.message}
+            {...register('role')}
+          />
 
-          <button
+          <Button
             type="submit"
-            disabled={loading}
-            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
+            loading={loading}
+            className="w-full"
           >
-            {loading ? 'Creating account...' : 'Create Account'}
-          </button>
+            Create Account
+          </Button>
         </form>
 
         <div className="text-center mt-6">