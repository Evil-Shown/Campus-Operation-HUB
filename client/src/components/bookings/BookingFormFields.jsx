const inputClass = `w-full border border-gray-200 rounded-lg px-3 py-2.5
  text-sm text-gray-700 bg-white
  focus:outline-none focus:ring-2 focus:ring-purple-500
  focus:border-transparent transition`;

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

const BookingFormFields = ({ formData, resources, onChange }) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 gap-4">

      {/* Resource */}
      <div>
        <label className={labelClass}>Facility / Resource</label>
        <select
          className={inputClass}
          value={formData.resourceId}
          onChange={(e) => onChange("resourceId", e.target.value)}
        >
          <option value="">Select a resource...</option>
          {resources.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — {r.location}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className={labelClass}>Date</label>
        <input
          type="date"
          min={today}
          className={inputClass}
          value={formData.date}
          onChange={(e) => onChange("date", e.target.value)}
        />
      </div>

      {/* Time row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Start Time</label>
          <input
            type="time"
            className={inputClass}
            value={formData.startTime}
            onChange={(e) => onChange("startTime", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>End Time</label>
          <input
            type="time"
            className={inputClass}
            value={formData.endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
          />
        </div>
      </div>

      {/* Attendees */}
      <div>
        <label className={labelClass}>
          Number of Attendees
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 10"
          className={inputClass}
          value={formData.attendees}
          onChange={(e) => onChange("attendees", e.target.value)}
        />
      </div>

      {/* Purpose */}
      <div>
        <label className={labelClass}>
          Purpose
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Describe the purpose of your booking..."
          className={inputClass}
          value={formData.purpose}
          onChange={(e) => onChange("purpose", e.target.value)}
        />
      </div>
    </div>
  );
};

export default BookingFormFields;
