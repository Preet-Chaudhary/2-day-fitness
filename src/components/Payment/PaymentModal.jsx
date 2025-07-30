import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentAPI } from '../../services/paymentAPI';
import './Payment.css';

const PaymentModal = ({ isOpen, onClose, plan, onPaymentComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('details'); // 'details', 'payment', 'processing', 'success'
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });

  if (!isOpen || !plan) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const validatePaymentData = () => {
    if (!paymentData.cardNumber.replace(/\s/g, '') || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (!paymentData.cvv || paymentData.cvv.length !== 3) {
      setError('Please enter a valid 3-digit CVV');
      return false;
    }
    
    if (!paymentData.cardName.trim()) {
      setError('Please enter the cardholder name');
      return false;
    }

    // Validate billing address
    const { street, city, state, zipCode } = paymentData.billingAddress;
    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      setError('Please fill in all billing address fields');
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validatePaymentData()) return;

    setLoading(true);
    setError('');
    setStep('processing');

    try {
      const paymentResult = await paymentAPI.processPayment({
        planName: plan.name,
        duration: 1, // Default to 1 month, you can make this configurable
        price: plan.price,
        paymentMethod: 'card',
        cardDetails: {
          number: paymentData.cardNumber,
          expiry: paymentData.expiryDate,
          cvv: paymentData.cvv,
          name: paymentData.cardName
        }
      });

      if (paymentResult.success) {
        setStep('success');
        
        // Call parent success handler after a delay
        setTimeout(() => {
          onPaymentComplete(paymentResult);
        }, 2000);
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
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

  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <div className="payment-step">
            <h3>Plan Details</h3>
            <div className="plan-summary">
              <div className="plan-info">
                <h4>{plan.name}</h4>
                <div className="plan-price">₹{plan.price}<span>/month</span></div>
                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="user-info">
                <h4>Subscriber Details</h4>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
            <button 
              className="payment-btn primary"
              onClick={() => setStep('payment')}
            >
              Proceed to Payment
            </button>
          </div>
        );

      case 'payment':
        return (
          <div className="payment-step">
            <h3>Payment Information</h3>
            <form onSubmit={handlePayment}>
              <div className="payment-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formatCardNumber(paymentData.cardNumber)}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      if (formatted.replace(/\s/g, '').length <= 16) {
                        handleInputChange({
                          target: { name: 'cardNumber', value: formatted }
                        });
                      }
                    }}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        if (formatted.length <= 5) {
                          handleInputChange({
                            target: { name: 'expiryDate', value: formatted }
                          });
                        }
                      }}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => {
                        if (e.target.value.length <= 3 && /^\d*$/.test(e.target.value)) {
                          handleInputChange(e);
                        }
                      }}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name as on card"
                    value={paymentData.cardName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <h4>Billing Address</h4>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="billing.street"
                    placeholder="123 Main Street"
                    value={paymentData.billingAddress.street}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="billing.city"
                      placeholder="City"
                      value={paymentData.billingAddress.city}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="billing.state"
                      placeholder="State"
                      value={paymentData.billingAddress.state}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="billing.zipCode"
                      placeholder="ZIP Code"
                      value={paymentData.billingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      name="billing.country"
                      value={paymentData.billingAddress.country}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="payment-total">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>₹{plan.price}</span>
                </div>
                <div className="total-line">
                  <span>GST (18%):</span>
                  <span>₹{Math.round(plan.price * 0.18)}</span>
                </div>
                <div className="total-line total">
                  <span>Total:</span>
                  <span>₹{parseInt(plan.price) + Math.round(plan.price * 0.18)}</span>
                </div>
              </div>

              <div className="payment-actions">
                <button 
                  type="button"
                  className="payment-btn secondary"
                  onClick={() => setStep('details')}
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="payment-btn primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay ₹${parseInt(plan.price) + Math.round(plan.price * 0.18)}`}
                </button>
              </div>
            </form>
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
            <p className="processing-note">Do not close this window</p>
          </div>
        );

      case 'success':
        return (
          <div className="payment-step success">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>Welcome to {plan.name}! Your subscription is now active.</p>
            <p>A confirmation email has been sent to {user.email}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={handleOverlayClick}>
      <div className="payment-modal">
        {step !== 'processing' && step !== 'success' && (
          <button className="payment-close-button" onClick={onClose}>
            ×
          </button>
        )}
        
        <div className="payment-progress">
          <div className={`progress-step ${step === 'details' ? 'active' : step !== 'details' ? 'completed' : ''}`}>
            <span>1</span>
            <label>Details</label>
          </div>
          <div className={`progress-step ${step === 'payment' ? 'active' : step === 'processing' || step === 'success' ? 'completed' : ''}`}>
            <span>2</span>
            <label>Payment</label>
          </div>
          <div className={`progress-step ${step === 'processing' || step === 'success' ? 'active' : ''}`}>
            <span>3</span>
            <label>Complete</label>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
};

export default PaymentModal;
