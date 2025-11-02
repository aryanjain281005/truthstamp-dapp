import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ClaimDetail.css';

interface Review {
  expertId: string;
  rating: number;
  comment: string;
  timestamp: string;
}

interface ClaimData {
  id: number;
  text: string;
  category: string;
  status: 'pending' | 'verified' | 'disputed';
  score: number;
  submittedAt: string;
  submitter: string;
  sources: string[];
  reviews: Review[];
}

interface ClaimDetailProps {
  walletAddress: string | null;
}

const ClaimDetail: React.FC<ClaimDetailProps> = ({ walletAddress }) => {
  const { id } = useParams<{ id: string }>();
  const [claim, setClaim] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch claim details from contract
    const mockClaim: ClaimData = {
      id: parseInt(id || '1'),
      text: 'Climate change is causing global temperature rise',
      category: 'Environment',
      status: 'verified',
      score: 85,
      submittedAt: '2024-01-15',
      submitter: 'GDX7...ABC3',
      sources: [
        'https://climate.nasa.gov',
        'https://www.ipcc.ch'
      ],
      reviews: [
        {
          expertId: 'GDY8...DEF4',
          rating: 90,
          comment: 'Strong scientific consensus backed by extensive data',
          timestamp: '2024-01-16'
        },
        {
          expertId: 'GDZ9...GHI5',
          rating: 80,
          comment: 'Well-documented phenomenon with clear evidence',
          timestamp: '2024-01-17'
        }
      ]
    };

    setTimeout(() => {
      setClaim(mockClaim);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <div className="loading">Loading claim details...</div>;
  }

  if (!claim) {
    return (
      <div className="error-state">
        <h2>Claim not found</h2>
        <Link to="/claims" className="btn btn-primary">Browse Claims</Link>
      </div>
    );
  }

  return (
    <div className="claim-detail-page">
      <Link to="/claims" className="back-link">← Back to Claims</Link>

      <div className="claim-header">
        <div className="claim-meta">
          <span className="claim-category">{claim.category}</span>
          <span className={`claim-status status-${claim.status}`}>
            {claim.status}
          </span>
        </div>
        
        <h1 className="claim-text">{claim.text}</h1>

        <div className="claim-info">
          <div className="info-item">
            <span className="info-label">Submitted by:</span>
            <span className="info-value">{claim.submitter}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date:</span>
            <span className="info-value">{claim.submittedAt}</span>
          </div>
        </div>
      </div>

      <div className="score-section">
        <div className="score-display">
          <div className="score-circle">
            <span className="score-value">{claim.score}%</span>
          </div>
          <div className="score-info">
            <h3>Confidence Score</h3>
            <p>Based on {claim.reviews.length} expert reviews</p>
          </div>
        </div>
      </div>

      <div className="sources-section">
        <h2>Sources</h2>
        <div className="sources-list">
          {claim.sources.map((source, index) => (
            <a 
              key={index}
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link"
            >
              {source}
            </a>
          ))}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Expert Reviews ({claim.reviews.length})</h2>
        <div className="reviews-list">
          {claim.reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <span className="expert-id">{review.expertId}</span>
                <span className="review-rating">{review.rating}%</span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <span className="review-date">{review.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;
