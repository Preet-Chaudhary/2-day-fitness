import React, { useState } from "react";
import "./programs.css";
import { programsData } from './fixedData/programsData';
import rightArrow from '../assets/rightArrow.png';
import RecommendationModal from '../components/Recommendation/RecommendationModal';
import { useAuth } from "../context/AuthContext";
import StripePaymentModal from "../components/Payment/StripePaymentModal";
import AuthModal from "../components/Auth/AuthModal";
const Programs = () => {
  const { isAuthenticated } = useAuth();
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelected = (plan) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setShowRecommendationModal(false);
  };

  const handlePaymentComplete = (paymentResult) => {
    console.log('Payment completed:', paymentResult);
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="programs" id="program">
      <div className="pro-head">
        <span className="stroke-text">Explore our </span>
        <span>Programs </span>
        <span className="stroke-text">to shape you</span>
      </div>

      {/* AI Recommendation Button */}
      <div className="ai-recommendation-section">
        <button 
          className="ai-recommendation-btn"
          onClick={() => setShowRecommendationModal(true)}
        >
          <span className="ai-icon">🤖</span>
          <div className="ai-text">
            <h3>AI Plan Recommendation</h3>
            <p>Let our ML TOPSIS algorithm find the perfect plan for you!</p>
          </div>
          <span className="ai-arrow">→</span>
        </button>
      </div>

      <div className="pcategory">
        {programsData.map(prop => (
          <div className="cat" key={prop.heading}>
            {prop.icons}
            <span>{prop.heading}</span>
            <span>{prop.details}</span>
            <div className="join">
              <span>Join Now</span>
              <img src={rightArrow} alt="" />
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Modal */}
      <RecommendationModal
        isOpen={showRecommendationModal}
        onClose={() => setShowRecommendationModal(false)}
        onPlanSelected={handlePlanSelected}
      />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
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

export default Programs;
