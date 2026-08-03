import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      // Backend returns: { token, userId, username, email, role, type }
      const user = {
        userId: response.userId,
        username: response.username,
        email: response.email,
        role: response.role,
      };
      
      loginUser(response.token, user);
      
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-steam-panel p-8 rounded-lg shadow-xl border border-steam-dark">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-steam-text-light uppercase tracking-wider">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-steam-text">
            to your PlayGrid account
          </p>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <Button type="submit" className="w-full text-lg py-3" isLoading={loading}>
              Sign In
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-steam-text">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-steam-accent hover:text-steam-light transition-colors">
              Join PlayGrid
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
