import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import BookingFormFields from "../../components/bookings/BookingFormFields";
import AvailabilityViewer from "../../components/bookings/AvailabilityViewer";

const INITIAL_FORM = {
  resourceId: "",
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
  attendees: "",
};

const BookingForm = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [availabilityBookings, setAvailabilityBookings] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load resources on mount
  useEffect(() => {
    api
      .get("/resources")
      .then((res) => setResources(res.data))
      .catch(() => setError("Failed to load resources."))
      .finally(() => setLoadingResources(false));
  }, []);

  // Load availability when resource + date selected
  useEffect(() => {
    if (formData.resourceId && formData.date) {
      api
        .get(`/bookings/resource/${formData.resourceId}/availability`)
        .then((res) => setAvailabilityBookings(res.data))
        .catch(() => setAvailabilityBookings([]));
    } else {
      setAvailabilityBookings([]);
    }
  }, [formData.resourceId, formData.date]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.resourceId) return setError("Please select a resource.");
    if (!formData.date) return setError("Please select a date.");
    if (!formData.startTime) return setError("Please select a start time.");
    if (!formData.endTime) return setError("Please select an end time.");
    if (formData.endTime <= formData.startTime)
      return setError("End time must be after start time.");

    const payload = {
      resourceId: Number(formData.resourceId),
      startTime: `${formData.date}T${formData.startTime}:00`,
      endTime: `${formData.date}T${formData.endTime}:00`,
      purpose: formData.purpose?.trim() || "",
      attendees: formData.attendees ? Number(formData.attendees) : null,
    };

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/bookings", payload);
      setSuccess(true);
      setFormData(INITIAL_FORM);
      setAvailabilityBookings([]);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (typeof msg === "string" && msg.trim()) {
        setError(msg);
      } else if (status === 401) {
        setError("You are not logged in. Please sign in and try again.");
      } else if (status === 403) {
        setError("You do not have permission to perform this action.");
      } else if (status === 409) {
        setError("This time slot conflicts with an existing approved booking.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">New Booking</h1>
          <p className="text-gray-500 text-sm mt-1">
            Reserve a campus facility
          </p>
        </div>
        <Link
          to="/bookings"
          className="text-sm text-purple-600 hover:text-purple-700 
            hover:underline flex items-center gap-1"
        >
          ← My Bookings
        </Link>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 
          rounded-xl p-4 mb-4 flex items-center gap-3">
          <span className="text-lg">✅</span>
          <span className="text-sm font-medium">
            Booking submitted successfully! Awaiting admin approval.
          </span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 
          rounded-xl p-4 mb-4 flex items-center gap-3">
          <span className="text-lg">❌</span>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 
        shadow-sm p-6">
        {loadingResources ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin border-4 border-purple-600 
              border-t-transparent rounded-full w-8 h-8" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <BookingFormFields
              formData={formData}
              resources={resources}
              onChange={handleChange}
            />

            {/* Availability Viewer */}
            {formData.resourceId && formData.date && (
              <AvailabilityViewer
                bookings={availabilityBookings}
                selectedDate={formData.date}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 
                disabled:opacity-50 text-white font-medium py-3 
                rounded-xl transition-colors flex items-center 
                justify-center gap-2 text-sm"
            >
              {submitting && (
                <span className="animate-spin border-2 border-white 
                  border-t-transparent rounded-full w-4 h-4" />
              )}
              {submitting ? "Submitting..." : "Submit Booking Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
