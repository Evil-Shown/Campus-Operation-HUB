import React from 'react'

function BookingFormFields({ formData, resources, onChange }) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">Facility / Resource</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.resourceId}
          onChange={(e) => onChange('resourceId', e.target.value)}
        >
          <option value="">Select a resource</option>
          {resources.map((resource) => (
            <option key={resource.id} value={resource.id}>
              {resource.name} — {resource.location}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          min={today}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.date}
          onChange={(e) => onChange('date', e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
        <input
          type="time"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.startTime}
          onChange={(e) => onChange('startTime', e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
        <input
          type="time"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.endTime}
          onChange={(e) => onChange('endTime', e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Attendees (optional)</label>
        <input
          type="number"
          min="1"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.attendees}
          onChange={(e) => onChange('attendees', e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose (optional)</label>
        <textarea
          rows={3}
          placeholder="Describe the purpose of your booking..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.purpose}
          onChange={(e) => onChange('purpose', e.target.value)}
        />
      </div>
    </div>
  )
}

export default BookingFormFields
