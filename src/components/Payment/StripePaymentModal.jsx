import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext';
import { paymentAPI } from '../../services/paymentAPI';
import { STRIPE_CONFIG } from '../../config/stripe';
import './Payment.css';

// Load Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

const StripePaymentModal = ({ isOpen, onClose, plan, onPaymentComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('details'); // 'details', 'payment', 'processing', 'success'
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (isOpen) {
      initializeStripe();
    }
  }, [isOpen]);

  const initializeStripe = async () => {
    const stripeInstance = await stripePromise;
    setStripe(stripeInstance);
  };

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const validatePaymentData = () => {
    if (!paymentData.email || !paymentData.name || !paymentData.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paymentData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(paymentData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  const proceedToPayment = async () => {
    if (!validatePaymentData()) return;

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const intentResponse = await paymentAPI.createPaymentIntent({
        planName: plan.name,
        duration: 1, // Default to 1 month
        price: plan.price
      });

      if (intentResponse.success) {
        setPaymentIntent(intentResponse);
        setStep('payment');
        
        // Initialize Stripe Elements for card input
        setTimeout(() => {
          setupStripeElements(intentResponse.clientSecret);
        }, 100);
      } else {
        setError(intentResponse.error || 'Failed to setup payment');
      }
    } catch (err) {
      setError(err.error || 'Failed to setup payment');
    } finally {
      setLoading(false);
    }
  };

  const setupStripeElements = (clientSecret) => {
    if (!stripe) return;

    const elementsInstance = stripe.elements({
      clientSecret: clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#ff8c00',
          colorBackground: '#ffffff',
          colorText: '#30313d',
          colorDanger: '#df1b41',
          fontFamily: 'Ideal Sans, system-ui, sans-serif',
          spacingUnit: '2px',
          borderRadius: '4px',
        }
      }
    });

    const cardElementOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    };

    const card = elementsInstance.create('card', cardElementOptions);
    card.mount('#card-element');
    
    setElements(elementsInstance);
    setCardElement(card);
  };

  const processPayment = async () => {
    if (!stripe || !elements || !cardElement || !paymentIntent) {
      setError('Payment setup incomplete');
      return;
    }

    setLoading(true);
    setError('');
    setStep('processing');

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: paymentData.name,
              email: paymentData.email,
              phone: paymentData.phone,
              address: {
                line1: paymentData.address,
                city: paymentData.city,
                state: paymentData.state,
                postal_code: paymentData.pincode,
                country: 'IN',
              },
            },
          },
        }
      );

      if (error) {
        setError(error.message);
        setStep('payment');
      } else if (confirmedPayment.status === 'succeeded') {
        // Process the payment on our backend
        const backendResponse = await paymentAPI.processPayment({
          planName: plan.name,
          duration: 1,
          price: plan.price,
          paymentIntentId: confirmedPayment.id
        });

        if (backendResponse.success) {
          setStep('success');
          
          // Call parent success handler after a delay
          setTimeout(() => {
            onPaymentComplete(backendResponse);
          }, 2000);
        } else {
          setError(backendResponse.error || 'Payment verification failed');
          setStep('payment');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.error || err.message || 'Payment failed. Please try again.');
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && step !== 'processing') {
      onClose();
    }
  };

  const resetModal = () => {
    setStep('details');
    setError('');
    setPaymentIntent(null);
    setCardElement(null);
    setElements(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <div className="payment-step">
            <h3>Billing Details</h3>
            <div className="plan-summary">
              <h4>{plan.name}</h4>
              <div className="plan-price">₹{plan.price}<span>/month</span></div>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <form className="payment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={paymentData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={paymentData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={paymentData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={paymentData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={paymentData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={paymentData.pincode}
                    onChange={handleInputChange}
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </form>
            
            <div className="payment-actions">
              <button className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={proceedToPayment}
                disabled={loading}
              >
                {loading ? 'Setting up...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="payment-step">
            <h3>Payment Information</h3>
            <div className="plan-summary-compact">
              <span>{plan.name}</span>
              <span>₹{plan.price}</span>
            </div>
            
            <div className="stripe-card-section">
              <label>Card Information</label>
              <div id="card-element" className="stripe-card-element">
                {/* Stripe card element will be mounted here */}
              </div>
            </div>
            
            <div className="payment-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{plan.price}</span>
              </div>
              <div className="summary-row">
                <span>GST (18%):</span>
                <span>₹{Math.round(plan.price * 0.18)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{parseInt(plan.price) + Math.round(plan.price * 0.18)}</span>
              </div>
            </div>
            
            <div className="payment-actions">
              <button className="btn-secondary" onClick={() => setStep('details')}>
                Back
              </button>
              <button 
                className="btn-primary" 
                onClick={processPayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ₹${parseInt(plan.price) + Math.round(plan.price * 0.18)}`}
              </button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="payment-step processing">
            <div className="processing-animation">
              <div className="spinner"></div>
            </div>
            <h3>Processing Payment</h3>
            <p>Please wait while we process your payment...</p>
            <p>Do not close this window.</p>
          </div>
        );

      case 'success':
        return (
          <div className="payment-step success">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>Welcome to {plan.name}! Your subscription is now active.</p>
            <div className="success-details">
              <p>You will receive a confirmation email shortly.</p>
              <p>You can now access all premium features.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={handleOverlayClick}>
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Complete Your Purchase</h2>
          {step !== 'processing' && step !== 'success' && (
            <button className="close-btn" onClick={handleClose}>×</button>
          )}
        </div>
        
        <div className="payment-progress">
          <div className={`progress-step ${step === 'details' ? 'active' : step !== 'details' ? 'completed' : ''}`}>
            <span>1</span> Details
          </div>
          <div className={`progress-step ${step === 'payment' ? 'active' : step === 'processing' || step === 'success' ? 'completed' : ''}`}>
            <span>2</span> Payment
          </div>
          <div className={`progress-step ${step === 'processing' ? 'active' : step === 'success' ? 'completed' : ''}`}>
            <span>3</span> Processing
          </div>
          <div className={`progress-step ${step === 'success' ? 'active' : ''}`}>
            <span>4</span> Complete
          </div>
        </div>
        
        <div className="payment-content">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}
          
          {renderStepContent()}
        </div>
        
        <div className="payment-footer">
          <div className="stripe-badge">
            <span>Secured by</span>
            <strong>Stripe</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
