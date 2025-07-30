const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Plan details
  planName: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in months
    required: true
  },
  
  // Payment information
  price: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'razorpay', 'paypal', 'bank_transfer', 'cash']
  },
  transactionId: {
    type: String,
    required: true
  },
  
  // Stripe-specific fields
  stripePaymentIntentId: {
    type: String,
    sparse: true // Only for Stripe payments
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true // Only for recurring Stripe subscriptions
  },
  stripeCustomerId: {
    type: String,
    sparse: true // Stripe customer ID
  },
  
  // Subscription lifecycle
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'pending', 'failed'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'custom'],
    default: 'monthly'
  },
  
  // Cancellation details
  cancelledAt: {
    type: Date,
    default: null
  },
  cancellationReason: {
    type: String,
    default: null
  },
  
  // Usage tracking
  usageTracking: {
    sessionsUsed: {
      type: Number,
      default: 0
    },
    lastAccessed: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for efficient queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ stripePaymentIntentId: 1 });
subscriptionSchema.index({ endDate: 1 });

// Virtual for days remaining
subscriptionSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate || this.status !== 'active') return 0;
  
  const now = new Date();
  const diffTime = this.endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

// Pre-save middleware to calculate end date
subscriptionSchema.pre('save', function(next) {
  if (this.isNew && !this.endDate) {
    const startDate = this.startDate || new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + this.duration);
    this.endDate = endDate;
  }
  next();
});

// Instance method to cancel subscription
subscriptionSchema.methods.cancel = function(reason = 'User requested') {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  return this.save();
};

// Instance method to renew subscription
subscriptionSchema.methods.renew = function(duration) {
  if (this.status === 'active') {
    // Extend current subscription
    const newEndDate = new Date(this.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + duration);
    this.endDate = newEndDate;
  } else {
    // Reactivate subscription
    this.status = 'active';
    this.startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);
    this.endDate = endDate;
    this.cancelledAt = null;
    this.cancellationReason = null;
  }
  return this.save();
};

// Static method to find active subscriptions
subscriptionSchema.statics.findActiveSubscriptions = function(userId) {
  return this.find({
    userId: userId,
    status: 'active',
    endDate: { $gt: new Date() }
  });
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
