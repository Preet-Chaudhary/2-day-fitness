import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./plans.css";
import { plansData } from "./fixedData/plansData";
import whiteTick from "../assets/whiteTick.png";
import StripePaymentModal from "../components/Payment/StripePaymentModal";
import AuthModal from "../components/Auth/AuthModal";
const Plans = () => {
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleJoinPlan = (plan) => {
    if (!isAuthenticated) {
      // User not logged in - show auth modal
      setShowAuthModal(true);
      return;
    }
    
    // User logged in - proceed to payment
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (paymentResult) => {
    console.log('Payment completed:', paymentResult);
    setShowPaymentModal(false);
    setSelectedPlan(null);
    // Here you can add success notification or redirect
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful login, user can retry selecting a plan
  };
  return (
    <div className="planscon">
      <div className="blur blur-p"></div>
      <div className="pro-head">
        <span className="stroke-text">Ready </span>
        <span>To </span>
        <span className="stroke-text">Join Us</span>
      </div>
      <div className="pcards">
        {plansData.map((prop, i) => (
          <div className="plan" key={i}>
            {prop.icon}
            <span>{prop.name}</span>
            <span>₹ {prop.price}</span>
            <div className="features">
              {prop.features.map((feature, i) => (
                <div className="feature" key={i}>
                  <img src={whiteTick} alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div>
              <span>See More Benefits</span>
            </div>
            <button 
              className="btn"
              onClick={() => handleJoinPlan(prop)}
            >
              Join now
            </button>
          </div>
        ))}
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />

      {/* Payment Modal */}
      <StripePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default Plans;
