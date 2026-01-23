import React, { useEffect } from 'https://esm.sh/react@18.2.0';
import { useLocation } from 'https://esm.sh/react-router-dom@6';
import { trackPageView } from '../services/analytics.js';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return null;
};

export default AnalyticsTracker;
