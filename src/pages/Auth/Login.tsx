import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
});

type LoginData = z.infer<typeof loginSchema>;

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setError('root', { message: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Welcome Back</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{errors.root.message}</p>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};