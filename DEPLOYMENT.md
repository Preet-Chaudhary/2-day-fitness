# Complete Deployment Guide for 2-Day Fitness Website

## Overview
This guide will help you deploy your complete full-stack fitness website with:
- Frontend: React + Vite (Netlify)
- Backend: Node.js + Express (Render/Railway)
- Database: MongoDB Atlas
- Payments: Stripe

## Prerequisites
- GitHub account
- Netlify account
- Render/Railway account (for backend)
- MongoDB Atlas account
- Stripe account

## Step 1: Deploy Backend (API Server)

### Option A: Deploy to Render (Recommended)
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account
3. Click "New +" → "Web Service"
4. Connect your repository and select the `backend` folder
5. Configure:
   - **Name**: `2day-fitness-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Branch**: `main`

### Option B: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js and deploy

### Environment Variables for Backend
Set these in your hosting platform:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/2day-fitness
JWT_SECRET=your-super-secure-jwt-secret-key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-app-name.netlify.app
```

## Step 2: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Add your hosting platform's IP to Network Access (or use 0.0.0.0/0 for all IPs)

## Step 3: Configure Stripe
1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your publishable key (starts with pk_)
3. Get your secret key (starts with sk_)
4. Set up webhooks pointing to your backend URL: `https://your-backend-url.onrender.com/api/payments/webhook`

## Step 4: Update Frontend Configuration
1. In Netlify, go to Site Settings → Environment Variables
2. Add these variables:

```env
VITE_API_URL=https://your-backend-app.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

## Step 5: Deploy Frontend to Netlify
1. Your frontend is already on Netlify
2. Update the environment variables in Netlify dashboard
3. Trigger a new deploy to pick up the new variables

## Step 6: Test the Complete Application
1. Visit your Netlify URL
2. Test user registration/login
3. Test AI plan recommendations
4. Test Stripe payments
5. Verify all navigation works

## Monitoring and Maintenance
- Monitor your backend logs in Render/Railway dashboard
- Set up error tracking (optional: Sentry)
- Monitor Stripe payments in Stripe dashboard
- Check MongoDB Atlas for database health

## Security Checklist
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Netlify/Render)
- [ ] Set proper CORS origins
- [ ] Use strong JWT secrets
- [ ] Enable Stripe webhook signatures
- [ ] Restrict MongoDB network access

## Troubleshooting
- **CORS Errors**: Check CORS_ORIGIN in backend environment
- **Payment Issues**: Verify Stripe keys and webhook URL
- **Database Connection**: Check MongoDB Atlas network access
- **Build Failures**: Check logs in hosting platform dashboard

## Costs (Approximate)
- Netlify: Free tier (100GB bandwidth)
- Render: Free tier (750 hours/month)
- MongoDB Atlas: Free tier (512MB storage)
- Stripe: Pay per transaction (2.9% + 30¢)

Total: $0/month for moderate usage
