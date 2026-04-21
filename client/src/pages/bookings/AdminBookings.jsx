import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api/api";
import StatusBadge from "../../components/bookings/StatusBadge";
import { useAuth } from "../../context/AuthContext";

const AdminBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || user?.role !== "leader") return;
    api
      .get("/bookings?status=PENDING")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load pending bookings."))
      .finally(() => setLoading(false));
  }, [authLoading, user?.role]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
        Loading…
      </div>
    );
  }
  if (user?.role !== "leader") {
    return <Navigate to="/app" replace />;
  }

  const handleApprove = async (id) => {
    try {
      await api.patch(`/bookings/${id}/approve`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Could not approve — a conflicting booking exists.");
      } else {
        alert(err.response?.data?.message || err.message || "Failed to approve booking.");
      }
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason (optional):");
    if (reason === null) return;

    const url = reason.trim()
      ? `/bookings/${id}/reject?reason=${encodeURIComponent(reason.trim())}`
      : `/bookings/${id}/reject`;

    try {
      await api.patch(url);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to reject booking.");
    }
  };

  const formatDate = (dt) =>
    new Date(dt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dt) =>
    new Date(dt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Pending Approvals
        </h1>
        {bookings.length > 0 && (
          <span className="bg-yellow-100 text-yellow-700 border 
            border-yellow-200 text-sm font-semibold px-3 py-0.5 
            rounded-full">
            {bookings.length} pending
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Review and action pending booking requests
      </p>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin border-4 border-purple-600 
            border-t-transparent rounded-full w-8 h-8" />
          <span className="ml-3 text-gray-500 text-sm">
            Loading pending bookings...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-600 text-center py-8">{error}</div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-xl font-semibold text-gray-700">
            All caught up!
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            No pending bookings to review.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && bookings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 
          shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 text-gray-500 
                  font-medium text-xs uppercase tracking-wide">
                  Booking ID
                </th>
                <th className="text-left px-5 py-3.5 text-gray-500 
                  font-medium text-xs uppercase tracking-wide">
                  Resource
                </th>
                <th className="text-left px-5 py-3.5 text-gray-500 
                  font-medium text-xs uppercase tracking-wide">
                  Requested By
                </th>
                <th className="text-left px-5 py-3.5 text-gray-500 
                  font-medium text-xs uppercase tracking-wide">
                  Date & Time
                </th>
                <th className="text-left px-5 py-3.5 text-gray-500 
                  font-medium text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-gray-500 
                  font-medium text-xs uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr
                  key={b.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 
                    transition-colors ${
                      i === bookings.length - 1 ? "border-0" : ""
                    }`}
                >
                  <td className="px-5 py-4 font-semibold text-gray-800">
                    BK-{b.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-700">
                      {b.resourceName}
                    </div>
                    <div className="text-gray-400 text-xs">
                      📍 {b.resourceLocation}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {b.userName}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <div>{formatDate(b.startTime)}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(b.startTime)} — {formatTime(b.endTime)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(b.id)}
                        className="bg-purple-600 hover:bg-purple-700 
                          text-white text-xs font-medium px-3 py-1.5 
                          rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(b.id)}
                        className="bg-white hover:bg-red-50 text-red-600 
                          border border-red-200 text-xs font-medium 
                          px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
