import React, { useState } from 'react';
import { topsisEngine } from '../../services/topsisRecommendation';
import { useAuth } from '../../context/AuthContext';
import './RecommendationModal.css';

const RecommendationModal = ({ isOpen, onClose, onPlanSelected }) => {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState('questionnaire'); // 'questionnaire', 'results'
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [userProfile, setUserProfile] = useState({
    budget_priority: 5,
    intensity_preference: 5,
    time_availability: 5,
    variety_importance: 5,
    support_need: 5,
    convenience_need: 5
  });

  const handleSliderChange = (key, value) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
  };

  const handleQuickSelection = (userType) => {
    setLoading(true);
    setTimeout(() => {
      const result = topsisEngine.getQuickRecommendation(userType);
      setRecommendation(result);
      setStep('results');
      setLoading(false);
    }, 1000);
  };

  const handleDetailedAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const result = topsisEngine.recommendPlan(userProfile);
      setRecommendation(result);
      setStep('results');
      setLoading(false);
    }, 1500);
  };

  const handleSelectPlan = (plan) => {
    onPlanSelected(plan);
    onClose();
  };

  const resetModal = () => {
    setStep('questionnaire');
    setRecommendation(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const renderQuestionnaire = () => (
    <div className="recommendation-content">
      <h2>🤖 AI Plan Recommendation</h2>
      <p>Let our ML-powered TOPSIS algorithm find the perfect fitness plan for you!</p>

      {/* Quick Selection */}
      <div className="quick-selection">
        <h3>Quick Recommendations</h3>
        <div className="quick-buttons">
          <button 
            className="quick-btn beginner"
            onClick={() => handleQuickSelection('beginner')}
            disabled={loading}
          >
            🌟 Beginner Friendly
            <span>New to fitness</span>
          </button>
          <button 
            className="quick-btn intermediate"
            onClick={() => handleQuickSelection('intermediate')}
            disabled={loading}
          >
            💪 Intermediate
            <span>Some experience</span>
          </button>
          <button 
            className="quick-btn advanced"
            onClick={() => handleQuickSelection('advanced')}
            disabled={loading}
          >
            🔥 Advanced
            <span>Serious athlete</span>
          </button>
        </div>
        <div className="quick-buttons">
          <button 
            className="quick-btn budget"
            onClick={() => handleQuickSelection('budget_conscious')}
            disabled={loading}
          >
            💰 Budget Focused
            <span>Best value</span>
          </button>
          <button 
            className="quick-btn time"
            onClick={() => handleQuickSelection('time_limited')}
            disabled={loading}
          >
            ⏰ Time Limited
            <span>Busy schedule</span>
          </button>
        </div>
      </div>

      <div className="divider">
        <span>OR</span>
      </div>

      {/* Detailed Questionnaire */}
      <div className="detailed-questionnaire">
        <h3>Detailed Analysis</h3>
        <p>Answer these questions for a personalized recommendation:</p>

        <div className="question-group">
          <label>How important is budget/price to you?</label>
          <div className="slider-container">
            <span>Not Important</span>
            <input
              type="range"
              min="1"
              max="10"
              value={userProfile.budget_priority}
              onChange={(e) => handleSliderChange('budget_priority', e.target.value)}
              className="slider"
            />
            <span>Very Important</span>
          </div>
          <div className="slider-value">{userProfile.budget_priority}/10</div>
        </div>

        <div className="question-group">
          <label>What intensity level do you prefer?</label>
          <div className="slider-container">
            <span>Light</span>
            <input
              type="range"
              min="1"
              max="10"
              value={userProfile.intensity_preference}
              onChange={(e) => handleSliderChange('intensity_preference', e.target.value)}
              className="slider"
            />
            <span>Intense</span>
          </div>
          <div className="slider-value">{userProfile.intensity_preference}/10</div>
        </div>

        <div className="question-group">
          <label>How much time can you dedicate?</label>
          <div className="slider-container">
            <span>Limited</span>
            <input
              type="range"
              min="1"
              max="10"
              value={userProfile.time_availability}
              onChange={(e) => handleSliderChange('time_availability', e.target.value)}
              className="slider"
            />
            <span>Flexible</span>
          </div>
          <div className="slider-value">{userProfile.time_availability}/10</div>
        </div>

        <div className="question-group">
          <label>How important is exercise variety?</label>
          <div className="slider-container">
            <span>Don't Mind</span>
            <input
              type="range"
              min="1"
              max="10"
              value={userProfile.variety_importance}
              onChange={(e) => handleSliderChange('variety_importance', e.target.value)}
              className="slider"
            />
            <span>Love Variety</span>
          </div>
          <div className="slider-value">{userProfile.variety_importance}/10</div>
        </div>

        <div className="question-group">
          <label>How much professional support do you need?</label>
          <div className="slider-container">
            <span>Self-Guided</span>
            <input
              type="range"
              min="1"
              max="10"
              value={userProfile.support_need}
              onChange={(e) => handleSliderChange('support_need', e.target.value)}
              className="slider"
            />
            <span>Need Guidance</span>
          </div>
          <div className="slider-value">{userProfile.support_need}/10</div>
        </div>

        <div className="question-group">
          <label>How important is convenience/accessibility?</label>
          <div className="slider-container">
            <span>Not Important</span>
            <input
              type="range"
              min="1"
              max="10"
              value={userProfile.convenience_need}
              onChange={(e) => handleSliderChange('convenience_need', e.target.value)}
              className="slider"
            />
            <span>Very Important</span>
          </div>
          <div className="slider-value">{userProfile.convenience_need}/10</div>
        </div>

        <button 
          className="analyze-btn"
          onClick={handleDetailedAnalysis}
          disabled={loading}
        >
          {loading ? '🧠 Analyzing...' : '🎯 Get My Recommendation'}
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="recommendation-results">
      <div className="results-header">
        <h2>🎯 Your Perfect Plan</h2>
        {recommendation?.success && (
          <div className="confidence-score">
            <span>Confidence: {Math.round(recommendation.confidence * 100)}%</span>
          </div>
        )}
      </div>

      {recommendation?.success ? (
        <>
          {/* Recommended Plan */}
          <div className="recommended-plan">
            <div className="plan-card recommended">
              <div className="plan-badge">🏆 RECOMMENDED</div>
              <h3>{recommendation.recommendedPlan.name}</h3>
              <div className="plan-price">₹{recommendation.recommendedPlan.price}<span>/month</span></div>
              <div className="plan-score">
                <span>TOPSIS Score: {(recommendation.recommendedPlan.topsisScore * 100).toFixed(1)}%</span>
              </div>
              <ul className="plan-features">
                {recommendation.recommendedPlan.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <div className="explanation">
                <p><strong>Why this plan?</strong></p>
                <p>{recommendation.explanation}</p>
              </div>
              <button 
                className="select-plan-btn"
                onClick={() => handleSelectPlan(recommendation.recommendedPlan)}
              >
                {isAuthenticated ? 'Select This Plan' : 'Login to Select'}
              </button>
            </div>
          </div>

          {/* All Plans Ranking */}
          <div className="all-plans-ranking">
            <h3>Complete Ranking</h3>
            <div className="ranking-list">
              {recommendation.allPlansRanked.map((plan, index) => (
                <div key={plan.id} className={`ranking-item ${index === 0 ? 'best' : ''}`}>
                  <div className="rank">#{plan.rank}</div>
                  <div className="plan-info">
                    <span className="plan-name">{plan.name}</span>
                    <span className="plan-price">₹{plan.price}</span>
                  </div>
                  <div className="score">
                    {(plan.topsisScore * 100).toFixed(1)}%
                  </div>
                  <button 
                    className="select-btn-small"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Details */}
          <div className="analysis-details">
            <h4>Analysis Details</h4>
            <div className="weights-breakdown">
              <p><strong>Your Preference Weights:</strong></p>
              <div className="weight-items">
                <span>Budget: {(recommendation.userWeights[0] * 100).toFixed(0)}%</span>
                <span>Intensity: {(recommendation.userWeights[1] * 100).toFixed(0)}%</span>
                <span>Time: {(recommendation.userWeights[2] * 100).toFixed(0)}%</span>
                <span>Variety: {(recommendation.userWeights[3] * 100).toFixed(0)}%</span>
                <span>Support: {(recommendation.userWeights[4] * 100).toFixed(0)}%</span>
                <span>Convenience: {(recommendation.userWeights[5] * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="error-message">
          <p>Sorry, we couldn't generate a recommendation. Please try again.</p>
          <button onClick={() => setStep('questionnaire')}>Try Again</button>
        </div>
      )}

      <div className="results-actions">
        <button className="back-btn" onClick={() => setStep('questionnaire')}>
          ← New Analysis
        </button>
      </div>
    </div>
  );

  return (
    <div className="recommendation-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="recommendation-modal">
        <div className="modal-header">
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="ai-animation">
              <div className="brain">🧠</div>
              <div className="processing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <h3>AI is analyzing your preferences...</h3>
            <p>Using TOPSIS algorithm to find your perfect plan</p>
          </div>
        ) : (
          <>
            {step === 'questionnaire' && renderQuestionnaire()}
            {step === 'results' && renderResults()}
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationModal;
