import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-tint5 text-brand-primary flex items-center justify-center mb-4">
        <Leaf className="w-8 h-8 transform rotate-45" />
      </div>
      <h1 className="text-4xl font-bold text-brand-black mb-2">404</h1>
      <h2 className="text-xl font-semibold text-brand-dGrey mb-4">Page Not Found</h2>
      <p className="text-sm text-brand-grey max-w-md mb-6">
        The page you are looking for does not exist or may have been relocated.
      </p>
      <Link to="/" className="btn-primary text-xs">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
