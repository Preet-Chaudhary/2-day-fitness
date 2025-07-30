import { evaluate, matrix, multiply, subtract, add, sqrt, transpose } from 'mathjs';

// TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) Model
// for recommending the best fitness plan based on user preferences

export class TopsisRecommendationEngine {
  constructor() {
    // Define fitness plans with their attributes
    this.plans = [
      {
        id: 1,
        name: "BASIC PLAN",
        price: 2500,
        // Attributes: [price_score, intensity, duration, variety, support, accessibility]
        attributes: [8, 3, 2, 3, 4, 8], // Lower price = higher score (inverted)
        features: [
          "2 hours of exercises",
          "Free consultation to coaches", 
          "Access to The Community"
        ],
        suitable_for: ["beginners", "budget_conscious", "casual_fitness"]
      },
      {
        id: 2,
        name: "PREMIUM PLAN",
        price: 3000,
        attributes: [7, 6, 5, 6, 7, 7],
        features: [
          "5 hours of exercises",
          "Free consultation of Coaches",
          "Access to minibar"
        ],
        suitable_for: ["intermediate", "dedicated", "full_experience"]
      },
      {
        id: 3,
        name: "PRO PLAN",
        price: 4500,
        attributes: [5, 9, 8, 8, 9, 6],
        features: [
          "8 hours of exercises",
          "Personal trainer included",
          "Nutrition planning",
          "Advanced equipment access"
        ],
        suitable_for: ["advanced", "professional", "serious_athletes"]
      }
    ];

    // Criteria weights (importance of each attribute)
    // [price_importance, intensity_preference, duration_preference, variety_preference, support_need, accessibility_need]
    this.defaultWeights = [0.2, 0.15, 0.15, 0.15, 0.2, 0.15];
    
    // Beneficial criteria (higher is better) vs Cost criteria (lower is better)
    this.beneficialCriteria = [true, true, true, true, true, true]; // All are beneficial
  }

  // Get user preference weights based on questionnaire responses
  calculateUserWeights(userProfile) {
    const {
      budget_priority = 5,      // 1-10 scale
      intensity_preference = 5, // 1-10 scale  
      time_availability = 5,    // 1-10 scale
      variety_importance = 5,   // 1-10 scale
      support_need = 5,         // 1-10 scale
      convenience_need = 5      // 1-10 scale
    } = userProfile;

    // Normalize preferences to weights (sum should be 1)
    const totalPreference = budget_priority + intensity_preference + time_availability + 
                           variety_importance + support_need + convenience_need;

    return [
      budget_priority / totalPreference,
      intensity_preference / totalPreference,
      time_availability / totalPreference,
      variety_importance / totalPreference,
      support_need / totalPreference,
      convenience_need / totalPreference
    ];
  }

  // Normalize the decision matrix
  normalizeMatrix(decisionMatrix) {
    const numCriteria = decisionMatrix[0].length;
    const normalizedMatrix = [];

    for (let j = 0; j < numCriteria; j++) {
      // Calculate sum of squares for each criterion
      const sumOfSquares = decisionMatrix.reduce((sum, row) => {
        return sum + Math.pow(row[j], 2);
      }, 0);
      
      const denominator = Math.sqrt(sumOfSquares);
      
      // Normalize each element
      for (let i = 0; i < decisionMatrix.length; i++) {
        if (!normalizedMatrix[i]) {
          normalizedMatrix[i] = [];
        }
        normalizedMatrix[i][j] = decisionMatrix[i][j] / denominator;
      }
    }

    return normalizedMatrix;
  }

  // Calculate weighted normalized matrix
  calculateWeightedMatrix(normalizedMatrix, weights) {
    return normalizedMatrix.map(row => 
      row.map((value, j) => value * weights[j])
    );
  }

  // Find ideal best and worst solutions
  findIdealSolutions(weightedMatrix) {
    const numCriteria = weightedMatrix[0].length;
    const idealBest = [];
    const idealWorst = [];

    for (let j = 0; j < numCriteria; j++) {
      const columnValues = weightedMatrix.map(row => row[j]);
      
      if (this.beneficialCriteria[j]) {
        // For beneficial criteria, best is maximum, worst is minimum
        idealBest[j] = Math.max(...columnValues);
        idealWorst[j] = Math.min(...columnValues);
      } else {
        // For cost criteria, best is minimum, worst is maximum
        idealBest[j] = Math.min(...columnValues);
        idealWorst[j] = Math.max(...columnValues);
      }
    }

    return { idealBest, idealWorst };
  }

  // Calculate distance from ideal solutions
  calculateDistances(weightedMatrix, idealSolutions) {
    const { idealBest, idealWorst } = idealSolutions;
    
    return weightedMatrix.map(row => {
      // Distance to ideal best (Si+)
      const distanceToBest = Math.sqrt(
        row.reduce((sum, value, j) => 
          sum + Math.pow(value - idealBest[j], 2), 0
        )
      );

      // Distance to ideal worst (Si-)
      const distanceToWorst = Math.sqrt(
        row.reduce((sum, value, j) => 
          sum + Math.pow(value - idealWorst[j], 2), 0
        )
      );

      return { distanceToBest, distanceToWorst };
    });
  }

  // Calculate TOPSIS scores
  calculateTopsisScores(distances) {
    return distances.map(({ distanceToBest, distanceToWorst }) => {
      // Relative closeness to ideal solution (Ci)
      const score = distanceToWorst / (distanceToBest + distanceToWorst);
      return score;
    });
  }

  // Main TOPSIS recommendation method
  recommendPlan(userProfile = {}) {
    try {
      // Get user-specific weights
      const weights = Object.keys(userProfile).length > 0 
        ? this.calculateUserWeights(userProfile)
        : this.defaultWeights;

      // Create decision matrix from plans
      const decisionMatrix = this.plans.map(plan => plan.attributes);

      // Step 1: Normalize the decision matrix
      const normalizedMatrix = this.normalizeMatrix(decisionMatrix);

      // Step 2: Calculate weighted normalized matrix
      const weightedMatrix = this.calculateWeightedMatrix(normalizedMatrix, weights);

      // Step 3: Find ideal best and worst solutions
      const idealSolutions = this.findIdealSolutions(weightedMatrix);

      // Step 4: Calculate distances to ideal solutions
      const distances = this.calculateDistances(weightedMatrix, idealSolutions);

      // Step 5: Calculate TOPSIS scores
      const scores = this.calculateTopsisScores(distances);

      // Combine plans with their scores and rank them
      const rankedPlans = this.plans.map((plan, index) => ({
        ...plan,
        topsisScore: scores[index],
        rank: 0 // Will be set after sorting
      }));

      // Sort by TOPSIS score (higher is better)
      rankedPlans.sort((a, b) => b.topsisScore - a.topsisScore);

      // Assign ranks
      rankedPlans.forEach((plan, index) => {
        plan.rank = index + 1;
      });

      return {
        success: true,
        recommendedPlan: rankedPlans[0], // Best plan
        allPlansRanked: rankedPlans,
        explanation: this.generateExplanation(rankedPlans[0], userProfile),
        confidence: rankedPlans[0].topsisScore,
        userWeights: weights
      };

    } catch (error) {
      console.error('TOPSIS Recommendation Error:', error);
      return {
        success: false,
        error: 'Failed to generate recommendation',
        recommendedPlan: this.plans[0] // Default to basic plan
      };
    }
  }

  // Generate explanation for the recommendation
  generateExplanation(recommendedPlan, userProfile) {
    const explanations = [];
    
    if (userProfile.budget_priority >= 7) {
      explanations.push("prioritizes cost-effectiveness");
    }
    
    if (userProfile.intensity_preference >= 7) {
      explanations.push("seeks high-intensity training");
    }
    
    if (userProfile.time_availability >= 7) {
      explanations.push("has flexible time availability");
    }
    
    if (userProfile.support_need >= 7) {
      explanations.push("values professional support");
    }

    const baseExplanation = `Based on your preferences${explanations.length > 0 ? ' that ' + explanations.join(', ') : ''}, `;
    
    const planSpecificReasons = {
      "BASIC PLAN": "the Basic Plan offers excellent value for money with essential features perfect for getting started.",
      "PREMIUM PLAN": "the Premium Plan provides the ideal balance of features, support, and value for dedicated fitness enthusiasts.",
      "PRO PLAN": "the Pro Plan delivers maximum intensity, professional support, and comprehensive features for serious athletes."
    };

    return baseExplanation + (planSpecificReasons[recommendedPlan.name] || "this plan best matches your requirements.");
  }

  // Quick recommendation based on user type
  getQuickRecommendation(userType) {
    const quickProfiles = {
      'beginner': {
        budget_priority: 8,
        intensity_preference: 3,
        time_availability: 4,
        variety_importance: 5,
        support_need: 7,
        convenience_need: 8
      },
      'intermediate': {
        budget_priority: 5,
        intensity_preference: 6,
        time_availability: 6,
        variety_importance: 7,
        support_need: 6,
        convenience_need: 6
      },
      'advanced': {
        budget_priority: 3,
        intensity_preference: 9,
        time_availability: 8,
        variety_importance: 8,
        support_need: 9,
        convenience_need: 4
      },
      'budget_conscious': {
        budget_priority: 9,
        intensity_preference: 4,
        time_availability: 5,
        variety_importance: 4,
        support_need: 5,
        convenience_need: 7
      },
      'time_limited': {
        budget_priority: 6,
        intensity_preference: 7,
        time_availability: 3,
        variety_importance: 6,
        support_need: 6,
        convenience_need: 9
      }
    };

    const profile = quickProfiles[userType] || quickProfiles['beginner'];
    return this.recommendPlan(profile);
  }
}

// Export singleton instance
export const topsisEngine = new TopsisRecommendationEngine();
