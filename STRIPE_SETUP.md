# Stripe Integration Setup Guide

## 🚀 Complete Stripe Payment Integration

Your fitness app now uses **Stripe** for secure payment processing instead of simulation! Here's how to set it up:

## 📋 What's Been Implemented

### Backend (Express.js + Stripe)
- ✅ Stripe service for payment processing
- ✅ Payment intent creation and confirmation
- ✅ Webhook handling for payment events
- ✅ MongoDB integration for subscription tracking
- ✅ Comprehensive error handling

### Frontend (React + Stripe Elements)
- ✅ Stripe payment modal with card elements
- ✅ Multi-step payment flow (Details → Payment → Processing → Success)
- ✅ Real-time form validation
- ✅ Responsive design with orange theme
- ✅ Secure payment form with Stripe Elements

## 🔧 Setup Instructions

### 1. Get Your Stripe Keys

1. **Create a Stripe Account** (if you don't have one):
   - Visit [https://stripe.com](https://stripe.com)
   - Click "Start now" and create your account

2. **Get Your API Keys**:
   - Log into your Stripe Dashboard
   - Go to **Developers** → **API keys**
   - Copy your keys:
     - **Publishable key** (starts with `pk_test_`)
     - **Secret key** (starts with `sk_test_`)

### 2. Configure Backend (.env file)

Update your `backend/.env` file:

```env
# Existing configuration
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
MONGODB_URI=mongodb://localhost:27017/2day-fitness
NODE_ENV=development

# Stripe Configuration - REPLACE WITH YOUR ACTUAL KEYS
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Configure Frontend

Update `src/config/stripe.js`:

```javascript
export const STRIPE_CONFIG = {
  // Replace with your actual Stripe publishable key
  publishableKey: 'pk_test_your_actual_stripe_publishable_key_here',
  
  options: {
    locale: 'en'
  }
};
```

### 4. Set Up Webhooks (Optional but Recommended)

1. **In Stripe Dashboard**:
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - URL: `http://your-domain.com/api/payment/webhook`
   - Events: Select `payment_intent.succeeded` and `payment_intent.payment_failed`

2. **Copy the webhook secret** and add it to your `.env` file

## 🧪 Testing Your Integration

### Test Card Numbers (Stripe provides these for testing):

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

### Testing Flow:

1. **Start your servers**:
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend  
   cd ..
   npm run dev
   ```

2. **Test the payment flow**:
   - Go to your fitness app
   - Click "Join now" on any plan
   - Login/signup if needed
   - Fill in billing details
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

3. **Check results**:
   - Payment should succeed
   - Check Stripe Dashboard for payment records
   - Check MongoDB for subscription records

## 🔒 Security Features

- ✅ **PCI Compliance**: Stripe handles all card data
- ✅ **Tokenization**: No card details stored on your servers
- ✅ **Webhook Verification**: Secure event handling
- ✅ **HTTPS Required**: For production (Stripe requirement)

## 🌐 Going Live

### When ready for production:

1. **Switch to Live Keys**:
   - Get live keys from Stripe Dashboard
   - Keys will start with `pk_live_` and `sk_live_`
   - Update both `.env` and `stripe.js`

2. **Enable HTTPS**:
   - Required for live Stripe payments
   - Use SSL certificate on your domain

3. **Update Webhook URL**:
   - Point to your live domain
   - Update in Stripe Dashboard

## 📊 New API Endpoints

Your backend now has these Stripe endpoints:

```
POST /api/payment/create-intent  - Create Stripe payment intent
POST /api/payment/process        - Process Stripe payment
GET  /api/payment/subscriptions  - Get user subscriptions
POST /api/payment/cancel/:id     - Cancel subscription
POST /api/payment/webhook        - Stripe webhook handler
```

## 🎯 Benefits of Stripe Integration

- **Real Payment Processing**: No more simulation
- **International Support**: Accept cards globally
- **Advanced Features**: Subscriptions, refunds, analytics
- **Mobile Optimized**: Works on all devices
- **Indian Payment Methods**: UPI, wallets (with additional setup)
- **Compliance**: PCI DSS Level 1 certified

## 🚨 Important Notes

1. **Never commit real Stripe keys** to version control
2. **Use test keys** during development
3. **Test thoroughly** before going live
4. **Monitor payments** in Stripe Dashboard
5. **Set up proper error logging** for production

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid API Key"**:
   - Check your `.env` file has correct keys
   - Restart your backend server

2. **Card Declined**:
   - Use Stripe test card numbers
   - Check card details are correctly entered

3. **Payment Intent Failed**:
   - Check backend logs
   - Verify MongoDB is running
   - Check network connectivity

### Getting Help:

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- Check browser console for errors
- Check backend server logs

## 🎉 You're All Set!

Your fitness app now has professional-grade payment processing with Stripe! Users can securely purchase plans with real credit/debit cards.

---

**Next Steps**: Test the payment flow thoroughly, then get your live Stripe keys when ready to launch! 🚀
