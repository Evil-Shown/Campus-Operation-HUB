import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import StatusBadge from "../../components/bookings/StatusBadge";

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load your bookings."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to cancel booking.");
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
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage your facility booking requests
          </p>
        </div>
        <Link
          to="/bookings/new"
          className="bg-purple-600 hover:bg-purple-700 text-white 
            text-sm font-medium px-4 py-2 rounded-xl 
            transition-colors flex items-center gap-2"
        >
          + New Booking
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mt-5 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium 
              transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {f}
            {f !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({bookings.filter((b) => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin border-4 border-purple-600 
            border-t-transparent rounded-full w-8 h-8" />
          <span className="ml-3 text-gray-500 text-sm">
            Loading your bookings...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-600 text-center py-8">{error}</div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-gray-500 text-sm">No bookings found.</p>
          {filter === "ALL" && (
            <Link
              to="/bookings/new"
              className="text-purple-600 hover:underline text-sm mt-2 
                inline-block"
            >
              Make your first booking →
            </Link>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
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
                  Date
                </th>
                <th className="text-left px-5 py-3.5 text-gray-500 
                  font-medium text-xs uppercase tracking-wide">
                  Time
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
              {filtered.map((b, i) => (
                <tr
                  key={b.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 
                    transition-colors ${
                      i === filtered.length - 1 ? "border-0" : ""
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
                    {formatDate(b.startTime)}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {formatTime(b.startTime)} — {formatTime(b.endTime)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={b.status} />
                    {b.status === "REJECTED" && b.rejectReason && (
                      <div className="text-red-500 text-xs mt-1">
                        {b.rejectReason}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {(b.status === "PENDING" || b.status === "APPROVED") && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-red-500 hover:text-red-700 
                          text-xs hover:underline"
                      >
                        Cancel
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
  );
};

export default MyBookings;
