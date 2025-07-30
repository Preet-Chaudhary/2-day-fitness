import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const paymentAPI = {
  // Create Stripe payment intent
  createPaymentIntent: async (paymentData) => {
    try {
      const response = await api.post('/payment/create-intent', {
        planName: paymentData.planName,
        duration: paymentData.duration,
        price: paymentData.price
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create payment intent' };
    }
  },

  // Process payment with Stripe
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/payment/process', {
        planName: paymentData.planName,
        duration: paymentData.duration,
        price: paymentData.price,
        paymentIntentId: paymentData.paymentIntentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Payment processing failed' };
    }
  },

  // Get user subscriptions
  getSubscriptions: async () => {
    try {
      const response = await api.get('/payment/subscriptions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch subscriptions' };
    }
  },

  // Cancel a subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await api.post(`/payment/cancel/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to cancel subscription' };
    }
  },

  // Check if user has active subscription for a plan
  hasActivePlan: async (planName) => {
    try {
      const subscriptions = await paymentAPI.getSubscriptions();
      if (subscriptions.success) {
        return subscriptions.subscriptions.some(
          sub => sub.planName === planName && 
                 sub.status === 'active' && 
                 sub.daysRemaining > 0
        );
      }
      return false;
    } catch (error) {
      console.error('Error checking active plan:', error);
      return false;
    }
  },

  // Get active subscription for a plan
  getActivePlan: async (planName) => {
    try {
      const subscriptions = await paymentAPI.getSubscriptions();
      if (subscriptions.success) {
        return subscriptions.subscriptions.find(
          sub => sub.planName === planName && 
                 sub.status === 'active' && 
                 sub.daysRemaining > 0
        );
      }
      return null;
    } catch (error) {
      console.error('Error getting active plan:', error);
      return null;
    }
  }
};

export default paymentAPI;
