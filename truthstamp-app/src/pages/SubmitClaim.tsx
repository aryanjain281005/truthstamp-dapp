import React, { useState } from 'react';
import './SubmitClaim.css';
import { submitClaim, isFreighterInstalled } from '../utils/contracts';

interface SubmitClaimProps {
  walletAddress: string | null;
}

const SubmitClaim: React.FC<SubmitClaimProps> = ({ walletAddress }) => {
  const [claimText, setClaimText] = useState('');
  const [category, setCategory] = useState('Science');
  const [sources, setSources] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSource = () => {
    setSources([...sources, '']);
  };

  const handleSourceChange = (index: number, value: string) => {
    const newSources = [...sources];
    newSources[index] = value;
    setSources(newSources);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit to smart contract
      const filteredSources = sources.filter(s => s.trim() !== '');
      const txHash = await submitClaim(
        walletAddress,
        claimText,
        category,
        filteredSources
      );
      
      console.log('Transaction hash:', txHash);
      
      // Check if it's a real transaction or demo
      const isRealTransaction = !txHash.startsWith('demo_');
      
      const message = isRealTransaction
        ? `🎉 Claim submitted to Stellar blockchain!\n\n✅ Transaction Hash:\n${txHash}\n\n📋 Claim: "${claimText}"\n🏷️ Category: ${category}\n\n✨ Your claim has been recorded on Stellar Soroban testnet!\n📊 Experts can now review and verify this claim.\n💰 Transaction completed (10 XLM deducted from your wallet)\n\n🔍 View your claim in "My Claims" or "Browse Claims"\n\n🔍 View on Stellar Explorer:\nhttps://stellar.expert/explorer/testnet/tx/${txHash}`
        : `🎉 Claim submitted successfully! (Demo Mode)\n\n✅ Transaction: ${txHash}\n\n📋 Claim: "${claimText}"\n🏷️ Category: ${category}\n\n💡 Demo Mode Active: Your Freighter wallet is connected but this is a simulated transaction for testing.\n\nTo submit real blockchain transactions:\n1. Ensure your wallet has testnet XLM\n2. Get free testnet XLM: https://laboratory.stellar.org/#account-creator`;
      
      alert(message);
      
      // Reset form
      setClaimText('');
      setCategory('Science');
      setSources(['']);
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert(`Failed to submit claim: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-claim-page">
      <div className="page-header">
        <h1>Submit a Claim</h1>
        <p>Submit a claim for expert verification on the blockchain</p>
      </div>

      <div className="fee-notice">
        <div className="notice-icon">💰</div>
        <div className="notice-content">
          <h3>Transaction Fee Required</h3>
          <p>Submitting a claim requires a <strong>10 XLM transaction fee</strong> to be paid from your wallet. This ensures serious submissions and supports the decentralized verification network.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="claim-form">
        <div className="form-group">
          <label className="form-label">
            Claim Statement
            <span className="char-count">{claimText.length} / 1000</span>
          </label>
          <textarea
            className="form-textarea"
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            placeholder="Enter the claim you want to be verified..."
            maxLength={1000}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Science</option>
            <option>Politics</option>
            <option>Health</option>
            <option>Technology</option>
            <option>Environment</option>
            <option>Economics</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Sources</label>
          {sources.map((source, index) => (
            <input
              key={index}
              type="url"
              className="form-input source-input"
              value={source}
              onChange={(e) => handleSourceChange(index, e.target.value)}
              placeholder="https://example.com/article"
            />
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleAddSource}
          >
            + Add Source
          </button>
        </div>

        <div className="form-actions">
          <div className="fee-info">
            <span>Transaction Fee:</span>
            <strong>10 XLM</strong>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!walletAddress || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Claim (10 XLM)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitClaim;
