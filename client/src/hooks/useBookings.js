import { useState, useEffect } from 'react';
import bookingApi from '../api/bookingApi';

const useBookings = (scope = 'mine') => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = scope === 'mine' 
        ? await bookingApi.listMyBookings() 
        : await bookingApi.listBookings();
      setBookings(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [scope]);

  return { bookings, loading, error, refresh: fetchBookings };
};

export default useBookings;
