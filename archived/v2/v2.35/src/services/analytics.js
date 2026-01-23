import ReactGA from 'https://esm.sh/react-ga4';

const TRACKING_ID = 'G-XXXXXXXXXX';

export const initGA = () => {
  if (typeof window !== 'undefined') {
    ReactGA.initialize(TRACKING_ID);
  }
};

export const trackPageView = (location) => {
  const page = location.pathname + location.search;
  ReactGA.send({ hitType: 'pageview', page: page });
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
