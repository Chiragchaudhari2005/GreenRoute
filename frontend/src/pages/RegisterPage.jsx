import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Leaf, Lock, Mail, User, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'resident',
    street: '',
    city: 'Greenville',
    zipCode: '94016',
  });
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please provide your name, email, and password.', 'warning');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        address: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode,
        },
      });

      showToast(`Welcome to GreenRoute, ${user.name}! Account registered.`, 'success');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Registration failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-silver">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-2xl shadow-card border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-tint5 text-brand-primary flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-brand-black tracking-tight">
            Create your GreenRoute Account
          </h2>
          <p className="text-sm text-brand-grey">
            Join 2+ million community residents scheduling verified eco pickups
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jordan Miller"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jordan@eco.org"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                Password * (min 6 chars)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 012-3456"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <span className="text-xs font-bold text-brand-dGrey uppercase tracking-wider block mb-2">
              Default Residential Pickup Address
            </span>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street Address (e.g. 742 Evergreen Terrace)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Zip Code"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
              Account Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            >
              <option value="resident">Resident / Household Member</option>
              <option value="admin">Admin / Municipal Coordinator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full !py-3 font-semibold text-sm shadow-md mt-4"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Registering...
              </>
            ) : (
              <>
                Complete Registration
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-brand-grey pt-2 border-t border-gray-100">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-primary hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
