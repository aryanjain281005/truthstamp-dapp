import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SubmitClaim from './pages/SubmitClaim';
import BrowseClaims from './pages/BrowseClaims';
import MyClaims from './pages/MyClaims';
import ClaimDetail from './pages/ClaimDetail';
import ExpertDashboard from './pages/ExpertDashboard';
import { connectWallet, getPublicKey } from './utils/wallet';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const checkWallet = async () => {
      try {
        const address = await getPublicKey();
        if (address) {
          setWalletAddress(address);
        }
      } catch (err) {
        console.log('Wallet not connected');
      }
    };
    checkWallet();
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error) {
      alert('Failed to connect wallet. Please install Freighter.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">
              <div className="logo-icon">✓</div>
              <span>TruthStamp</span>
            </Link>
            
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/submit" className="nav-link">Submit Claim</Link>
              <Link to="/claims" className="nav-link">Browse Claims</Link>
              <Link to="/my-claims" className="nav-link">My Claims</Link>
              <Link to="/expert" className="nav-link">Expert Dashboard</Link>
            </div>

            <div className="wallet-section">
              {walletAddress ? (
                <div className="wallet-connected">
                  <div className="wallet-indicator"></div>
                  <span className="wallet-address">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
              ) : (
                <button 
                  className="connect-wallet-btn"
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage walletAddress={walletAddress} />} />
            <Route path="/submit" element={<SubmitClaim walletAddress={walletAddress} />} />
            <Route path="/claims" element={<BrowseClaims walletAddress={walletAddress} />} />
            <Route path="/my-claims" element={<MyClaims walletAddress={walletAddress} />} />
            <Route path="/claim/:id" element={<ClaimDetail walletAddress={walletAddress} />} />
            <Route path="/expert" element={<ExpertDashboard walletAddress={walletAddress} />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>© 2025 TruthStamp | Decentralized Fact-Checking on Stellar</p>
            <div className="footer-links">
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer">Powered by Stellar</a>
              <span>•</span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
