import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Send, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    showToast('Thank you for subscribing to GreenRoute updates!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-brand-black text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-gray-700/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Leaf className="w-6 h-6 transform -rotate-12" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Green<span className="text-brand-primary">Route</span>
              </span>
            </Link>
            <p className="text-sm text-brand-greyBlue max-w-sm leading-relaxed">
              Leading the transition towards sustainable zero-waste communities. Reliable doorstep waste segregation, transparent pickup scheduling, and verified carbon reclamation.
            </p>
            <div className="text-xs text-brand-lGrey">
              Copyright © 2026 GreenRoute Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#social"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center text-white transition duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center text-white transition duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center text-white transition duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center text-white transition duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links 1: Company */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white tracking-wide">Company</h4>
            <ul className="space-y-2.5 text-sm text-brand-greyBlue">
              <li>
                <a href="#about" className="hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition">Eco Blog & Insights</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">Contact Support</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">Pricing & Tiers</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition">Community Stories</a>
              </li>
            </ul>
          </div>

          {/* Quick Links 2: Support */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white tracking-wide">Support</h4>
            <ul className="space-y-2.5 text-sm text-brand-greyBlue">
              <li>
                <a href="#help" className="hover:text-white transition">Help Center</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition">Terms of Service</a>
              </li>
              <li>
                <a href="#legal" className="hover:text-white transition">Legal & Compliance</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="/api/health" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                  System Health Check
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Stay up to date */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white tracking-wide">Stay up to date</h4>
            <p className="text-xs text-brand-greyBlue leading-relaxed">
              Get monthly recycling tips, scheduled bulk pickup announcements, and sustainability updates.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/15 text-white placeholder-gray-400 text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary border border-transparent transition"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white p-1 transition"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-lGrey gap-4">
          <div>Built with React, Vite, Tailwind CSS, Express, and MongoDB. DevOps Ready.</div>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white">Privacy</a>
            <a href="#terms" className="hover:text-white">Terms</a>
            <a href="#security" className="hover:text-white">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
