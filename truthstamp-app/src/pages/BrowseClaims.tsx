import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClaimCount, getClaim } from '../utils/contracts';
import './BrowseClaims.css';

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

interface BrowseClaimsProps {
  walletAddress: string | null;
}

const BrowseClaims: React.FC<BrowseClaimsProps> = ({ walletAddress }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchClaims();
  }, [walletAddress]);

  // Auto-refresh every 30 seconds to catch new claims
  useEffect(() => {
    if (!walletAddress) return;
    
    const interval = setInterval(() => {
      console.log('Auto-refreshing claims...');
      fetchClaims();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [walletAddress]);

  const fetchClaims = async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching claims count...');
      const count = await getClaimCount(walletAddress);
      console.log(`Total claims: ${count}`);

      if (count === 0) {
        setClaims([]);
        setLoading(false);
        return;
      }

      // Fetch all claims (in production, use pagination)
      const claimPromises = [];
      for (let i = 1; i <= Math.min(count, 50); i++) {
        claimPromises.push(getClaim(walletAddress, i));
      }

      const claimResults = await Promise.all(claimPromises);
      const validClaims = claimResults.filter(c => c !== null) as Claim[];
      
      console.log(`Fetched ${validClaims.length} claims`);
      setClaims(validClaims);
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error('Error fetching claims:', err);
      setError(err.message || 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    console.log('Manual refresh triggered');
    fetchClaims();
  };

  const formatXLM = (stroops: string): string => {
    const xlm = parseFloat(stroops) / 10_000_000;
    return xlm.toFixed(2);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusDisplay = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'true':
        return 'verified';
      case 'false':
        return 'disputed';
      case 'underreview':
        return 'under-review';
      default:
        return 'pending';
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesFilter = filter === 'all' || getStatusDisplay(claim.status) === filter;
    const matchesSearch = searchTerm === '' || 
      claim.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!walletAddress) {
    return (
      <div className="browse-claims-page">
        <div className="error-state">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to browse claims</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-claims-page">
      <div className="page-header">
        <h1>Browse Claims</h1>
        <p>Explore claims verified by our expert community</p>
        <div className="header-actions">
          <button 
            onClick={handleManualRefresh} 
            className="btn btn-secondary refresh-btn"
            disabled={loading}
          >
            {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
          <Link to="/submit" className="btn btn-primary">
            Submit New Claim
          </Link>
        </div>
      </div>
      
      {!loading && (
        <div className="refresh-info">
          Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refreshes every 30s
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search claims by text or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
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
          ✅ Verified
        </button>
        <button 
          className={`filter-btn ${filter === 'disputed' ? 'active' : ''}`}
          onClick={() => setFilter('disputed')}
        >
          ❌ Disputed
        </button>
        <button 
          className={`filter-btn ${filter === 'under-review' ? 'active' : ''}`}
          onClick={() => setFilter('under-review')}
        >
          🔍 Under Review
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          ⏳ Pending
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <h2>Loading claims from blockchain...</h2>
          <p>This may take a few moments</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <h2>Error Loading Claims</h2>
          <p>{error}</p>
          <button onClick={fetchClaims} className="btn btn-primary">
            Try Again
          </button>
        </div>
      ) : claims.length === 0 ? (
        <div className="empty-state">
          <h2>No Claims Yet</h2>
          <p>Be the first to submit a claim for verification!</p>
          <Link to="/submit" className="btn btn-primary">
            Submit First Claim
          </Link>
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="empty-state">
          <h2>No Claims Found</h2>
          <p>Try adjusting your filters or search terms</p>
          <button onClick={() => { setFilter('all'); setSearchTerm(''); }} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
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
                <span className={`claim-status status-${getStatusDisplay(claim.status)}`}>
                  {getStatusDisplay(claim.status)}
                </span>
              </div>
              
              <p className="claim-text">{claim.text}</p>
              
              <div className="claim-footer">
                <div className="claim-info">
                  <span className="info-item">
                    💰 {formatXLM(claim.stake_pool)} XLM
                  </span>
                  <span className="info-item">
                    📊 {claim.review_count} reviews
                  </span>
                </div>
                <span className="claim-date">{formatDate(claim.timestamp)}</span>
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
