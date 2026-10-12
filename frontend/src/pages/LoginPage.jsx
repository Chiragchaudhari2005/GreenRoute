import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Leaf, Lock, Mail, ArrowRight, Loader2, ShieldCheck, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please provide both email and password.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Login failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      setSubmitting(true);
      const user = await login(demoEmail, demoPassword);
      showToast(`Logged in as ${user.name} (${user.role})!`, 'success');
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Demo login failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-silver">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-card border border-gray-100">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-tint5 text-brand-primary flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-brand-black tracking-tight">
            Sign in to GreenRoute
          </h2>
          <p className="text-sm text-brand-grey">
            Access your residential pickup dashboard or admin portal
          </p>
        </div>

        {/* Demo Login Buttons */}
        <div className="bg-brand-tint5/60 border border-brand-tint3/50 rounded-xl p-4 space-y-2.5">
          <div className="text-xs font-bold text-brand-shade3 uppercase tracking-wider">
            Quick One-Click Demo Access:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('resident@greenroute.com', 'resident123')}
              className="py-2 px-3 bg-white text-brand-black hover:border-brand-primary border border-gray-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-primary" />
              Resident Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@greenroute.com', 'admin123')}
              className="py-2 px-3 bg-brand-black text-white hover:bg-black rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-tint2" />
              Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@community.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" className="text-xs font-medium text-brand-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full !py-3 font-semibold text-sm shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-brand-grey pt-2 border-t border-gray-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
