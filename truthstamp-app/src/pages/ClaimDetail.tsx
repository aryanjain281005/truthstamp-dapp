import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClaim, getConsensus, getReview, getExpert } from '../utils/contracts';
import './ClaimDetail.css';

interface Review {
  id: number;
  claim_id: number;
  expert: string;
  verdict: string;
  reasoning: string;
  confidence: number;
  stake_amount: string;
  timestamp: number;
  rewarded: boolean;
}

interface ExpertInfo {
  address: string;
  name: string;
  bio: string;
  expertise_categories: string[];
  staked_amount: string;
  expert_level: string;
  reputation_points: number;
  total_reviews: number;
  correct_reviews: number;
  total_earnings: string;
  registered_at: number;
}

interface Claim {
  id: number;
  submitter: string;
  text: string;
  category: string;
  sources: string[];
  status: string;
  stake_pool: string;
  timestamp: number;
  review_count: number;
}

interface ConsensusResult {
  claim_id: number;
  final_verdict: string;
  total_stake_true: string;
  total_stake_false: string;
  confidence_percentage: number;
  is_finalized: boolean;
}

interface ClaimDetailProps {
  walletAddress: string | null;
}

const ClaimDetail: React.FC<ClaimDetailProps> = ({ walletAddress }) => {
  const { id } = useParams<{ id: string }>();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [consensus, setConsensus] = useState<ConsensusResult | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [expertDetails, setExpertDetails] = useState<Map<string, ExpertInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuarantee, setShowGuarantee] = useState(false);

  useEffect(() => {
    fetchClaimDetails();
  }, [id, walletAddress]);

  const fetchClaimDetails = async () => {
    if (!walletAddress || !id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching claim details for ID:', id);
      
      // Fetch claim data
      const claimData = await getClaim(walletAddress, parseInt(id));
      
      if (claimData) {
        setClaim(claimData);
        
        // Fetch consensus if claim has reviews
        if (claimData.review_count > 0) {
          const consensusData = await getConsensus(walletAddress, parseInt(id));
          setConsensus(consensusData);

          // Fetch reviews (limited to first 20)
          const reviewPromises = [];
          for (let i = 1; i <= Math.min(claimData.review_count, 20); i++) {
            reviewPromises.push(
              getReview(walletAddress, i).catch(() => null)
            );
          }
          
          const reviewResults = await Promise.all(reviewPromises);
          const validReviews = reviewResults
            .filter(r => r !== null && r.claim_id === parseInt(id)) as Review[];
          
          setReviews(validReviews);

          // Fetch expert details for each reviewer
          const experts = new Map<string, ExpertInfo>();
          for (const review of validReviews) {
            try {
              const expertData = await getExpert(review.expert);
              if (expertData) {
                experts.set(review.expert, expertData);
              }
            } catch (err) {
              console.error('Error fetching expert:', err);
            }
          }
          setExpertDetails(experts);
        }
      } else {
        setError('Claim not found');
      }
    } catch (err: any) {
      console.error('Error fetching claim:', err);
      setError(err.message || 'Failed to load claim details');
    } finally {
      setLoading(false);
    }
  };

  const formatXLM = (stroops: string): string => {
    const xlm = parseFloat(stroops) / 10_000_000;
    return xlm.toFixed(2);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAddress = (address: string): string => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDateTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'true':
        return 'verified';
      case 'false':
        return 'disputed';
      case 'underreview':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const getExpertBadges = (expert: ExpertInfo): string[] => {
    const badges: string[] = [];
    
    // Accuracy badge
    const accuracy = expert.total_reviews > 0 
      ? (expert.correct_reviews / expert.total_reviews) * 100 
      : 0;
    
    if (accuracy >= 95 && expert.total_reviews >= 10) {
      badges.push('95%+ Accuracy');
    }
    
    // Total verified badge
    if (expert.correct_reviews >= 100) {
      badges.push('Verified 100+ Claims');
    } else if (expert.correct_reviews >= 50) {
      badges.push('Verified 50+ Claims');
    } else if (expert.correct_reviews >= 10) {
      badges.push('Verified 10+ Claims');
    }
    
    // Top expert badge
    if (expert.reputation_points >= 5000) {
      badges.push('Top Expert');
    } else if (expert.reputation_points >= 1000) {
      badges.push('Master Expert');
    }
    
    // Level badge
    if (expert.expert_level) {
      badges.push(expert.expert_level);
    }
    
    return badges;
  };

  const getCategoryRequirements = (category: string): string[] => {
    const requirements: { [key: string]: string[] } = {
      'Health': [
        '✓ Medical degree or health professional certification required',
        '✓ Peer-reviewed sources mandatory',
        '✓ Clinical studies preferred'
      ],
      'Science': [
        '✓ Scientific background or PhD preferred',
        '✓ Peer-reviewed journals required',
        '✓ Reproducible methodology'
      ],
      'Legal': [
        '✓ Law degree or legal certification required',
        '✓ Case law references mandatory',
        '✓ Jurisdiction-specific expertise'
      ],
      'Politics': [
        '✓ Political science background preferred',
        '✓ Official sources required',
        '✓ Multiple independent sources needed'
      ],
      'Technology': [
        '✓ Technical expertise required',
        '✓ Technical documentation preferred',
        '✓ Code/data verification when applicable'
      ],
      'Economics': [
        '✓ Economics degree or finance background',
        '✓ Official economic data required',
        '✓ Statistical analysis preferred'
      ]
    };
    
    return requirements[category] || [
      '✓ Credible sources required',
      '✓ Multiple independent sources',
      '✓ Expert verification recommended'
    ];
  };

  const getAccuracyPercentage = (expert: ExpertInfo): number => {
    if (expert.total_reviews === 0) return 0;
    return Math.round((expert.correct_reviews / expert.total_reviews) * 100);
  };

  if (!walletAddress) {
    return (
      <div className="claim-detail-page">
        <div className="error-state">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to view claim details</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="claim-detail-page">
        <div className="loading">
          <h2>Loading claim details...</h2>
          <p>Fetching data from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="claim-detail-page">
        <div className="error-state">
          <h2>{error || 'Claim not found'}</h2>
          <p>This claim may not exist or hasn't been submitted yet.</p>
          <Link to="/claims" className="btn btn-primary">Browse Claims</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-detail-page">
      <Link to="/claims" className="back-link">← Back to Claims</Link>

      <div className="claim-header">
        <div className="claim-meta">
          <span className="claim-category">{claim.category}</span>
          <span className={`claim-status status-${getStatusColor(claim.status)}`}>
            {claim.status}
          </span>
        </div>
        
        <h1 className="claim-text">{claim.text}</h1>

        <div className="claim-info-grid">
          <div className="info-item">
            <span className="info-label">📤 Submitted by</span>
            <span className="info-value">{formatAddress(claim.submitter)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">📅 Date</span>
            <span className="info-value">{formatDate(claim.timestamp)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">💰 Stake Pool</span>
            <span className="info-value">{formatXLM(claim.stake_pool)} XLM</span>
          </div>
          <div className="info-item">
            <span className="info-label">📊 Reviews</span>
            <span className="info-value">{claim.review_count}</span>
          </div>
        </div>
      </div>

      {consensus && (
        <div className="consensus-section">
          <h2>⚖️ Consensus Result</h2>
          <div className="consensus-display">
            <div className="consensus-verdict">
              <div className={`verdict-badge ${consensus.final_verdict.toLowerCase()}`}>
                {consensus.final_verdict === 'True' ? '✅ TRUE' : '❌ FALSE'}
              </div>
              <p className="confidence-text">
                {consensus.confidence_percentage}% Confidence
              </p>
            </div>

            <div className="stake-distribution">
              <h3>Stake Distribution</h3>
              <div className="stake-bars">
                <div className="stake-bar">
                  <span className="stake-label">True</span>
                  <div className="stake-bar-bg">
                    <div 
                      className="stake-bar-fill true"
                      style={{
                        width: `${(parseFloat(consensus.total_stake_true) / 
                          (parseFloat(consensus.total_stake_true) + parseFloat(consensus.total_stake_false)) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="stake-amount">{formatXLM(consensus.total_stake_true)} XLM</span>
                </div>
                <div className="stake-bar">
                  <span className="stake-label">False</span>
                  <div className="stake-bar-bg">
                    <div 
                      className="stake-bar-fill false"
                      style={{
                        width: `${(parseFloat(consensus.total_stake_false) / 
                          (parseFloat(consensus.total_stake_true) + parseFloat(consensus.total_stake_false)) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="stake-amount">{formatXLM(consensus.total_stake_false)} XLM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sources-section">
        <h2>📚 Sources</h2>
        {claim.sources.length > 0 ? (
          <div className="sources-list">
            {claim.sources.map((source, index) => (
              <a 
                key={index}
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                <span className="source-icon">🔗</span>
                <span className="source-url">{source}</span>
                <span className="external-icon">↗</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="no-sources">No sources provided</p>
        )}
      </div>

      {/* Category Requirements */}
      <div className="category-requirements-section">
        <h2>📋 {claim.category} Category Requirements</h2>
        <div className="requirements-box">
          <p className="requirements-intro">
            To ensure accuracy, <strong>{claim.category}</strong> claims require:
          </p>
          <ul className="requirements-list">
            {getCategoryRequirements(claim.category).map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fact-Check Guarantee */}
      <div className="guarantee-section">
        <div className="guarantee-badge">
          <span className="guarantee-icon">🛡️</span>
          <span className="guarantee-text">TruthStamp Guarantee</span>
        </div>
        <div className="guarantee-content">
          <h3>Accuracy Guarantee Policy</h3>
          <p className="guarantee-intro">
            We stand behind our fact-checking with a <strong>money-back guarantee</strong>:
          </p>
          <div className="guarantee-terms">
            <div className="guarantee-term">
              <span className="term-icon">✅</span>
              <div>
                <h4>If Our Verdict is Proven Wrong</h4>
                <p>Full stake refund + 50% compensation within 30 days</p>
              </div>
            </div>
            <div className="guarantee-term">
              <span className="term-icon">🔍</span>
              <div>
                <h4>Verified by Independent Experts</h4>
                <p>Minimum 3 experts with proven track records review each claim</p>
              </div>
            </div>
            <div className="guarantee-term">
              <span className="term-icon">⏱️</span>
              <div>
                <h4>30-Day Appeal Period</h4>
                <p>Submit new evidence to challenge verdict within 30 days</p>
              </div>
            </div>
            <div className="guarantee-term">
              <span className="term-icon">💰</span>
              <div>
                <h4>Compensation Pool</h4>
                <p>Backed by {formatXLM(claim.stake_pool)} XLM stake pool</p>
              </div>
            </div>
          </div>
          <button 
            className="btn btn-outline"
            onClick={() => setShowGuarantee(!showGuarantee)}
          >
            {showGuarantee ? 'Hide Details' : 'View Full Policy →'}
          </button>
          
          {showGuarantee && (
            <div className="guarantee-details">
              <h4>How to Claim Guarantee:</h4>
              <ol>
                <li>Submit appeal with new evidence proving our verdict wrong</li>
                <li>Independent arbitration panel reviews your case (5-7 days)</li>
                <li>If verdict overturned, receive full refund + 50% bonus automatically</li>
                <li>All compensations paid from platform insurance pool</li>
              </ol>
              <p className="guarantee-note">
                <strong>Note:</strong> Appeals must include substantial new evidence not available 
                during original review. Frivolous appeals may result in appeal fee forfeiture.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Expert Reviews */}
      <div className="reviews-section">
        <h2>👨‍🔬 Expert Reviews ({claim.review_count})</h2>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => {
              const expert = expertDetails.get(review.expert);
              const badges = expert ? getExpertBadges(expert) : [];
              const accuracy = expert ? getAccuracyPercentage(expert) : 0;
              
              return (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="expert-info">
                      <div className="expert-name-section">
                        <span className="expert-name">
                          {expert?.name || formatAddress(review.expert)}
                        </span>
                        <span className="expert-address">
                          {formatAddress(review.expert)}
                        </span>
                      </div>
                      
                      {/* Expert Badges */}
                      {badges.length > 0 && (
                        <div className="expert-badges">
                          {badges.map((badge, idx) => (
                            <span 
                              key={idx} 
                              className={`badge ${badge.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            >
                              {badge === 'Top Expert' && '⭐ '}
                              {badge === 'Master Expert' && '🎓 '}
                              {badge === '95%+ Accuracy' && '🎯 '}
                              {badge.includes('Verified') && '✅ '}
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="review-meta">
                      <div className={`review-verdict ${review.verdict.toLowerCase()}`}>
                        {review.verdict === 'True' ? '✅ TRUE' : '❌ FALSE'}
                      </div>
                      <div className="review-timestamp">
                        📅 {formatDateTime(review.timestamp)}
                      </div>
                    </div>
                  </div>

                  {expert && (
                    <div className="expert-stats">
                      <div className="stat">
                        <span className="stat-label">Accuracy</span>
                        <span className="stat-value">{accuracy}%</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Reviews</span>
                        <span className="stat-value">{expert.total_reviews}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Correct</span>
                        <span className="stat-value">{expert.correct_reviews}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Level</span>
                        <span className="stat-value">{expert.expert_level}</span>
                      </div>
                    </div>
                  )}

                  <div className="review-content">
                    <div className="review-confidence">
                      <span className="confidence-label">Confidence:</span>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ width: `${review.confidence}%` }}
                        />
                      </div>
                      <span className="confidence-value">{review.confidence}%</span>
                    </div>
                    
                    <div className="review-reasoning">
                      <strong>Expert Analysis:</strong>
                      <p>{review.reasoning}</p>
                    </div>

                    <div className="review-stake">
                      💰 Staked: <strong>{formatXLM(review.stake_amount)} XLM</strong>
                      {review.rewarded && (
                        <span className="rewarded-badge">✨ Rewarded</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : claim.review_count > 0 ? (
          <div className="reviews-loading">
            <p>Loading expert reviews...</p>
          </div>
        ) : (
          <div className="no-reviews">
            <p>No expert reviews yet</p>
            <p className="reviews-hint">Be the first to review this claim!</p>
            <Link to="/expert" className="btn btn-secondary">Register as Expert</Link>
          </div>
        )}
      </div>

      <div className="actions-section">
        <button className="btn btn-secondary" onClick={() => window.history.back()}>
          ← Back
        </button>
        {walletAddress && claim.review_count < 10 && (
          <Link to="/expert" className="btn btn-primary">
            Review This Claim
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClaimDetail;
