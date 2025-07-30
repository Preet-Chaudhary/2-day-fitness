const Stripe = require('stripe');
require('dotenv').config();

// Initialize Stripe with secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  // Create a payment intent for the subscription
  async createPaymentIntent(amount, currency = 'inr', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents/paise
        currency: currency,
        metadata: metadata,
        payment_method_types: ['card'],
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Confirm payment intent
  async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        paymentIntent: paymentIntent
      };
    } catch (error) {
      console.error('Stripe Confirm Payment Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a customer in Stripe
  async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: metadata
      });

      return {
        success: true,
        customer: customer
      };
    } catch (error) {
      console.error('Stripe Create Customer Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a subscription
  async createSubscription(customerId, priceId, metadata = {}) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        metadata: metadata,
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        success: true,
        subscription: subscription,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      console.error('Stripe Create Subscription Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.del(subscriptionId);
      
      return {
        success: true,
        subscription: subscription
      };
    } catch (error) {
      console.error('Stripe Cancel Subscription Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a product in Stripe
  async createProduct(name, description, metadata = {}) {
    try {
      const product = await stripe.products.create({
        name: name,
        description: description,
        metadata: metadata
      });

      return {
        success: true,
        product: product
      };
    } catch (error) {
      console.error('Stripe Create Product Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a price for a product
  async createPrice(productId, amount, currency = 'inr', interval = 'month') {
    try {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: Math.round(amount * 100), // Convert to cents/paise
        currency: currency,
        recurring: {
          interval: interval,
        },
      });

      return {
        success: true,
        price: price
      };
    } catch (error) {
      console.error('Stripe Create Price Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle webhook events
  async handleWebhook(body, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      return {
        success: true,
        event: event
      };
    } catch (error) {
      console.error('Stripe Webhook Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new StripeService();
