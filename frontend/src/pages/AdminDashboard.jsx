import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  ShieldCheck,
  Calendar,
  Clock,
  Truck,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Loader2,
  TreePine,
  Layers,
  ArrowUpDown,
  Check,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'slots' | 'users'
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('all');

  // Status update modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedBookingForStatus, setSelectedBookingForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('Confirmed');
  const [newCollector, setNewCollector] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Slots state
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [createSlotModalOpen, setCreateSlotModalOpen] = useState(false);
  const [creatingSlot, setCreatingSlot] = useState(false);
  const [newSlotData, setNewSlotData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00 AM',
    endTime: '10:00 AM',
    label: '',
    zone: 'Central Metro Zone',
    maxCapacity: 6,
  });

  // Users state
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/stats/summary');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (wasteTypeFilter !== 'all') params.wasteType = wasteTypeFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/bookings', { params });
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      showToast('Error loading bookings.', 'error');
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);
      const res = await api.get('/slots');
      if (res.data.success) {
        setSlots(res.data.slots);
      }
    } catch (err) {
      showToast('Error loading pickup slots.', 'error');
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get('/users');
      if (res.data.success) {
        setUsersList(res.data.users);
      }
    } catch (err) {
      showToast('Error loading user directory.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBookings();
    fetchSlots();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleOpenStatusModal = (booking) => {
    setSelectedBookingForStatus(booking);
    setNewStatus(booking.status);
    setNewCollector(booking.assignedCollector || 'GreenRoute Eco-Truck #4');
    setStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedBookingForStatus) return;
    try {
      setUpdatingStatus(true);
      const res = await api.put(`/bookings/${selectedBookingForStatus._id}/status`, {
        status: newStatus,
        assignedCollector: newCollector,
      });
      if (res.data.success) {
        showToast(`Booking ${selectedBookingForStatus.bookingId} updated to ${newStatus}.`, 'success');
        setStatusModalOpen(false);
        fetchBookings();
        fetchStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update booking status.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      setCreatingSlot(true);
      const res = await api.post('/slots', newSlotData);
      if (res.data.success) {
        showToast('Pickup slot created successfully!', 'success');
        setCreateSlotModalOpen(false);
        fetchSlots();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create slot.', 'error');
    } finally {
      setCreatingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this pickup slot?')) return;
    try {
      const res = await api.delete(`/slots/${slotId}`);
      if (res.data.success) {
        showToast('Slot deleted.', 'success');
        fetchSlots();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Cannot delete slot.', 'error');
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'resident' : 'admin';
    try {
      const res = await api.put(`/users/${userId}/role`, { role: nextRole });
      if (res.data.success) {
        showToast(`User role changed to ${nextRole}.`, 'success');
        fetchUsers();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-brand-silver py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white bg-brand-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" /> Admin Operations Console
              </span>
              <span className="text-xs text-brand-grey font-medium">Logged in as {user?.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-black">
              Municipal Waste Logistics Center
            </h1>
            <p className="text-sm text-brand-grey max-w-xl">
              Oversee community pickups, update truck routes, regulate slot capacities, and enforce zero-overbooking protocols.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateSlotModalOpen(true)}
              className="btn-primary !py-2.5 !px-5 text-sm font-semibold shadow-md"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Pickup Slot
            </button>
          </div>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="card !p-4">
            <div className="text-xs text-brand-grey font-semibold">Total Bookings</div>
            <div className="text-2xl font-bold text-brand-black mt-1">
              {stats?.totalBookings ?? 0}
            </div>
          </div>
          <div className="card !p-4">
            <div className="text-xs text-amber-700 font-semibold">Pending Approval</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {stats?.pendingBookings ?? 0}
            </div>
          </div>
          <div className="card !p-4">
            <div className="text-xs text-brand-primary font-semibold">Active Confirmed</div>
            <div className="text-2xl font-bold text-brand-primary mt-1">
              {stats?.confirmedBookings ?? 0}
            </div>
          </div>
          <div className="card !p-4">
            <div className="text-xs text-emerald-800 font-semibold">Completed</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {stats?.completedBookings ?? 0}
            </div>
          </div>
          <div className="card !p-4">
            <div className="text-xs text-brand-grey font-semibold">Registered Residents</div>
            <div className="text-2xl font-bold text-brand-black mt-1">
              {stats?.totalUsers ?? 0}
            </div>
          </div>
          <div className="card !p-4">
            <div className="text-xs text-brand-shade3 font-semibold">CO₂ Offset (kg)</div>
            <div className="text-2xl font-bold text-brand-shade3 mt-1">
              {stats?.totalCarbonSavedKg ?? 0}
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-gray-200 gap-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-grey hover:text-brand-black'
            }`}
          >
            <Layers className="w-4 h-4" />
            Bookings Management ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'slots'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-grey hover:text-brand-black'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Pickup Slots & Capacity ({slots.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-grey hover:text-brand-black'
            }`}
          >
            <Users className="w-4 h-4" />
            Resident Directory
          </button>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="card space-y-5 animate-fade-in">
            {/* Filters bar */}
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, resident name, or street..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-brand-black focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={wasteTypeFilter}
                  onChange={(e) => {
                    setWasteTypeFilter(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-brand-black focus:outline-none"
                >
                  <option value="all">All Waste Types</option>
                  <option value="Recyclables">Recyclables</option>
                  <option value="Organic / Compost">Organic / Compost</option>
                  <option value="Electronic Waste">Electronic Waste</option>
                  <option value="General Waste">General Waste</option>
                  <option value="Hazardous Waste">Hazardous Waste</option>
                  <option value="Bulk / Furniture">Bulk / Furniture</option>
                </select>

                <button onClick={fetchBookings} className="btn-secondary text-xs !py-2 !px-3">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Table */}
            {loadingBookings ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
                <p className="text-xs text-brand-grey">Loading booking records...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-10 text-sm text-brand-grey">
                No bookings matching the criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-brand-silver text-brand-dGrey font-semibold uppercase">
                      <th className="py-3 px-3">Booking ID</th>
                      <th className="py-3 px-3">Resident</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Pickup Window</th>
                      <th className="py-3 px-3">Doorstep Address</th>
                      <th className="py-3 px-3">Collector Truck</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b._id} className="hover:bg-brand-silver/30 transition">
                        <td className="py-3 px-3 font-mono font-bold text-brand-black">
                          {b.bookingId}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-brand-black">{b.user?.name}</div>
                          <div className="text-[11px] text-brand-grey">{b.user?.email}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-brand-black">
                          {b.wasteType} ({b.estimatedWeightKg} kg)
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-brand-black">{b.slot?.date}</div>
                          <div className="text-[11px] text-brand-grey">
                            {b.slot?.startTime} - {b.slot?.endTime}
                          </div>
                        </td>
                        <td className="py-3 px-3 max-w-[180px] truncate" title={`${b.address?.street}, ${b.address?.city}`}>
                          {b.address?.street}, {b.address?.city}
                        </td>
                        <td className="py-3 px-3 text-brand-dGrey font-medium">
                          {b.assignedCollector}
                        </td>
                        <td className="py-3 px-3">
                          <Badge status={b.status} />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleOpenStatusModal(b)}
                            className="btn-secondary !py-1 !px-2.5 text-xs font-semibold"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SLOT MANAGEMENT */}
        {activeTab === 'slots' && (
          <div className="card space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-brand-black">Collection Schedule & Slots</h2>
                <p className="text-xs text-brand-grey">
                  Configure pickup slots with strict capacity limits to eliminate double-booking.
                </p>
              </div>
              <button
                onClick={() => setCreateSlotModalOpen(true)}
                className="btn-primary text-xs !py-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Slot
              </button>
            </div>

            {loadingSlots ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
                <p className="text-xs text-brand-grey">Loading slots...</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-10 text-sm text-brand-grey">
                No slots configured. Click "Add Pickup Slot" above to define time windows.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slots.map((slot) => {
                  const remaining = Math.max(0, slot.maxCapacity - slot.bookedCount);
                  const isFull = slot.bookedCount >= slot.maxCapacity;

                  return (
                    <div
                      key={slot._id}
                      className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-brand-black flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-brand-primary" />
                            {slot.date}
                          </div>
                          <div className="text-xs font-semibold text-brand-dGrey mt-0.5">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-[11px] text-brand-grey mt-0.5">{slot.zone}</div>
                        </div>
                        <Badge status={isFull ? 'full' : slot.status} />
                      </div>

                      {/* Capacity progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-brand-grey">Slot Load:</span>
                          <span className={isFull ? 'text-brand-error' : 'text-brand-shade3'}>
                            {slot.bookedCount} / {slot.maxCapacity} booked
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? 'bg-red-500' : 'bg-brand-primary'
                            }`}
                            style={{
                              width: `${Math.min(100, (slot.bookedCount / slot.maxCapacity) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-brand-grey">
                          {remaining} spots available
                        </span>
                        <button
                          onClick={() => handleDeleteSlot(slot._id)}
                          className="text-brand-error hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESIDENTS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="card space-y-6 animate-fade-in">
            <div>
              <h2 className="text-base font-bold text-brand-black">Resident Directory & Role Access</h2>
              <p className="text-xs text-brand-grey">
                Registered community members and their booking statistics
              </p>
            </div>

            {loadingUsers ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
                <p className="text-xs text-brand-grey">Loading user directory...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-brand-silver text-brand-dGrey font-semibold uppercase">
                      <th className="py-3 px-3">Resident Name</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Contact Phone</th>
                      <th className="py-3 px-3">Total Pickups</th>
                      <th className="py-3 px-3">System Role</th>
                      <th className="py-3 px-3 text-right">Role Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-brand-silver/30 transition">
                        <td className="py-3 px-3 font-semibold text-brand-black">
                          {u.name}
                        </td>
                        <td className="py-3 px-3 text-brand-dGrey">{u.email}</td>
                        <td className="py-3 px-3 text-brand-dGrey">{u.phone || 'N/A'}</td>
                        <td className="py-3 px-3 font-bold text-brand-shade3">
                          {u.bookingsCount ?? 0}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-brand-black text-white'
                                : 'bg-brand-tint5 text-brand-shade3'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {u._id !== user?.id && (
                            <button
                              onClick={() => handleToggleUserRole(u._id, u.role)}
                              className="text-xs font-semibold text-brand-primary hover:underline"
                            >
                              Toggle to {u.role === 'admin' ? 'Resident' : 'Admin'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Update Booking Status & Assigned Truck */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Booking Status"
      >
        <div className="space-y-4">
          <div className="text-xs text-brand-grey">
            Updating status for Ref: <strong>{selectedBookingForStatus?.bookingId}</strong> (Resident:{' '}
            {selectedBookingForStatus?.user?.name})
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
              Select Lifecycle Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-brand-black bg-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress (Truck Dispatched)</option>
              <option value="Completed">Completed (Recycled)</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
              Assigned Collection Vehicle
            </label>
            <input
              type="text"
              value={newCollector}
              onChange={(e) => setNewCollector(e.target.value)}
              placeholder="e.g. GreenRoute Eco-Truck #4"
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="btn-ghost text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStatus}
              disabled={updatingStatus}
              className="btn-primary text-xs !py-2.5 !px-5"
            >
              {updatingStatus ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Create New Pickup Slot */}
      <Modal
        isOpen={createSlotModalOpen}
        onClose={() => setCreateSlotModalOpen(false)}
        title="Create New Pickup Slot"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
              Pickup Date (YYYY-MM-DD) *
            </label>
            <input
              type="date"
              required
              value={newSlotData.date}
              onChange={(e) => setNewSlotData({ ...newSlotData, date: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                Start Time *
              </label>
              <input
                type="text"
                required
                value={newSlotData.startTime}
                onChange={(e) => setNewSlotData({ ...newSlotData, startTime: e.target.value })}
                placeholder="08:00 AM"
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
                End Time *
              </label>
              <input
                type="text"
                required
                value={newSlotData.endTime}
                onChange={(e) => setNewSlotData({ ...newSlotData, endTime: e.target.value })}
                placeholder="10:00 AM"
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
              District / Zone
            </label>
            <input
              type="text"
              value={newSlotData.zone}
              onChange={(e) => setNewSlotData({ ...newSlotData, zone: e.target.value })}
              placeholder="Central Metro Zone"
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dGrey uppercase tracking-wider mb-1">
              Maximum Booking Capacity *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={newSlotData.maxCapacity}
              onChange={(e) => setNewSlotData({ ...newSlotData, maxCapacity: Number(e.target.value) })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-brand-black focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
            <span className="text-[11px] text-brand-grey mt-0.5 block">
              Prevents overbooking once this limit is reached.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setCreateSlotModalOpen(false)}
              className="btn-ghost text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingSlot}
              className="btn-primary text-xs !py-2.5 !px-5"
            >
              {creatingSlot ? 'Creating Slot...' : 'Create Slot'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
