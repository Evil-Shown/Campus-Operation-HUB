import React, { useState } from 'react';

const FacilityFilter = ({ onFilterChange }) => {
  // state that holds the value of filters
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    minCapacity: ''
  });

  // Automatically updates when you type or select something in the filter inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters); // Notify parent component of the new filter values immediately(send data to main page)
  };

  // reset all filter values to default and notify parent component
  const handleClear = () => {
    const resetFilters = { type: '', location: '', minCapacity: '' };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        
        {/* 1. (Type Filter) */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Resource Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Laboratory</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>

        {/* 2.  (Location Filter) */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Block A"
            value={filters.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        {/* 3.  (Capacity Filter) */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Min Capacity (Seats)</label>
          <input
            type="number"
            name="minCapacity"
            placeholder="e.g. 50"
            min="1"
            value={filters.minCapacity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Clear button */}
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={handleClear}
            className="w-full md:w-auto px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors text-sm"
          >
            Clear Filters
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default FacilityFilter;