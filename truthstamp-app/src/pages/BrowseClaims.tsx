import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BrowseClaims.css';

interface Claim {
  id: number;
  text: string;
  category: string;
  status: 'pending' | 'verified' | 'disputed';
  score: number;
  submittedAt: string;
}

const BrowseClaims: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch claims from contract
    const mockClaims: Claim[] = [
      {
        id: 1,
        text: 'Climate change is causing global temperature rise',
        category: 'Environment',
        status: 'verified',
        score: 85,
        submittedAt: '2024-01-15'
      },
      {
        id: 2,
        text: 'Vaccines are safe and effective',
        category: 'Health',
        status: 'verified',
        score: 92,
        submittedAt: '2024-01-14'
      },
      {
        id: 3,
        text: 'Artificial intelligence will replace all jobs',
        category: 'Technology',
        status: 'disputed',
        score: 45,
        submittedAt: '2024-01-13'
      }
    ];
    
    setTimeout(() => {
      setClaims(mockClaims);
      setLoading(false);
    }, 500);
  }, []);

  const filteredClaims = filter === 'all' 
    ? claims 
    : claims.filter(c => c.status === filter);

  return (
    <div className="browse-claims-page">
      <div className="page-header">
        <h1>Browse Claims</h1>
        <p>Explore claims verified by our expert community</p>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Claims
        </button>
        <button 
          className={`filter-btn ${filter === 'verified' ? 'active' : ''}`}
          onClick={() => setFilter('verified')}
        >
          Verified
        </button>
        <button 
          className={`filter-btn ${filter === 'disputed' ? 'active' : ''}`}
          onClick={() => setFilter('disputed')}
        >
          Disputed
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading claims...</div>
      ) : (
        <div className="claims-grid">
          {filteredClaims.map(claim => (
            <Link 
              to={`/claim/${claim.id}`} 
              key={claim.id} 
              className="claim-card"
            >
              <div className="claim-header">
                <span className="claim-category">{claim.category}</span>
                <span className={`claim-status status-${claim.status}`}>
                  {claim.status}
                </span>
              </div>
              
              <p className="claim-text">{claim.text}</p>
              
              <div className="claim-footer">
                <div className="claim-score">
                  <span className="score-label">Confidence:</span>
                  <span className="score-value">{claim.score}%</span>
                </div>
                <span className="claim-date">{claim.submittedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredClaims.length === 0 && (
        <div className="empty-state">
          <p>No claims found for this filter</p>
        </div>
      )}
    </div>
  );
};

export default BrowseClaims;
