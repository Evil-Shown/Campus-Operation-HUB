import React from 'react';

const FacilityCard = ({ resource }) => {
  // color change according to status
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    OUT_OF_SERVICE: 'bg-red-100 text-red-800 border-red-200'
  };

  // format type to be more readable (e.g., MEETING_ROOM -> Meeting Room)
  const formatType = (type) => {
    return type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.name}</h3>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              {formatType(resource.type)}
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[resource.status]}`}>
            {resource.status === 'OUT_OF_SERVICE' ? 'Out of Service' : 'Active'}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {resource.location}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Capacity: {resource.capacity} seats
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          View Details &rarr;
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;