// API Configuration for different environments
const config = {
  development: {
    API_URL: 'http://localhost:5000',
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key'
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || 'https://your-backend-app.onrender.com',
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  }
};

const environment = import.meta.env.MODE === 'production' ? 'production' : 'development';

export const API_CONFIG = config[environment];

// API utility functions
export const apiUrl = (endpoint) => `${API_CONFIG.API_URL}/api${endpoint}`;

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: API_CONFIG.STRIPE_PUBLISHABLE_KEY
};

export default API_CONFIG;
