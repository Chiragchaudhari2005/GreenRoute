import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  CalendarPlus,
  Clock,
  Calendar,
  Truck,
  Recycle,
  TreePine,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  XCircle,
  MapPin,
  ExternalLink,
  Weight,
} from 'lucide-react';

const ResidentDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/stats/summary'),
        api.get('/bookings/my'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
      }
    } catch (err) {
      showToast('Error loading dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    try {
      setCancelling(true);
      const res = await api.put(`/bookings/${selectedBooking._id}/cancel`, {
        reason: cancelReason || 'Cancelled by resident',
      });
      if (res.data.success) {
        showToast('Pickup booking cancelled successfully.', 'success');
        setCancelModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['Pending', 'Confirmed', 'In Progress'].includes(b.status);
    if (filter === 'completed') return b.status === 'Completed';
    if (filter === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  const upcomingBookings = bookings.filter((b) =>
    ['Pending', 'Confirmed', 'In Progress'].includes(b.status)
  );

  return (
    <div className="min-h-screen bg-brand-silver py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header / Welcome */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-shade3 uppercase tracking-wider bg-brand-tint5 px-2.5 py-0.5 rounded-full">
                Resident Portal
              </span>
              <span className="text-xs text-brand-grey font-medium">Zone: Central Metro</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-black">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-brand-grey max-w-xl">
              Track your scheduled waste pickups, view assigned eco-truck routes, and measure your household recycling offsets.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/schedule"
              className="btn-primary !py-3 !px-6 text-sm font-semibold shadow-md"
            >
              <CalendarPlus className="w-5 h-5 mr-1.5" />
              Schedule New Pickup
            </Link>
          </div>
        </div>

        {/* Sustainability & Pickup Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-tint5 text-brand-primary flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-black">
                {stats?.upcomingPickups ?? upcomingBookings.length}
              </div>
              <div className="text-xs text-brand-grey font-medium">Upcoming Pickups</div>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-tint5 text-brand-shade3 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-black">
                {stats?.completedPickups ?? 0}
              </div>
              <div className="text-xs text-brand-grey font-medium">Completed Pickups</div>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-tint5 text-brand-primary flex items-center justify-center flex-shrink-0">
              <Weight className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-black">
                {stats?.totalRecycledKg ?? 0} <span className="text-sm font-normal text-brand-grey">kg</span>
              </div>
              <div className="text-xs text-brand-grey font-medium">Diverted from Landfills</div>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-tint5 text-brand-shade2 flex items-center justify-center flex-shrink-0">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-black">
                {stats?.totalCarbonSavedKg ?? 0} <span className="text-sm font-normal text-brand-grey">kg</span>
              </div>
              <div className="text-xs text-brand-grey font-medium">CO₂ Emissions Saved</div>
            </div>
          </div>
        </div>

        {/* Section: Next Upcoming Pickups */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-black flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-primary" />
              Active Upcoming Pickups
            </h2>
            <Link
              to="/schedule"
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
            >
              Book another slot <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="card text-center py-12">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
              <p className="text-sm text-brand-grey">Loading your scheduled pickups...</p>
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="card text-center py-12 border-dashed border-2">
              <div className="w-14 h-14 rounded-full bg-brand-tint5 text-brand-primary flex items-center justify-center mx-auto mb-3">
                <Recycle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-brand-black">No upcoming pickups scheduled</h3>
              <p className="text-xs text-brand-grey max-w-sm mx-auto mt-1 mb-4">
                Keep your home clean and green. Book an eco-truck collection date and time slot in under a minute!
              </p>
              <Link to="/schedule" className="btn-primary text-sm">
                Schedule a Pickup
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.map((b) => (
                <div key={b._id} className="card relative flex flex-col justify-between border-brand-primary/20 hover:border-brand-primary">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-brand-grey uppercase tracking-wider block">
                          {b.bookingId}
                        </span>
                        <h3 className="text-base font-bold text-brand-black">{b.wasteType}</h3>
                      </div>
                      <Badge status={b.status} />
                    </div>

                    <div className="space-y-2 py-3 border-y border-gray-100 text-xs text-brand-dGrey">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-primary flex-shrink-0" />
                        <span className="font-semibold text-brand-black">{b.slot?.date || 'Scheduled Date'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-grey flex-shrink-0" />
                        <span>{b.slot?.label || `${b.slot?.startTime} - ${b.slot?.endTime}`}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-brand-info flex-shrink-0" />
                        <span>{b.assignedCollector}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-brand-grey flex-shrink-0 mt-0.5" />
                        <span className="truncate">
                          {b.address?.street}, {b.address?.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                    <Link
                      to={`/booking/${b._id}`}
                      className="text-xs font-semibold text-brand-primary hover:text-brand-shade2 flex items-center gap-1"
                    >
                      View Details <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {['Pending', 'Confirmed'].includes(b.status) && (
                      <button
                        onClick={() => handleOpenCancelModal(b)}
                        className="text-xs font-medium text-brand-error hover:bg-red-50 px-2.5 py-1 rounded transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Booking History & All Pickups */}
        <div className="card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-brand-black">All Bookings & History</h2>
              <p className="text-xs text-brand-grey">
                Complete record of your doorstep waste pickup requests
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-brand-silver p-1 rounded-lg border border-gray-200">
              {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition ${
                    filter === tab
                      ? 'bg-white text-brand-black shadow-sm'
                      : 'text-brand-grey hover:text-brand-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-sm text-brand-grey">
              No bookings found under this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-brand-silver/60 text-brand-dGrey uppercase font-semibold">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Waste Type</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Est. Weight</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Eco Offset</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-brand-silver/40 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-brand-black">
                        {b.bookingId}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-brand-black">
                        {b.wasteType}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-brand-black">{b.slot?.date}</div>
                        <div className="text-[11px] text-brand-grey">{b.slot?.label || b.slot?.startTime}</div>
                      </td>
                      <td className="py-3.5 px-4 text-brand-dGrey">
                        {b.estimatedWeightKg} kg
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={b.status} />
                      </td>
                      <td className="py-3.5 px-4 text-brand-shade3 font-semibold">
                        +{b.carbonSavedKg || 0} kg CO₂
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            to={`/booking/${b._id}`}
                            className="font-semibold text-brand-primary hover:underline"
                          >
                            Details
                          </Link>
                          {['Pending', 'Confirmed'].includes(b.status) && (
                            <button
                              onClick={() => handleOpenCancelModal(b)}
                              className="text-brand-error hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Scheduled Pickup"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-brand-error flex-shrink-0" />
            <div>
              <span className="font-bold block">Are you sure you want to cancel this booking?</span>
              Cancelling booking <strong>{selectedBooking?.bookingId}</strong> will release the assigned slot on our collection truck for other neighbors.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1.5">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Need to reschedule for next week or bins are not yet full..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="btn-ghost text-xs"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="btn-danger text-xs !py-2"
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Cancelling...
                </>
              ) : (
                'Confirm Cancellation'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResidentDashboard;
