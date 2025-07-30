// Stripe configuration for frontend
export const STRIPE_CONFIG = {
  // Replace with your actual Stripe publishable key
  publishableKey: 'pk_test_your_stripe_publishable_key_here',
  
  // Stripe options
  options: {
    // Set your account country code
    locale: 'en'
  }
};

// You'll get this from your Stripe Dashboard
// Test keys start with 'pk_test_'
// Live keys start with 'pk_live_'
