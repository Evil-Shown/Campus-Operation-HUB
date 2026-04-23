import React, { useState, useEffect } from 'react';
import resourceApi from '../../api/resourceApi';
import FacilityFilter from '../../components/resources/FacilityFilter';
import FacilityCard from '../../components/resources/FacilityCard';

export default function ResourceListPage() {
  // State variables for holding resources, loading status, and error messages
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //data retrive function from backend (Function)
  const loadResources = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      // හsend to the Api only filters that have values (non-empty)
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const data = await resourceApi.getAll(cleanFilters);
      setResources(data);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to load resources. Please ensure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  //  automatically load resources when the component mounts (useEffect)
  useEffect(() => {
    loadResources();
  }, []);

  // active when user changes filters in the FacilityFilter component 
  const handleFilterChange = (newFilters) => {
    loadResources(newFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Facilities & Assets</h1>
        <p className="text-sm text-slate-600">Browse available campus resources, search by type or capacity, and view key details.</p>
      </div>

      {/* 1.  (Filter Component) */}
      <FacilityFilter onFilterChange={handleFilterChange} />

      {/* 2. Show loading and Error msgs */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-center font-medium">
          {error}
        </div>
      )}

      {/* 3. Show message when no resources are found */}
      {!loading && !error && resources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 font-medium">No resources found matching your criteria.</p>
          <p className="text-sm text-gray-400 mt-1">Try clearing filters or searching for something else.</p>
        </div>
      )}

      {/* 4. Show actual resource cards */}
      {!loading && !error && resources.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <FacilityCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}