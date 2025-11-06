import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClaimCount, getClaim } from '../utils/contracts';
import './MyClaims.css';

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

interface MyClaimsProps {
  walletAddress: string | null;
}

const MyClaims: React.FC<MyClaimsProps> = ({ walletAddress }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchMyClaims();
  }, [walletAddress]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!walletAddress) return;
    
    const interval = setInterval(() => {
      console.log('Auto-refreshing my claims...');
      fetchMyClaims();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [walletAddress]);

  const fetchMyClaims = async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching claims for user:', walletAddress);
      const count = await getClaimCount(walletAddress);
      console.log(`Total claims in system: ${count}`);

      if (count === 0) {
        setClaims([]);
        setLoading(false);
        return;
      }

      // Fetch all claims and filter by submitter
      const claimPromises = [];
      for (let i = 1; i <= Math.min(count, 100); i++) {
        claimPromises.push(getClaim(walletAddress, i));
      }

      const claimResults = await Promise.all(claimPromises);
      const validClaims = claimResults.filter(c => c !== null) as Claim[];
      
      // Filter to show only claims submitted by this user
      const myClaims = validClaims.filter(claim => 
        claim.submitter.toLowerCase() === walletAddress.toLowerCase()
      );
      
      console.log(`Found ${myClaims.length} claims by this user`);
      setClaims(myClaims);
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error('Error fetching my claims:', err);
      setError(err.message || 'Failed to load your claims');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    console.log('Manual refresh triggered for my claims');
    fetchMyClaims();
  };

  const formatXLM = (stroops: string): string => {
    const xlm = parseFloat(stroops) / 10_000_000;
    return xlm.toFixed(2);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = (status: string): { label: string; className: string } => {
    switch (status.toLowerCase()) {
      case 'true':
        return { label: 'Verified ✓', className: 'verified' };
      case 'false':
        return { label: 'Disputed ✗', className: 'disputed' };
      case 'underreview':
        return { label: 'Under Review', className: 'under-review' };
      default:
        return { label: 'Pending Review', className: 'pending' };
    }
  };

  if (!walletAddress) {
    return (
      <div className="my-claims-page">
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to view your submitted claims.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-claims-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your claims from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-claims-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Claims</h2>
          <p>{error}</p>
          <button onClick={fetchMyClaims} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-claims-page">
      <div className="my-claims-header">
        <div className="header-content">
          <h1>My Claims</h1>
          <p className="subtitle">
            Track the status and reviews of all your submitted claims
          </p>
        </div>
        <button 
          onClick={handleManualRefresh} 
          className="btn-refresh"
          disabled={loading}
        >
          {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      
      {!loading && (
        <div className="refresh-info">
          Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refreshes every 30s
        </div>
      )}

      {claims.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No Claims Yet</h2>
          <p>You haven't submitted any claims yet. Start fact-checking now!</p>
          <Link to="/submit" className="submit-first-btn">
            Submit Your First Claim
          </Link>
        </div>
      ) : (
        <div className="claims-stats">
          <div className="stat-card">
            <div className="stat-value">{claims.length}</div>
            <div className="stat-label">Total Claims</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {claims.filter(c => c.status.toLowerCase() === 'true').length}
            </div>
            <div className="stat-label">Verified</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {claims.filter(c => c.status.toLowerCase() === 'underreview').length}
            </div>
            <div className="stat-label">Under Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {claims.filter(c => c.status.toLowerCase() === 'pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      )}

      <div className="claims-grid">
        {claims.map((claim) => {
          const statusInfo = getStatusDisplay(claim.status);
          return (
            <Link to={`/claim/${claim.id}`} key={claim.id} className="claim-card">
              <div className="claim-header">
                <span className="claim-id">#{claim.id}</span>
                <span className={`claim-status ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="claim-content">
                <p className="claim-text">{claim.text}</p>
              </div>

              <div className="claim-meta">
                <span className="claim-category">
                  <span className="meta-icon">🏷️</span>
                  {claim.category}
                </span>
                <span className="claim-date">
                  <span className="meta-icon">📅</span>
                  {formatDate(claim.timestamp)}
                </span>
              </div>

              <div className="claim-footer">
                <div className="claim-info">
                  <span className="info-item">
                    <span className="info-icon">💰</span>
                    {formatXLM(claim.stake_pool)} XLM staked
                  </span>
                  <span className="info-item">
                    <span className="info-icon">👥</span>
                    {claim.review_count} reviews
                  </span>
                </div>
                <button className="view-details-btn">View Details →</button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyClaims;
