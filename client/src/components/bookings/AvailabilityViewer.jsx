const AvailabilityViewer = ({ bookings, selectedDate }) => {
  const filtered = bookings.filter((b) => {
    const bookingDate = new Date(b.startTime).toISOString().split("T")[0];
    return bookingDate === selectedDate;
  });

  const formatTime = (dt) =>
    new Date(dt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-gray-50 border border-gray-200 
      rounded-xl p-4 mt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 
        flex items-center gap-2">
        🕐 Occupied Slots for Selected Date
      </h4>

      {filtered.length === 0 ? (
        <p className="text-green-600 text-sm flex items-center gap-2">
          ✅ No bookings for this date — resource is free!
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between 
                py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm text-gray-600">
                🕐 {formatTime(b.startTime)} — {formatTime(b.endTime)}
              </span>
              <span className="bg-red-100 text-red-700 text-xs 
                font-semibold px-2.5 py-0.5 rounded-full border 
                border-red-200">
                BOOKED
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityViewer;
