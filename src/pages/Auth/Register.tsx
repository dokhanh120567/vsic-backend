import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { authService } from '../../lib/auth';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';

const registerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone_number: z.string().min(1, 'Phone number is required'),
  role: z.enum(['business_donor', 'individual_recipient', 'volunteer'], {
    required_error: 'Please select a role'
  })
});

type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      login(response.user, response.access_token);
      navigate('/dashboard');
    } catch (error) {
      setError('root', { message: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: '', label: 'Select your role' },
    { value: 'business_donor', label: 'Business/Restaurant (Donate Food)' },
    { value: 'individual_recipient', label: 'Individual (Receive Food)' },
    { value: 'volunteer', label: 'Volunteer (Help with Delivery)' }
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Join VSIC</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{errors.root.message}</p>
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="Your full name"
            error={errors.full_name?.message}
            {...register('full_name')}
          />

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
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Your phone number"
            error={errors.phone_number?.message}
            {...register('phone_number')}
          />

          <Select
            label="Role"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role')}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}