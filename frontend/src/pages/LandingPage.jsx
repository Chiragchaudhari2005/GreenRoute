import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Truck,
  Recycle,
  Users,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Sparkles,
  TreePine,
  Factory,
  Building2,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section (matching Screenshot 1) */}
      <section className="bg-brand-silver py-16 lg:py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint5 border border-brand-tint3 text-xs font-semibold text-brand-shade3">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                Zero-Waste Community Scheduling
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] lg:leading-[64px] font-bold text-brand-black tracking-tight">
                Lessons and insights{' '}
                <span className="text-brand-primary block mt-1">from 8 years</span>
                <span className="text-2xl sm:text-3xl lg:text-4xl text-brand-dGrey font-medium block mt-2">
                  of smart community waste pickups
                </span>
              </h1>
              <p className="text-base sm:text-lg text-brand-grey max-w-xl leading-relaxed">
                Where to schedule doorstep recyclable collection, prevent overbooking with live capacity tracking, and monitor verified carbon offsets.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {isAuthenticated ? (
                  <Link
                    to={isAdmin ? '/admin' : '/dashboard'}
                    className="btn-primary text-base !py-3 !px-8 shadow-md"
                  >
                    Go to {isAdmin ? 'Admin Console' : 'My Dashboard'}
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary text-base !py-3 !px-8 shadow-md"
                    >
                      Register
                    </Link>
                    <Link
                      to="/login"
                      className="btn-secondary text-base !py-3 !px-6 bg-white"
                    >
                      Login to Schedule
                    </Link>
                  </>
                )}
              </div>

              {/* Slider dots (matching screenshot) */}
              <div className="flex items-center gap-2 pt-6">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
                <span className="w-2 h-2 rounded-full bg-brand-greyBlue/50"></span>
                <span className="w-2 h-2 rounded-full bg-brand-greyBlue/50"></span>
              </div>
            </div>

            {/* Right Column: Hero Graphic Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* SVG Illustration matching tech/eco graphic from Nexcent screenshot */}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-tint4/40 relative z-10">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs font-semibold text-brand-shade3 bg-brand-tint5 px-2 py-0.5 rounded">
                      Live Dispatch Hub
                    </span>
                  </div>

                  <div className="pt-4 space-y-4">
                    {/* Simulated truck monitor */}
                    <div className="bg-brand-silver rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-brand-black">Truck #4 — Greenfield</div>
                          <div className="text-xs text-brand-grey">Scheduled: 08:00 AM - 10:00 AM</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-primary bg-brand-tint5 px-2 py-1 rounded-full">
                        En Route
                      </span>
                    </div>

                    {/* Capacity bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-brand-dGrey">Pickup Slot Capacity</span>
                        <span className="text-brand-shade3 font-bold">4 / 6 Booked (2 Free)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary rounded-full" style={{ width: '66%' }}></div>
                      </div>
                    </div>

                    {/* Quick booking card */}
                    <div className="border border-brand-tint3/50 bg-brand-tint5/40 rounded-lg p-3 text-xs flex items-center gap-3">
                      <Recycle className="w-6 h-6 text-brand-primary flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-brand-black block">Overbooking Protection Active</span>
                        <span className="text-brand-grey">Atomic locks ensure zero double-booking on trucks.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative floating eco badge */}
                <div className="absolute -bottom-6 -left-6 bg-brand-black text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 z-20">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Carbon Diverted</div>
                    <div className="text-sm font-bold text-white">1,926 Tons CO₂</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Clients / Partners Ticker */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-brand-black">Our Clients</h2>
          <p className="text-sm text-brand-grey mt-1">
            We have been working with some Fortune 500+ clients & 500+ sustainable communities
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 font-bold text-lg text-brand-dGrey">
              <Building2 className="w-6 h-6 text-brand-primary" /> MetroClean
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-brand-dGrey">
              <Factory className="w-6 h-6 text-brand-primary" /> EcoLogix
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-brand-dGrey">
              <TreePine className="w-6 h-6 text-brand-primary" /> Evergreen Estates
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-brand-dGrey">
              <Recycle className="w-6 h-6 text-brand-primary" /> BioLoop City
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-brand-dGrey">
              <Users className="w-6 h-6 text-brand-primary" /> GreenCivic Alliance
            </div>
          </div>
        </div>
      </section>

      {/* 3. Manage your entire community in a single system */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-brand-black">
              Manage your entire community <br /> in a single system
            </h2>
            <p className="text-sm sm:text-base text-brand-grey">
              Who is GreenRoute suitable for? Tailored waste segregation workflows for all.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card text-center flex flex-col items-center p-8 hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 rounded-full bg-brand-tint5 text-brand-primary flex items-center justify-center mb-5">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-3">
                Membership Organisations
              </h3>
              <p className="text-sm text-brand-grey leading-relaxed">
                Our membership management software provides full automation of pickup renewals, community compost scheduling, and residential recycling tracking.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card text-center flex flex-col items-center p-8 hover:-translate-y-1 transition-all border-brand-primary/20 shadow-cardHover">
              <div className="w-16 h-16 rounded-full bg-brand-tint5 text-brand-primary flex items-center justify-center mb-5">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-3">
                National Associations
              </h3>
              <p className="text-sm text-brand-grey leading-relaxed">
                Streamline operations across multiple municipal districts with automated capacity limits, zone-based truck routing, and certified disposal reports.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card text-center flex flex-col items-center p-8 hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 rounded-full bg-brand-tint5 text-brand-primary flex items-center justify-center mb-5">
                <TreePine className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-3">
                Clubs And Groups
              </h3>
              <p className="text-sm text-brand-grey leading-relaxed">
                Empower neighborhood societies and green councils with intuitive booking portals, e-waste drives, and collective carbon offset milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Showcase Section 1: "The unseen of spending three years at GreenRoute" */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              {/* Illustration placeholder */}
              <div className="bg-brand-silver p-8 rounded-2xl border border-gray-100 w-full max-w-md shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center">
                    <Recycle className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-brand-black">Verified Zero-Waste Protocols</h4>
                  <p className="text-xs text-brand-grey leading-relaxed">
                    Every bag collected is categorized, weighted, and tracked directly to local circular reclamation plants.
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-brand-dGrey font-medium">
                      <CheckCircle className="w-4 h-4 text-brand-primary" /> Recyclables sorting: 99.2% purity
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-dGrey font-medium">
                      <CheckCircle className="w-4 h-4 text-brand-primary" /> E-waste hazardous prevention
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-dGrey font-medium">
                      <CheckCircle className="w-4 h-4 text-brand-primary" /> Compost returned to community parks
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl font-bold text-brand-black tracking-tight">
                The unseen of spending three years <br className="hidden sm:inline" />
                at GreenRoute
              </h2>
              <p className="text-sm sm:text-base text-brand-grey leading-relaxed">
                Traditional waste collection is plagued with missed pickups, overfilled trucks, and zero transparency for residents. GreenRoute solves this through smart capacity slot reservation, letting municipal trucks operate at peak logistics efficiency without overbooking.
              </p>
              <div>
                <Link to="/register" className="btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Helping Critical Communities Stats Banner (matching Screenshot 1) */}
      <section id="impact" className="py-16 bg-brand-silver">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left title */}
            <div className="lg:col-span-5 space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-black leading-tight">
                Helping critical <br />
                <span className="text-brand-primary">communities reinvent clean!</span>
              </h2>
              <p className="text-sm text-brand-grey">
                We reached here with our hard work and community dedication
              </p>
            </div>

            {/* Right stats 2x2 grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Stat 1 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-tint5 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-black">2,245,341</div>
                  <div className="text-xs sm:text-sm text-brand-grey font-medium">Residents Served</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-tint5 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-black">46,328</div>
                  <div className="text-xs sm:text-sm text-brand-grey font-medium">Tons Recycled</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-tint5 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-black">828,867</div>
                  <div className="text-xs sm:text-sm text-brand-grey font-medium">Bookings Completed</div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-tint5 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <TreePine className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-black">1,926,436</div>
                  <div className="text-xs sm:text-sm text-brand-grey font-medium">kg CO₂ Prevented</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Showcase Section 2: How to schedule your site faster */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Mobile Mockup style */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-cardHover border-4 border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-brand-primary">Schedule Pickup</span>
                  <span className="text-[10px] text-gray-400">Step 2 of 3</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-brand-primary bg-brand-tint5 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-brand-black">08:00 AM - 10:00 AM</div>
                      <div className="text-[10px] text-brand-shade3">Central Metro Zone</div>
                    </div>
                    <span className="text-[10px] font-bold bg-white text-brand-primary px-2 py-0.5 rounded shadow-sm">
                      Available
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-brand-black">10:30 AM - 12:30 PM</div>
                      <div className="text-[10px] text-gray-500">North Hills District</div>
                    </div>
                    <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                      2 slots left
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-100 bg-gray-50 flex justify-between items-center opacity-60">
                    <div>
                      <div className="text-xs font-bold text-gray-500">01:30 PM - 03:30 PM</div>
                      <div className="text-[10px] text-gray-400">Fully Booked</div>
                    </div>
                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                      Full
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold text-center rounded-lg">
                    Confirm Pickup Details
                  </div>
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl font-bold text-brand-black tracking-tight">
                How to schedule your waste pickup <br />
                faster with GreenRoute
              </h2>
              <p className="text-sm sm:text-base text-brand-grey leading-relaxed">
                Gone are the days of guessing when collection trucks arrive or missing the weekly recycling window. Our interactive calendar shows open slots with live capacity, preventing truck overload and providing timely updates right to your doorstep.
              </p>
              <div>
                <Link to={isAuthenticated ? '/schedule' : '/register'} className="btn-primary">
                  Book a Slot Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Caring is the new marketing (Eco Guides Trio from Screenshot 1) */}
      <section className="py-20 bg-brand-silver">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl font-bold text-brand-black">
              Caring for our planet is the new culture
            </h2>
            <p className="text-sm sm:text-base text-brand-grey">
              The GreenRoute blog is the best place to read about the latest community sustainability insights, recycling tips, and environmental impact studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guide 1 */}
            <div className="relative group">
              <div className="h-52 rounded-xl bg-gradient-to-tr from-brand-shade3 to-brand-tint1 flex items-center justify-center p-6 text-white text-center">
                <Recycle className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="bg-white rounded-xl shadow-card p-6 mx-4 -mt-12 relative z-10 text-center space-y-4">
                <h4 className="text-sm sm:text-base font-bold text-brand-dGrey group-hover:text-brand-primary transition">
                  Creating streamlined household waste segregation habits that last
                </h4>
                <div>
                  <Link
                    to="/register"
                    className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-shade2"
                  >
                    Readmore <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Guide 2 */}
            <div className="relative group">
              <div className="h-52 rounded-xl bg-gradient-to-tr from-brand-black to-brand-shade4 flex items-center justify-center p-6 text-white text-center">
                <Factory className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="bg-white rounded-xl shadow-card p-6 mx-4 -mt-12 relative z-10 text-center space-y-4">
                <h4 className="text-sm sm:text-base font-bold text-brand-dGrey group-hover:text-brand-primary transition">
                  What are your responsibilities for safe residential e-waste recovery?
                </h4>
                <div>
                  <Link
                    to="/register"
                    className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-shade2"
                  >
                    Readmore <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Guide 3 */}
            <div className="relative group">
              <div className="h-52 rounded-xl bg-gradient-to-tr from-brand-shade2 to-emerald-400 flex items-center justify-center p-6 text-white text-center">
                <TreePine className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="bg-white rounded-xl shadow-card p-6 mx-4 -mt-12 relative z-10 text-center space-y-4">
                <h4 className="text-sm sm:text-base font-bold text-brand-dGrey group-hover:text-brand-primary transition">
                  Revamping community compost drives for organic gardens and parks
                </h4>
                <div>
                  <Link
                    to="/register"
                    className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-shade2"
                  >
                    Readmore <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner (matching bottom of Screenshot 1) */}
      <section className="py-16 bg-brand-silver text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-brand-black leading-tight">
            Ready to bring modern zero-waste scheduling <br />
            to your community?
          </h2>
          <div>
            <Link
              to={isAuthenticated ? '/schedule' : '/register'}
              className="btn-primary text-base !py-3.5 !px-8 shadow-md"
            >
              Get Started with GreenRoute
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
