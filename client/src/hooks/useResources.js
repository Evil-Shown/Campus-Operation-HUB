import { useState, useEffect } from 'react';
import resourceApi from '../api/resourceApi';

const useResources = (filters = {}) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceApi.listResources(filters);
      setResources(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [JSON.stringify(filters)]);

  return { resources, loading, error, refresh: fetchResources };
};

export default useResources;
