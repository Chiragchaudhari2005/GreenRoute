import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Recycle,
  Apple,
  Cpu,
  Trash2,
  AlertTriangle,
  Sofa,
  Calendar,
  Clock,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  TreePine,
  ShieldCheck,
  Info,
} from 'lucide-react';

const WASTE_CATEGORIES = [
  {
    id: 'Recyclables',
    name: 'Recyclables',
    desc: 'Paper, cardboard, clean plastics (PET/HDPE), aluminium cans, and glass jars.',
    icon: Recycle,
    color: 'text-brand-primary bg-brand-tint5 border-brand-tint3',
    factor: 1.8,
  },
  {
    id: 'Organic / Compost',
    name: 'Organic / Compost',
    desc: 'Fruit & vegetable peels, food scraps, yard clippings, and coffee grounds.',
    icon: Apple,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    factor: 1.2,
  },
  {
    id: 'Electronic Waste',
    name: 'Electronic Waste',
    desc: 'Laptops, mobile devices, batteries, cables, chargers, and small home appliances.',
    icon: Cpu,
    color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    factor: 2.5,
  },
  {
    id: 'General Waste',
    name: 'General Waste',
    desc: 'Non-recyclable household items, soiled wrappers, and landfill debris.',
    icon: Trash2,
    color: 'text-gray-700 bg-gray-50 border-gray-200',
    factor: 0.3,
  },
  {
    id: 'Hazardous Waste',
    name: 'Hazardous Waste',
    desc: 'Paints, solvents, household chemicals, fluorescent tubes, and motor oils.',
    icon: AlertTriangle,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    factor: 2.0,
  },
  {
    id: 'Bulk / Furniture',
    name: 'Bulk / Furniture',
    desc: 'Mattresses, chairs, broken cabinetry, and bulky wood products.',
    icon: Sofa,
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    factor: 1.0,
  },
];

const SchedulePickupPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedWasteType, setSelectedWasteType] = useState('Recyclables');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');

  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || 'Greenville',
    zipCode: user?.address?.zipCode || '94016',
    landmark: user?.address?.landmark || '',
    specialInstructions: '',
  });

  const [estimatedWeightKg, setEstimatedWeightKg] = useState(8);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setLoadingSlots(true);
        const res = await api.get('/slots/available');
        if (res.data.success) {
          setSlots(res.data.slots);
          if (res.data.slots.length > 0) {
            setSelectedDateFilter(res.data.slots[0].date);
          }
        }
      } catch (err) {
        showToast('Could not fetch available pickup slots.', 'error');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, []);

  // Unique dates from slots
  const uniqueDates = Array.from(new Set(slots.map((s) => s.date))).sort();

  // Slots for active date filter
  const displayedSlots = slots.filter((s) => s.date === selectedDateFilter);

  const selectedSlot = slots.find((s) => s._id === selectedSlotId);
  const selectedCategoryMeta = WASTE_CATEGORIES.find((c) => c.id === selectedWasteType);
  const estimatedCarbonSaved = Math.round(
    estimatedWeightKg * (selectedCategoryMeta?.factor || 1) * 10
  ) / 10;

  const handleNextStep = () => {
    if (step === 1 && !selectedWasteType) {
      showToast('Please select a waste stream category.', 'warning');
      return;
    }
    if (step === 2 && !selectedSlotId) {
      showToast('Please select an available collection time slot.', 'warning');
      return;
    }
    if (step === 3) {
      if (!address.street || !address.city || !address.zipCode) {
        showToast('Please complete street, city, and zip code.', 'warning');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleConfirmBooking = async () => {
    try {
      setSubmitting(true);
      const res = await api.post('/bookings', {
        slotId: selectedSlotId,
        wasteType: selectedWasteType,
        estimatedWeightKg: Number(estimatedWeightKg),
        address,
      });

      if (res.data.success) {
        showToast(res.data.message || 'Pickup scheduled successfully!', 'success');
        navigate(`/booking/${res.data.booking._id}`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to schedule pickup.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-silver py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Stepper Header */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-brand-shade3 uppercase tracking-wider bg-brand-tint5 px-2.5 py-0.5 rounded-full">
                Step {step} of 4
              </span>
              <h1 className="text-2xl font-bold text-brand-black mt-1">
                Schedule Doorstep Waste Pickup
              </h1>
            </div>
            <div className="text-xs text-brand-grey font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-primary" /> Overbooking Protection Guaranteed
            </div>
          </div>

          {/* Stepper Indicators */}
          <div className="grid grid-cols-4 gap-2 pt-6">
            {[
              { num: 1, label: 'Waste Type' },
              { num: 2, label: 'Date & Slot' },
              { num: 3, label: 'Address' },
              { num: 4, label: 'Confirm' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s.num
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-100 text-brand-grey'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 hidden sm:inline ${
                    step >= s.num ? 'text-brand-black' : 'text-brand-grey'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Select Waste Category */}
        {step === 1 && (
          <div className="card space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-brand-black">1. Choose Waste Stream</h2>
              <p className="text-xs text-brand-grey">
                Select the primary type of waste or recyclable items for collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WASTE_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedWasteType === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedWasteType(cat.id)}
                    className={`p-5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-brand-primary bg-brand-tint5/50 ring-2 ring-brand-primary shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
                    }`}
                  >
                    <div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${cat.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-brand-black mb-1">{cat.name}</h3>
                      <p className="text-xs text-brand-grey leading-relaxed">{cat.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-brand-shade3 font-semibold">
                      <span>Carbon factor: +{cat.factor}x</span>
                      {isSelected && <span className="text-brand-primary font-bold">Selected ✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button onClick={handleNextStep} className="btn-primary">
                Next: Select Date & Slot <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Date & Slot */}
        {step === 2 && (
          <div className="card space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-brand-black">2. Pick Collection Date & Time</h2>
              <p className="text-xs text-brand-grey">
                Slots with remaining truck capacity are shown below. Live reservation prevents overbooking.
              </p>
            </div>

            {loadingSlots ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
                <p className="text-sm text-brand-grey">Loading open collection slots...</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center text-amber-800 text-sm">
                No open collection slots available at the moment. Please check back shortly or contact administration.
              </div>
            ) : (
              <div className="space-y-5">
                {/* Date Pills */}
                <div>
                  <span className="text-xs font-semibold text-brand-dGrey uppercase tracking-wider block mb-2">
                    Available Dates:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {uniqueDates.map((dateStr) => {
                      const isSelected = selectedDateFilter === dateStr;
                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => {
                            setSelectedDateFilter(dateStr);
                            setSelectedSlotId('');
                          }}
                          className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                            isSelected
                              ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                              : 'bg-white text-brand-black border-gray-200 hover:border-brand-primary'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                          {dateStr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots Grid for Selected Date */}
                <div>
                  <span className="text-xs font-semibold text-brand-dGrey uppercase tracking-wider block mb-2">
                    Time Windows for {selectedDateFilter}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayedSlots.map((slot) => {
                      const isSelected = selectedSlotId === slot._id;
                      const remaining = slot.remainingCapacity ?? Math.max(0, slot.maxCapacity - slot.bookedCount);
                      const isFull = remaining <= 0;

                      return (
                        <button
                          key={slot._id}
                          type="button"
                          disabled={isFull}
                          onClick={() => setSelectedSlotId(slot._id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            isFull
                              ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-brand-tint5/60 border-brand-primary ring-2 ring-brand-primary shadow-sm'
                              : 'bg-white border-gray-200 hover:border-brand-primary hover:bg-gray-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-bold text-brand-black flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-brand-primary" />
                                {slot.startTime} - {slot.endTime}
                              </div>
                              <div className="text-xs text-brand-grey mt-0.5">{slot.zone}</div>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isFull
                                  ? 'bg-rose-100 text-rose-700'
                                  : remaining <= 2
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isFull ? 'Full' : `${remaining} slots open`}
                            </span>
                          </div>

                          <div className="mt-3 text-[11px] text-brand-dGrey">
                            Capacity: {slot.bookedCount} / {slot.maxCapacity} booked
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <button onClick={handlePrevStep} className="btn-ghost text-xs">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!selectedSlotId}
                className="btn-primary"
              >
                Next: Address Details <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Address & Weight */}
        {step === 3 && (
          <div className="card space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-brand-black">3. Pickup Address & Volume</h2>
              <p className="text-xs text-brand-grey">
                Provide the exact doorstep collection location and estimated weight
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="e.g. 742 Evergreen Terrace, Unit 4"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                    Zip / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                  Landmark / Porch Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  placeholder="e.g. Green bins left by driveway gate beside garage"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider">
                    Estimated Weight: <span className="text-brand-primary font-bold">{estimatedWeightKg} kg</span>
                  </label>
                  <span className="text-xs text-brand-grey font-medium">Approx 1-2 standard bags</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={estimatedWeightKg}
                  onChange={(e) => setEstimatedWeightKg(Number(e.target.value))}
                  className="w-full accent-brand-primary"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <button onClick={handlePrevStep} className="btn-ghost text-xs">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <button onClick={handleNextStep} className="btn-primary">
                Next: Review & Confirm <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Confirm */}
        {step === 4 && (
          <div className="card space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-brand-black">4. Review & Confirm Booking</h2>
              <p className="text-xs text-brand-grey">
                Confirm your pickup parameters. You will receive real-time notifications when the eco-truck dispatches.
              </p>
            </div>

            <div className="bg-brand-silver rounded-xl p-5 space-y-4 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-brand-grey uppercase font-semibold block">Waste Category:</span>
                  <span className="text-sm font-bold text-brand-black">{selectedWasteType}</span>
                </div>
                <div>
                  <span className="text-brand-grey uppercase font-semibold block">Estimated Weight:</span>
                  <span className="text-sm font-bold text-brand-black">{estimatedWeightKg} kg</span>
                </div>
                <div>
                  <span className="text-brand-grey uppercase font-semibold block">Pickup Date:</span>
                  <span className="text-sm font-bold text-brand-black">{selectedSlot?.date}</span>
                </div>
                <div>
                  <span className="text-brand-grey uppercase font-semibold block">Time Window:</span>
                  <span className="text-sm font-bold text-brand-black">
                    {selectedSlot?.startTime} - {selectedSlot?.endTime}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-brand-grey uppercase font-semibold block">Pickup Address:</span>
                  <span className="text-sm font-medium text-brand-black">
                    {address.street}, {address.city}, {address.zipCode}
                    {address.landmark ? ` (${address.landmark})` : ''}
                  </span>
                </div>
              </div>

              {/* Eco Offset Forecast */}
              <div className="p-3 bg-brand-tint5 rounded-lg border border-brand-tint3/60 flex items-center gap-3">
                <TreePine className="w-6 h-6 text-brand-shade3 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-brand-shade3 block">
                    Estimated Carbon Offset: +{estimatedCarbonSaved} kg CO₂
                  </span>
                  <span className="text-brand-grey">
                    Verified through GreenRoute circular reclamation tracking.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <button onClick={handlePrevStep} className="btn-ghost text-xs">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="btn-primary !py-3 !px-8 font-semibold shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Locking Slot...
                  </>
                ) : (
                  <>
                    Confirm & Schedule Pickup
                    <Check className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePickupPage;
