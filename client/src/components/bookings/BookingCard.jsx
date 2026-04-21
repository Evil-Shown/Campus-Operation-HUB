import StatusBadge from "./StatusBadge";

const BookingCard = ({ booking, onCancel, onApprove, onReject }) => {
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

  const canCancel =
    onCancel &&
    (booking.status === "PENDING" || booking.status === "APPROVED");
  const canApprove = onApprove && booking.status === "PENDING";
  const canReject = onReject && booking.status === "PENDING";

  return (
    <div className="bg-white rounded-xl border border-gray-100 
      shadow-sm hover:shadow-md transition-shadow p-5 
      flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-base">
            {booking.resourceName}
          </h3>
          <p className="text-gray-400 text-sm mt-0.5">
            📍 {booking.resourceLocation}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-50" />

      {/* Details */}
      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">📅</span>
          <span>{formatDate(booking.startTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🕐</span>
          <span>
            {formatTime(booking.startTime)} — {formatTime(booking.endTime)}
          </span>
        </div>
        {booking.attendees && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">👥</span>
            <span>{booking.attendees} attendees</span>
          </div>
        )}
        {booking.purpose && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📝</span>
            <span className="italic text-gray-500">{booking.purpose}</span>
          </div>
        )}
      </div>

      {/* Reject Reason */}
      {booking.status === "REJECTED" && booking.rejectReason && (
        <div className="bg-red-50 border border-red-100 rounded-lg 
          px-3 py-2 text-sm text-red-600">
          <span className="font-medium">Reason: </span>
          {booking.rejectReason}
        </div>
      )}

      {/* Action Buttons */}
      {(canCancel || canApprove || canReject) && (
        <div className="flex gap-2 pt-1 flex-wrap">
          {canApprove && (
            <button
              onClick={() => onApprove(booking.id)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 
                text-white text-sm font-medium py-1.5 px-3 
                rounded-lg transition-colors"
            >
              Approve
            </button>
          )}
          {canReject && (
            <button
              onClick={() => onReject(booking.id)}
              className="flex-1 bg-white hover:bg-red-50 
                text-red-600 border border-red-200 text-sm 
                font-medium py-1.5 px-3 rounded-lg transition-colors"
            >
              Reject
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="text-sm text-red-500 hover:text-red-700 
                hover:underline ml-auto"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;
