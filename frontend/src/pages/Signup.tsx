import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation rules
const passwordRules = [
  { key: 'minLength', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { key: 'uppercase', label: 'One uppercase letter (A-Z)', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'One lowercase letter (a-z)', test: (p: string) => /[a-z]/.test(p) },
  { key: 'special', label: 'One special character (!@#$%^&*)', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password validation status
  const passwordValidation = useMemo(() => {
    return passwordRules.map((rule) => ({
      ...rule,
      passed: rule.test(password),
    }));
  }, [password]);

  const isPasswordValid = passwordValidation.every((rule) => rule.passed);

  // Check if passwords match (only when confirmPassword has value)
  const passwordsMatch = confirmPassword === '' || password === confirmPassword;
  const showPasswordMismatch = confirmPassword !== '' && password !== confirmPassword;

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First name is required';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Last name is required';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!isValidEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field !== 'password' && field !== 'confirmPassword') {
      validateField(field, field === 'firstName' ? firstName : field === 'lastName' ? lastName : email);
    }
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!isPasswordValid) {
      newErrors.password = 'Password does not meet requirements';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setIsLoading(true);
    const result = await signup(firstName, lastName, email, password);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Account created!',
        description: result.message,
      });
      navigate('/login');
    } else {
      toast({
        title: 'Signup failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">MaintainX</h1>
          <p className="text-lg text-white/80">
            Join thousands of teams managing their equipment efficiently.
          </p>
          <div className="mt-12 space-y-4 text-left">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span>Track all your equipment in one place</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span>Manage maintenance requests easily</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span>Collaborate with your team seamlessly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">MaintainX</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Create an account</h2>
            <p className="text-muted-foreground mt-2">
              Get started with MaintainX today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    className={cn(
                      'pl-10',
                      touched.firstName && errors.firstName && 'border-destructive focus-visible:ring-destructive'
                    )}
                  />
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  className={cn(
                    touched.lastName && errors.lastName && 'border-destructive focus-visible:ring-destructive'
                  )}
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={cn(
                    'pl-10',
                    touched.email && errors.email && 'border-destructive focus-visible:ring-destructive'
                  )}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={cn(
                    'pl-10 pr-10',
                    touched.password && !isPasswordValid && 'border-destructive focus-visible:ring-destructive'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              {password && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg space-y-1.5">
                  {passwordValidation.map((rule) => (
                    <div
                      key={rule.key}
                      className={cn(
                        'flex items-center gap-2 text-xs transition-colors',
                        rule.passed ? 'text-green-600' : 'text-muted-foreground'
                      )}
                    >
                      {rule.passed ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={cn(
                    'pl-10',
                    showPasswordMismatch && 'border-destructive focus-visible:ring-destructive'
                  )}
                />
                {/* Real-time match indicator */}
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {/* Instant password mismatch error */}
              {showPasswordMismatch && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="w-3.5 h-3.5" />
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                className="rounded border-border mt-1"
                required
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || showPasswordMismatch || (password !== '' && !isPasswordValid)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
