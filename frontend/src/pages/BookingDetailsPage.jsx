import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  Calendar,
  Clock,
  Truck,
  MapPin,
  Recycle,
  TreePine,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Share2,
  Printer,
  Download,
} from 'lucide-react';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.booking);
      }
    } catch (err) {
      showToast('Could not load booking details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      const res = await api.put(`/bookings/${id}/cancel`, {
        reason: cancelReason || 'Cancelled by resident',
      });
      if (res.data.success) {
        showToast('Booking cancelled.', 'success');
        setCancelModalOpen(false);
        fetchBooking();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Cancellation failed.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <span className="text-sm text-brand-grey font-medium">Loading pickup details...</span>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center p-4">
        <AlertCircle className="w-12 h-12 text-brand-error" />
        <h2 className="text-xl font-bold text-brand-black">Booking Not Found</h2>
        <p className="text-sm text-brand-grey">The requested pickup booking does not exist or has been removed.</p>
        <Link to="/dashboard" className="btn-primary text-xs">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const steps = ['Pending', 'Confirmed', 'In Progress', 'Completed'];
  const currentStepIndex = steps.indexOf(booking.status);
  const isCancelled = booking.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-brand-silver py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link
            to={user?.role === 'admin' ? '/admin' : '/dashboard'}
            className="inline-flex items-center text-xs font-semibold text-brand-dGrey hover:text-brand-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {user?.role === 'admin' ? 'Admin Management' : 'My Dashboard'}
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-brand-dGrey text-xs font-medium flex items-center gap-1 shadow-sm"
              title="Print Booking Manifest"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider block">
              Booking Ref: {booking.bookingId}
            </span>
            <h1 className="text-2xl font-bold text-brand-black">{booking.wasteType} Pickup</h1>
            <p className="text-xs text-brand-grey">
              Created on {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <Badge status={booking.status} className="text-sm py-1 px-3" />
            {['Pending', 'Confirmed'].includes(booking.status) && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="text-xs font-medium text-brand-error hover:underline"
              >
                Cancel this pickup
              </button>
            )}
          </div>
        </div>

        {/* Status Lifecycle Progress Tracker */}
        <div className="card space-y-6">
          <h2 className="text-sm font-bold text-brand-black uppercase tracking-wider">
            Live Dispatch Progress
          </h2>

          {isCancelled ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
              <AlertCircle className="w-5 h-5 text-brand-error flex-shrink-0" />
              <div>
                <span className="font-bold block">This pickup was cancelled.</span>
                Reason: {booking.cancellationReason || 'No reason specified'}.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={st} className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isPassed
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'bg-gray-100 text-brand-grey'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-2 ${
                        isCurrent
                          ? 'text-brand-primary font-bold'
                          : isPassed
                          ? 'text-brand-black'
                          : 'text-brand-grey'
                      }`}
                    >
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Two-Column Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Logistics */}
          <div className="card space-y-4">
            <h3 className="text-sm font-bold text-brand-black uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-primary" /> Logistics Information
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-brand-grey">Assigned Truck:</span>
                <span className="font-bold text-brand-black">{booking.assignedCollector}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-brand-grey">Scheduled Date:</span>
                <span className="font-bold text-brand-black">{booking.slot?.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-brand-grey">Time Slot:</span>
                <span className="font-bold text-brand-black">{booking.slot?.label || booking.slot?.startTime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-brand-grey">Collection District:</span>
                <span className="font-bold text-brand-black">{booking.slot?.zone || 'Central Metro'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-brand-grey">Estimated Waste Load:</span>
                <span className="font-bold text-brand-black">{booking.estimatedWeightKg} kg</span>
              </div>
            </div>
          </div>

          {/* Location & Instructions */}
          <div className="card space-y-4">
            <h3 className="text-sm font-bold text-brand-black uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-primary" /> Doorstep Location
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-brand-grey block mb-1">Street Address:</span>
                <span className="font-semibold text-brand-black text-sm block">
                  {booking.address?.street}
                </span>
                <span className="text-brand-grey block">
                  {booking.address?.city}, CA {booking.address?.zipCode}
                </span>
              </div>

              {booking.address?.landmark && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-brand-grey block mb-0.5">Special Instructions / Porch Landmark:</span>
                  <p className="text-brand-black italic">{booking.address.landmark}</p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <span className="text-brand-grey block mb-0.5">Resident Contact:</span>
                <p className="text-brand-black font-medium">
                  {booking.user?.name} ({booking.user?.email})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eco Offset Certificate Banner */}
        <div className="bg-gradient-to-r from-brand-tint5 via-emerald-50 to-white rounded-2xl p-6 border border-brand-tint3/50 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <TreePine className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-shade3 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-brand-tint3">
                Verified Ecological Certificate
              </span>
              <h4 className="text-lg font-bold text-brand-black mt-1">
                +{booking.carbonSavedKg || 0} kg CO₂ Emissions Prevented
              </h4>
              <p className="text-xs text-brand-grey">
                Circular diversion certified by GreenRoute municipal audit standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Cancellation"
      >
        <div className="space-y-4">
          <p className="text-xs text-brand-grey">
            Are you sure you want to cancel pickup <strong>{booking.bookingId}</strong>? The collection truck will bypass this address and the slot capacity will be made available to neighbors.
          </p>

          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1.5">
              Reason (Optional)
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict or cancelled project"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="btn-ghost text-xs"
            >
              Keep Pickup
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="btn-danger text-xs !py-2"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetailsPage;
