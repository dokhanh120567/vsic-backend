@@ .. @@
 import { useNavigate, Link } from 'react-router-dom';
 import { z } from 'zod';
 import { authService } from '../../lib/auth';
 import { useAuth } from '../../hooks/useAuth';
+import { Button } from '../../components/UI/Button';
+import { Input } from '../../components/UI/Input';
 
 const loginSchema = z.object({
@@ .. @@
   const navigate = useNavigate();
   const { login } = useAuth();
 
-  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
+  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginData>({
     resolver: zodResolver(loginSchema)
   });
@@ .. @@
       const response = await authService.login(data.email, data.password);
       login(response.user, response.access_token);
       navigate('/dashboard');
     } catch (error) {
-      console.error('Login failed:', error);
+      setError('root', { message: 'Invalid email or password' });
     } finally {
       setLoading(false);
     }
@@ .. @@
         <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Welcome Back</h2>
         
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
+          {errors.root && (
+            <div className="bg-red-50 border border-red-200 rounded-md p-3">
+              <p className="text-red-600 text-sm">{errors.root.message}</p>
+            </div>
+          )}
+
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
-              placeholder="Your password"
-            />
-            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
-          </div>
+          <Input
+            label="Password"
+            type="password"
+            placeholder="Your password"
+            error={errors.password?.message}
+            {...register('password')}
+          />
 
-          <button
+          <Button
             type="submit"
-            disabled={loading}
-            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
+            loading={loading}
+            className="w-full"
           >
-            {loading ? 'Signing in...' : 'Sign In'}
-          </button>
+            Sign In
+          </Button>
         </form>
 
         <div className="text-center mt-6">