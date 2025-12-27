import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  teamId?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    // Email validation
    if (!isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    if (!password) {
      return { success: false, message: 'Password is required' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Check for success - API returns { success: true, data: { user_id, username, email, user_type }, tokens: { access, refresh } }
      if ((response.ok && data.success) || data.success) {
        const userInfo = data.data || {};
        const userData: User = {
          id: userInfo.user_id?.toString() || '',
          name: userInfo.username || email.split('@')[0],
          email: userInfo.email || email,
          role: userInfo.user_type || 'user',
          avatar: (userInfo.username || email.split('@')[0])
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store tokens
        if (data.tokens) {
          localStorage.setItem('token', data.tokens.access || '');
          localStorage.setItem('refreshToken', data.tokens.refresh || '');
        }

        return {
          success: true,
          message: data.message || 'Login successful',
          user: userData,
        };
      }

      return {
        success: false,
        message: data.message || 'Login failed. Please try again.',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    // Validations
    if (!firstName.trim()) {
      return { success: false, message: 'First name is required' };
    }

    if (!lastName.trim()) {
      return { success: false, message: 'Last name is required' };
    }

    if (!isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters',
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        }),
      });

      const data = await response.json();

      // Check for success based on response.ok OR data.success flag
      if (response.ok || data.success) {
        // Registration successful - redirect to login (no auto-login since no user/token returned)
        return {
          success: true,
          message: data.message || 'Account created successfully. Please login.',
        };
      }

      // Handle validation errors from Django serializer
      if (data && typeof data === 'object' && !data.message) {
        // Django serializer returns errors as { field: [errors] }
        const errorMessages = Object.entries(data)
          .map(([field, errors]) => {
            if (Array.isArray(errors)) {
              return `${field}: ${errors.join(', ')}`;
            }
            return `${field}: ${errors}`;
          })
          .join('. ');
        return {
          success: false,
          message: errorMessages || 'Signup failed. Please try again.',
        };
      }

      return {
        success: false,
        message: data.message || 'Signup failed. Please try again.',
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
