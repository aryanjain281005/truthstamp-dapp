import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

interface HomePageProps {
  walletAddress: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ walletAddress }) => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Decentralized Fact-Checking
            <span className="gradient-text"> on Stellar</span>
          </h1>
          <p className="hero-subtitle">
            TruthStamp uses blockchain technology and economic incentives to verify claims through expert consensus
          </p>
          <div className="hero-actions">
            <Link to="/submit" className="btn btn-primary btn-lg">
              Submit a Claim
            </Link>
            <Link to="/claims" className="btn btn-secondary btn-lg">
              Browse Claims
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon" style={{background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)'}}>
            📝
          </div>
          <h3>Submit Claims</h3>
          <p>Submit any claim with a small fee of 0.5 XLM. Include sources and context for better verification.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" style={{background: 'linear-gradient(135deg, #00D9B0 0%, #00B87C 100%)'}}>
            🎯
          </div>
          <h3>Expert Reviews</h3>
          <p>Registered experts stake XLM and review claims. Correct reviews earn rewards, incorrect ones are slashed.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" style={{background: 'linear-gradient(135deg, #FFC043 0%, #FF9500 100%)'}}>
            ⚖️
          </div>
          <h3>Consensus</h3>
          <p>Stake-weighted voting determines truth. The platform requires 3+ reviews for consensus.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" style={{background: 'linear-gradient(135deg, #FF5C77 0%, #E03E55 100%)'}}>
            ⭐
          </div>
          <h3>Reputation</h3>
          <p>Experts earn reputation points for accuracy. Higher reputation unlocks better opportunities.</p>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-value">3</div>
          <div className="stat-label">Smart Contracts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0.5 XLM</div>
          <div className="stat-label">Claim Fee</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">80%</div>
          <div className="stat-label">Reward Pool</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">10%</div>
          <div className="stat-label">Slashing Rate</div>
        </div>
      </section>

      {!walletAddress && (
        <section className="cta">
          <h2>Ready to get started?</h2>
          <p>Connect your Freighter wallet to submit claims or become an expert reviewer</p>
          <button className="btn btn-primary btn-lg">
            Connect Wallet
          </button>
        </section>
      )}
    </div>
  );
};

export default HomePage;
