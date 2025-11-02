import React, { useState } from 'react';
import './ExpertDashboard.css';

interface ExpertDashboardProps {
  walletAddress: string | null;
}

const ExpertDashboard: React.FC<ExpertDashboardProps> = ({ walletAddress }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [expertise, setExpertise] = useState('');
  const [credentials, setCredentials] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null);
  const [rating, setRating] = useState(50);
  const [comment, setComment] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // TODO: Implement contract call
      console.log('Registering expert:', { expertise, credentials });
      alert('Expert registration successful! (Contract integration pending)');
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register as expert');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Implement contract call
      console.log('Submitting review:', { claimId: selectedClaim, rating, comment });
      alert('Review submitted successfully! (Contract integration pending)');
      setSelectedClaim(null);
      setRating(50);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
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

  if (!isRegistered) {
    return (
      <div className="expert-dashboard-page">
        <div className="page-header">
          <h1>Become an Expert</h1>
          <p>Register as an expert to review claims and earn rewards</p>
        </div>

        <form onSubmit={handleRegister} className="registration-form">
          <div className="form-group">
            <label className="form-label">Area of Expertise</label>
            <select
              className="form-select"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              required
            >
              <option value="">Select your expertise</option>
              <option>Science</option>
              <option>Politics</option>
              <option>Health</option>
              <option>Technology</option>
              <option>Environment</option>
              <option>Economics</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Credentials</label>
            <textarea
              className="form-textarea"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="Describe your qualifications, experience, and credentials..."
              required
            />
          </div>

          <div className="info-box">
            <h3>Expert Requirements</h3>
            <ul>
              <li>Stake 10 XLM (refundable)</li>
              <li>Maintain 70%+ accuracy for rewards</li>
              <li>10% stake slashed for poor performance</li>
              <li>Earn 80% of claim fees for quality reviews</li>
            </ul>
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            Register as Expert (10 XLM Stake)
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="expert-dashboard-page">
      <div className="page-header">
        <h1>Expert Dashboard</h1>
        <p>Review claims and earn rewards</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Reviews Submitted</span>
          <span className="stat-value">0</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Accuracy Rate</span>
          <span className="stat-value">—</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rewards Earned</span>
          <span className="stat-value">0 XLM</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Stake</span>
          <span className="stat-value">10 XLM</span>
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
              <label className="form-label">
                Confidence Rating: {rating}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="rating-slider"
              />
              <div className="rating-labels">
                <span>False</span>
                <span>Uncertain</span>
                <span>True</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Review Comment</label>
              <textarea
                className="form-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Provide your expert analysis and reasoning..."
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpertDashboard;
