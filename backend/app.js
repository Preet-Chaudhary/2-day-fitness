const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const User = require('./models/User');
const Subscription = require('./models/Subscription');
const stripeService = require('./services/stripeService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }
    
    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Routes

// Health check route
app.get('/', (req, res) => {
  res.json({ message: '2 Day Fitness API is running!' });
});

// Sign up route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Return user data (password excluded by toJSON method) and token
    res.status(201).json({
      message: 'User created successfully',
      user: newUser.toJSON(),
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check password using the instance method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (password excluded by toJSON method) and token
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile (protected route)
app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    // User is already attached to req by the authenticateToken middleware
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout route (client-side token removal)
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logout successful. Please remove token from client storage.' });
});

// Get all users (for testing purposes - remove in production)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ 
      users,
      count: users.length,
      message: `Found ${users.length} registered users`
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment Processing Routes with Stripe
app.post('/api/payment/create-intent', authenticateToken, async (req, res) => {
  try {
    const { planName, duration, price } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!planName || !duration || !price) {
      return res.status(400).json({ 
        error: 'Missing required payment information' 
      });
    }

    // Calculate tax (18% GST)
    const taxRate = 0.18;
    const subtotal = parseFloat(price);
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripeService.createPaymentIntent(
      totalAmount,
      'inr',
      {
        userId: userId,
        planName: planName,
        duration: duration.toString(),
        userEmail: user.email
      }
    );

    if (!paymentIntent.success) {
      return res.status(400).json({ 
        error: 'Failed to create payment intent',
        details: paymentIntent.error 
      });
    }

    res.json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId,
      amount: totalAmount
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ 
      error: 'Internal server error during payment setup' 
    });
  }
});

app.post('/api/payment/process', authenticateToken, async (req, res) => {
  try {
    const { planName, duration, price, paymentIntentId } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!planName || !duration || !price || !paymentIntentId) {
      return res.status(400).json({ 
        error: 'Missing required payment information' 
      });
    }

    // Confirm payment with Stripe
    const paymentResult = await stripeService.confirmPaymentIntent(paymentIntentId);

    if (!paymentResult.success || paymentResult.status !== 'succeeded') {
      return res.status(400).json({ 
        error: 'Payment was not successful',
        details: paymentResult.error || 'Payment failed' 
      });
    }

    // Calculate tax (18% GST)
    const taxRate = 0.18;
    const subtotal = parseFloat(price);
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Create subscription record
    const subscription = new Subscription({
      userId: userId,
      planName: planName,
      duration: duration,
      price: subtotal,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      paymentMethod: 'stripe',
      transactionId: paymentIntentId,
      stripePaymentIntentId: paymentIntentId,
      status: 'active',
      billingCycle: duration === 1 ? 'monthly' : duration === 12 ? 'yearly' : 'custom',
    });

    await subscription.save();

    // Update user's subscription status
    await User.findByIdAndUpdate(userId, {
      subscription: {
        planName: planName,
        status: 'active',
        startDate: subscription.startDate,
        endDate: subscription.endDate
      }
    });

    res.json({
      success: true,
      message: 'Payment processed successfully with Stripe',
      subscription: {
        id: subscription._id,
        planName: subscription.planName,
        duration: subscription.duration,
        totalAmount: subscription.totalAmount,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        transactionId: subscription.transactionId
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      error: 'Internal server error during payment processing' 
    });
  }
});

// Stripe webhook handler
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const webhookResult = await stripeService.handleWebhook(req.body, sig);
    
    if (!webhookResult.success) {
      return res.status(400).send(`Webhook Error: ${webhookResult.error}`);
    }

    const event = webhookResult.event;

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // You can update subscription status here if needed
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Get user subscriptions
app.get('/api/payment/subscriptions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const subscriptions = await Subscription.find({ userId: userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subscriptions: subscriptions.map(sub => ({
        id: sub._id,
        planName: sub.planName,
        duration: sub.duration,
        totalAmount: sub.totalAmount,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        daysRemaining: sub.daysRemaining,
        createdAt: sub.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subscriptions' 
    });
  }
});

// Cancel subscription
app.post('/api/payment/cancel/:subscriptionId', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: userId
    });

    if (!subscription) {
      return res.status(404).json({ 
        error: 'Subscription not found' 
      });
    }

    if (subscription.status === 'cancelled') {
      return res.status(400).json({ 
        error: 'Subscription is already cancelled' 
      });
    }

    // Cancel the subscription
    await subscription.cancel();

    // Update user's subscription status
    await User.findByIdAndUpdate(userId, {
      'subscription.status': 'cancelled'
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: subscription._id,
        status: subscription.status,
        cancelledAt: subscription.cancelledAt
      }
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- POST /api/signup - Create new account`);
  console.log(`- POST /api/login - Login to existing account`);
  console.log(`- GET /api/profile - Get user profile (requires auth)`);
  console.log(`- POST /api/logout - Logout`);
  console.log(`- POST /api/payment/create-intent - Create Stripe payment intent (requires auth)`);
  console.log(`- POST /api/payment/process - Process Stripe payment (requires auth)`);
  console.log(`- GET /api/payment/subscriptions - Get user subscriptions (requires auth)`);
  console.log(`- POST /api/payment/cancel/:id - Cancel subscription (requires auth)`);
  console.log(`- POST /api/payment/webhook - Stripe webhook handler`);
});

module.exports = app;
