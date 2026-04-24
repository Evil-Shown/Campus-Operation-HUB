const StatusBadge = ({ status }) => {
  const config = {
    APPROVED: {
      bg: "bg-green-100 text-green-700 border border-green-200",
      icon: "✓",
    },
    PENDING: {
      bg: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      icon: "⏱",
    },
    REJECTED: {
      bg: "bg-red-100 text-red-700 border border-red-200",
      icon: "✕",
    },
    CANCELLED: {
      bg: "bg-gray-100 text-gray-600 border border-gray-200",
      icon: "—",
    },
  };

  const { bg, icon } = config[status] || config.CANCELLED;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 
      rounded-full text-xs font-semibold ${bg}`}
    >
      <span>{icon}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
