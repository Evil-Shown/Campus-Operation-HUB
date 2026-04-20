import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import BookingFormFields from '../../components/bookings/BookingFormFields'
import AvailabilityViewer from '../../components/bookings/AvailabilityViewer'

const initialFormData = {
  resourceId: '',
  date: '',
  startTime: '',
  endTime: '',
  purpose: '',
  attendees: '',
}

function BookingForm() {
  const [resources, setResources] = useState([])
  const [formData, setFormData] = useState(initialFormData)
  const [availabilityBookings, setAvailabilityBookings] = useState([])
  const [loadingResources, setLoadingResources] = useState(true)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await api.get('/resources')
        setResources(response.data)
      } catch (err) {
        setError('Failed to load resources')
      } finally {
        setLoadingResources(false)
      }
    }

    loadResources()
  }, [])

  useEffect(() => {
    const loadAvailability = async () => {
      if (!formData.resourceId || !formData.date) {
        setAvailabilityBookings([])
        return
      }

      setLoadingAvailability(true)
      try {
        const response = await api.get(`/bookings/resource/${formData.resourceId}/availability`)
        setAvailabilityBookings(response.data)
      } catch (err) {
        setAvailabilityBookings([])
      } finally {
        setLoadingAvailability(false)
      }
    }

    loadAvailability()
  }, [formData.resourceId, formData.date])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)

    if (!formData.resourceId) {
      setError('Please select a resource')
      return
    }
    if (!formData.date) {
      setError('Please select a date')
      return
    }
    if (!formData.startTime) {
      setError('Please select a start time')
      return
    }
    if (!formData.endTime) {
      setError('Please select an end time')
      return
    }
    if (formData.endTime <= formData.startTime) {
      setError('End time must be after start time')
      return
    }

    const payload = {
      resourceId: Number(formData.resourceId),
      startTime: `${formData.date}T${formData.startTime}:00`,
      endTime: `${formData.date}T${formData.endTime}:00`,
      purpose: formData.purpose || null,
      attendees: formData.attendees ? Number(formData.attendees) : null,
    }

    setSubmitting(true)
    setError(null)

    try {
      await api.post('/bookings', payload)
      setSuccess(true)
      setFormData(initialFormData)
      setAvailabilityBookings([])
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response?.data?.message || 'Booking conflict detected.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Booking</h1>
        <Link to="/bookings" className="text-sm text-blue-600 hover:underline">
          ← My Bookings
        </Link>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-400 text-green-800 rounded-lg p-4 mb-4 flex items-center gap-2">
          <span>✅</span>
          <span>Booking submitted successfully! Awaiting admin approval.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-800 rounded-lg p-4 mb-4 flex items-center gap-2">
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
        {loadingResources ? (
          <div className="text-sm text-gray-500">Loading resources...</div>
        ) : (
          <BookingFormFields formData={formData} resources={resources} onChange={handleChange} />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm transition-colors"
        >
          {submitting && (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 inline-block mr-2" />
          )}
          {submitting ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </form>

      {formData.resourceId && formData.date && (
        <>
          {loadingAvailability && <div className="text-sm text-gray-500 mt-4">Loading availability...</div>}
          <AvailabilityViewer bookings={availabilityBookings} selectedDate={formData.date} />
        </>
      )}
    </div>
  )
}

export default BookingForm
