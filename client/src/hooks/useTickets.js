import { useState, useEffect } from 'react';
import ticketApi from '../api/ticketApi';

const useTickets = (params = {}) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketApi.listTickets(params);
      setTickets(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [JSON.stringify(params)]);

  return { tickets, loading, error, refresh: fetchTickets };
};

export default useTickets;
