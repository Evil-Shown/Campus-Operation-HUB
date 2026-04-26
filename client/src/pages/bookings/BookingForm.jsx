import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import bookingService from '../../services/bookingService'

const INITIAL_FORM = {
  resourceId: '',
  bookingDate: '',
  startTime: '',
  endTime: '',
  purpose: '',
  expectedAttendees: '',
}

const buildLocalDateTime = (date, time) => `${date}T${time}:00`

const BookingForm = () => {
  // Member 2 - Booking Management
  const [resources, setResources] = useState([])
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [availabilityBookings, setAvailabilityBookings] = useState([])
  const [loadingResources, setLoadingResources] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchResources = async ({ silent = false } = {}) => {
    if (!silent) {
      setLoadingResources(true)
    }
    setError('')
    try {
      const res = await api.get('/resources')
      setResources(res.data || [])
    } catch {
      setError('Failed to load resources.')
    } finally {
      if (!silent) {
        setLoadingResources(false)
      }
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  useEffect(() => {
    if (formData.resourceId && formData.bookingDate) {
      bookingService
        .getResourceAvailability(formData.resourceId)
        .then((res) =>
          setAvailabilityBookings((res.data || []).filter((item) => item.bookingDate === formData.bookingDate)),
        )
        .catch(() => setAvailabilityBookings([]))
    } else {
      setAvailabilityBookings([])
    }
  }, [formData.resourceId, formData.bookingDate])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const conflictExists = useMemo(() => {
    if (!formData.startTime || !formData.endTime) return false
    return availabilityBookings.some((booking) => booking.startTime < formData.endTime && booking.endTime > formData.startTime)
  }, [availabilityBookings, formData.endTime, formData.startTime])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.resourceId) return setError('Please select a resource.')
    if (!formData.bookingDate) return setError('Please select a booking date.')
    if (!formData.startTime || !formData.endTime) return setError('Please select start and end times.')
    if (formData.endTime <= formData.startTime) return setError('End time must be after start time.')
    if (!formData.purpose.trim()) return setError('Purpose is required.')
    if (!formData.expectedAttendees || Number(formData.expectedAttendees) <= 0) {
      return setError('Expected attendees must be greater than 0.')
    }
    if (conflictExists) return setError('Selected time conflicts with an approved booking.')

    const payload = {
      resourceId: Number(formData.resourceId),
      startTime: buildLocalDateTime(formData.bookingDate, formData.startTime),
      endTime: buildLocalDateTime(formData.bookingDate, formData.endTime),
      purpose: formData.purpose.trim(),
      attendees: Number(formData.expectedAttendees),
    }

    setSubmitting(true)
    setError('')

    try {
      await bookingService.createBooking(payload)
      setSuccess('Booking submitted successfully. Status: PENDING.')
      setFormData(INITIAL_FORM)
      setAvailabilityBookings([])
    } catch (err) {
      if (err?.response?.status === 409) {
        setError(
          err.response?.data?.message ||
            'That time slot was just taken for this resource. Please choose a different time.',
        )
      } else {
        setError(err.response?.data?.message || 'Failed to create booking. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Booking</h1>
          <p className="mt-1 text-sm text-gray-500">Submit a booking request for a campus resource.</p>
        </div>
        <Link to="/bookings/my" className="text-sm text-purple-600 hover:underline">My Bookings</Link>
      </div>

      {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        {loadingResources ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-gray-700">Resource</span>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={formData.resourceId}
                  onFocus={() => fetchResources({ silent: true })}
                  onChange={(e) => handleChange('resourceId', e.target.value)}
                >
                  <option value="">Select resource</option>
                  {resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name} ({resource.physicalLocation || resource.location || 'N/A'})
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-700">Date</span>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={formData.bookingDate}
                  onChange={(e) => handleChange('bookingDate', e.target.value)}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-700">Start time</span>
                <input type="time" className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formData.startTime} onChange={(e) => handleChange('startTime', e.target.value)} />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-700">End time</span>
                <input type="time" className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formData.endTime} onChange={(e) => handleChange('endTime', e.target.value)} />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-1 block text-gray-700">Purpose</span>
                <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2" rows={3} value={formData.purpose} onChange={(e) => handleChange('purpose', e.target.value)} />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-700">Expected attendees</span>
                <input type="number" min="1" className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formData.expectedAttendees} onChange={(e) => handleChange('expectedAttendees', e.target.value)} />
              </label>
            </div>

            {formData.resourceId && formData.bookingDate && (
              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-700">Approved bookings preview</p>
                {availabilityBookings.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">No approved bookings for this date.</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {availabilityBookings.map((item) => (
                      <li key={item.id}>{item.startTime} - {item.endTime}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || conflictExists}
              className="mt-6 w-full rounded-xl bg-purple-600 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : conflictExists ? 'Conflict Detected' : 'Submit Booking Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default BookingForm
