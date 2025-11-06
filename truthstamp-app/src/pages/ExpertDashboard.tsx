import React, { useState, useEffect } from 'react';
import { registerExpert, isExpert, getExpert, submitReview } from '../utils/contracts';
import './ExpertDashboard.css';

interface ExpertDashboardProps {
  walletAddress: string | null;
}

interface ExpertProfile {
  address: string;
  name: string;
  bio: string;
  expertise_categories: string[];
  staked_amount: string;
  expert_level: string;
  reputation_points: number;
  reputation_level: string;
  total_reviews: number;
  correct_reviews: number;
  total_earnings: string;
  registered_at: number;
}

const ExpertDashboard: React.FC<ExpertDashboardProps> = ({ walletAddress }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expertTier, setExpertTier] = useState<'general' | 'specialized' | 'professional'>('general');
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<'True' | 'False'>('True');
  const [confidence, setConfidence] = useState(50);
  const [reasoning, setReasoning] = useState('');
  const [reviewStake, setReviewStake] = useState('10');

  useEffect(() => {
    checkExpertStatus();
  }, [walletAddress]);

  const checkExpertStatus = async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      console.log('Checking expert status for:', walletAddress);
      const registered = await isExpert(walletAddress);
      setIsRegistered(registered);

      if (registered) {
        const profile = await getExpert(walletAddress);
        if (profile) {
          setExpertProfile(profile);
        }
      }
    } catch (error) {
      console.error('Error checking expert status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStakeAmount = (): bigint => {
    switch (expertTier) {
      case 'professional':
        return BigInt(10_000_000_000); // 1000 XLM in stroops
      case 'specialized':
        return BigInt(5_000_000_000); // 500 XLM in stroops
      case 'general':
      default:
        return BigInt(1_000_000_000); // 100 XLM in stroops
    }
  };

  const getStakeDisplay = (): string => {
    switch (expertTier) {
      case 'professional':
        return '1000';
      case 'specialized':
        return '500';
      case 'general':
      default:
        return '100';
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (!name || !bio || selectedCategories.length === 0) {
      alert('Please fill in all fields and select at least one expertise category');
      return;
    }

    try {
      setLoading(true);
      console.log('Registering expert with:', {
        name,
        bio,
        categories: selectedCategories,
        tier: expertTier
      });

      const stakeAmount = getStakeAmount();
      const txHash = await registerExpert(
        walletAddress,
        name,
        bio,
        selectedCategories,
        stakeAmount
      );

      alert(`✅ Expert registration successful!\n\nTransaction Hash: ${txHash}\n\nYou can now review claims and earn rewards!`);
      
      // Refresh expert status
      await checkExpertStatus();
    } catch (error: any) {
      console.error('Error registering:', error);
      alert(`Failed to register as expert: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress || !selectedClaim) {
      alert('Missing required information');
      return;
    }

    try {
      setLoading(true);
      console.log('Submitting review:', {
        claimId: selectedClaim,
        verdict,
        confidence,
        reasoning,
        reviewStake
      });

      const stakeAmount = BigInt(parseFloat(reviewStake) * 10_000_000); // Convert XLM to stroops
      
      const txHash = await submitReview(
        walletAddress,
        BigInt(selectedClaim),
        verdict,
        reasoning,
        confidence,
        stakeAmount
      );

      alert(`✅ Review submitted successfully!\n\nTransaction Hash: ${txHash}\n\nYour review is now on-chain!`);
      
      setSelectedClaim(null);
      setConfidence(50);
      setReasoning('');
      setReviewStake('10');
      
      // Refresh expert profile
      await checkExpertStatus();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(`Failed to submit review: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Mock pending claims
  const pendingClaims = [
    { id: 1, text: 'New medical treatment shows promise', category: 'Health' },
    { id: 2, text: 'Tech company launches new AI model', category: 'Technology' },
    { id: 3, text: 'Economic indicators suggest growth', category: 'Economics' }
  ];

  if (!walletAddress) {
    return (
      <div className="expert-dashboard-page">
        <div className="connect-prompt">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to access the expert dashboard</p>
        </div>
      </div>
    );
  }

  const expertiseOptions = [
    'Science & Technology',
    'Politics & Governance',
    'Health & Medicine',
    'Climate & Environment',
    'Economics & Finance',
    'History & Facts',
    'Social Issues',
    'Other'
  ];

  if (loading && !isRegistered) {
    return (
      <div className="expert-dashboard-page">
        <div className="connect-prompt">
          <h2>Loading...</h2>
          <p>Checking expert status...</p>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="expert-dashboard-page">
        <div className="page-header">
          <h1>Become an Expert</h1>
          <p>Register as an expert to review claims and earn rewards</p>
        </div>

        <form onSubmit={handleRegister} className="registration-form">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio / Credentials</label>
            <textarea
              className="form-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your qualifications, experience, and credentials..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Areas of Expertise (Select at least one)</label>
            <div className="category-grid">
              {expertiseOptions.map((category) => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Expert Tier</label>
            <div className="tier-options">
              <label className={`tier-option ${expertTier === 'general' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="tier"
                  value="general"
                  checked={expertTier === 'general'}
                  onChange={(e) => setExpertTier(e.target.value as 'general')}
                />
                <div className="tier-content">
                  <h4>General Expert</h4>
                  <p className="tier-stake">100 XLM Stake</p>
                  <ul>
                    <li>Review basic claims</li>
                    <li>70% reward share</li>
                    <li>Standard reputation growth</li>
                  </ul>
                </div>
              </label>

              <label className={`tier-option ${expertTier === 'specialized' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="tier"
                  value="specialized"
                  checked={expertTier === 'specialized'}
                  onChange={(e) => setExpertTier(e.target.value as 'specialized')}
                />
                <div className="tier-content">
                  <h4>Specialized Expert</h4>
                  <p className="tier-stake">500 XLM Stake</p>
                  <ul>
                    <li>Review complex claims</li>
                    <li>80% reward share</li>
                    <li>Priority notifications</li>
                  </ul>
                </div>
              </label>

              <label className={`tier-option ${expertTier === 'professional' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="tier"
                  value="professional"
                  checked={expertTier === 'professional'}
                  onChange={(e) => setExpertTier(e.target.value as 'professional')}
                />
                <div className="tier-content">
                  <h4>Professional Expert</h4>
                  <p className="tier-stake">1000 XLM Stake</p>
                  <ul>
                    <li>Review all claims</li>
                    <li>90% reward share</li>
                    <li>2x consensus weight</li>
                    <li>Early access to high-stake claims</li>
                  </ul>
                </div>
              </label>
            </div>
          </div>

          <div className="info-box">
            <h3>💎 Expert Benefits</h3>
            <ul>
              <li>✅ Earn rewards for accurate reviews (80% of claim pool)</li>
              <li>⚠️ 10% stake slashed for incorrect reviews</li>
              <li>🏆 Build reputation and unlock higher tiers</li>
              <li>💰 Your stake is refundable when you unregister</li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Registering...' : `Register as Expert (${getStakeDisplay()} XLM Stake)`}
          </button>
        </form>
      </div>
    );
  }

  const formatXLM = (stroops: string): string => {
    const xlm = parseFloat(stroops) / 10_000_000;
    return xlm.toFixed(2);
  };

  const calculateAccuracy = (): string => {
    if (!expertProfile || expertProfile.total_reviews === 0) {
      return '—';
    }
    const accuracy = (expertProfile.correct_reviews / expertProfile.total_reviews) * 100;
    return accuracy.toFixed(1) + '%';
  };

  return (
    <div className="expert-dashboard-page">
      <div className="page-header">
        <h1>Expert Dashboard</h1>
        <p>Review claims and earn rewards</p>
        {expertProfile && (
          <div className="expert-info">
            <h3>{expertProfile.name}</h3>
            <p className="expert-level">
              {expertProfile.expert_level} · {expertProfile.reputation_level}
            </p>
            <p className="reputation-points">
              {expertProfile.reputation_points} Reputation Points
            </p>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Reviews Submitted</span>
          <span className="stat-value">{expertProfile?.total_reviews || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Accuracy Rate</span>
          <span className="stat-value">{calculateAccuracy()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rewards Earned</span>
          <span className="stat-value">
            {expertProfile ? formatXLM(expertProfile.total_earnings) : '0.00'} XLM
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Current Stake</span>
          <span className="stat-value">
            {expertProfile ? formatXLM(expertProfile.staked_amount) : '0.00'} XLM
          </span>
        </div>
      </div>

      <div className="pending-claims-section">
        <h2>Pending Claims to Review</h2>
        <div className="claims-list">
          {pendingClaims.map(claim => (
            <div 
              key={claim.id} 
              className={`claim-item ${selectedClaim === claim.id ? 'selected' : ''}`}
              onClick={() => setSelectedClaim(claim.id)}
            >
              <div className="claim-category-badge">{claim.category}</div>
              <p className="claim-text">{claim.text}</p>
              <button className="btn btn-secondary btn-sm">
                {selectedClaim === claim.id ? 'Selected' : 'Review'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedClaim && (
        <div className="review-form-section">
          <h2>Submit Review for Claim #{selectedClaim}</h2>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label className="form-label">Your Verdict</label>
              <div className="verdict-options">
                <label className={`verdict-option ${verdict === 'True' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="verdict"
                    value="True"
                    checked={verdict === 'True'}
                    onChange={(e) => setVerdict(e.target.value as 'True')}
                  />
                  <span>✅ True</span>
                </label>
                <label className={`verdict-option ${verdict === 'False' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="verdict"
                    value="False"
                    checked={verdict === 'False'}
                    onChange={(e) => setVerdict(e.target.value as 'False')}
                  />
                  <span>❌ False</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Confidence Level: {confidence}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="rating-slider"
              />
              <div className="rating-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reasoning & Evidence</label>
              <textarea
                className="form-textarea"
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Provide detailed analysis, evidence, and reasoning for your verdict..."
                rows={6}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Review Stake Amount (XLM)</label>
              <input
                type="number"
                className="form-input"
                value={reviewStake}
                onChange={(e) => setReviewStake(e.target.value)}
                min="1"
                step="0.1"
                placeholder="Amount to stake on this review"
                required
              />
              <p className="form-hint">Higher stakes increase your influence on consensus</p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : `Submit Review (Stake ${reviewStake} XLM)`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpertDashboard;
