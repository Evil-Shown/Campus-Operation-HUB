const rows = [
  {
    user: 'User A',
    resource: 'Computer Lab 3',
    dateTime: '2026-05-01 09:00-11:00',
    purpose: 'Project work',
    status: 'PENDING',
  },
  {
    user: 'User B',
    resource: 'Lecture Hall A101',
    dateTime: '2026-04-28 14:00-16:00',
    purpose: 'Group study',
    status: 'APPROVED',
  },
  {
    user: 'User C',
    resource: 'Meeting Room 5',
    dateTime: '2026-04-30 10:00-11:00',
    purpose: 'Discussion',
    status: 'REJECTED',
  },
]

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.listBookings();
      setBookings(response.data || []);
    } catch (err) {
      setError('System: Failed to synchronize with the allocation queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      let adminReviewNote = '';
      if (status === 'REJECTED') {
        const reason = window.prompt('Enter rejection reason (required):');
        if (!reason || !reason.trim()) return;
        adminReviewNote = reason.trim();
      } else if (status === 'APPROVED') {
        const note = window.prompt('Enter approval note (optional):');
        if (note !== null) {
          adminReviewNote = note.trim();
        }
      }

      await bookingApi.updateBookingStatus(id, status, adminReviewNote);
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || `System: Status synchronization to ${status} failed.`);
    }
  };

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-10"><ErrorMessage message={error} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Bookings</h1>
        <p className="text-sm text-slate-600">Review and process user booking requests.</p>
      </div>

      <div className="w-full max-w-xs">
        <label className="mb-1 block text-sm font-medium text-slate-700">Filter by status</label>
        <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600">
          <option>All statuses (placeholder)</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.user}-${row.resource}`} className="border-t border-slate-100">
                <td className="px-4 py-3">{row.user}</td>
                <td className="px-4 py-3">{row.resource}</td>
                <td className="px-4 py-3">{row.dateTime}</td>
                <td className="px-4 py-3">{row.purpose}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" className="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700">
                      Approve
                    </button>
                    <button type="button" className="rounded border border-red-300 px-2 py-1 text-xs text-red-700">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
