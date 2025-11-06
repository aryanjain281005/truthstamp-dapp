# 🎯 TruthStamp DApp - Local Setup Summary

## ✅ Application is Running!

Your TruthStamp decentralized fact-checking platform is now running locally:

**🌐 Access URLs:**
- **Local:** http://localhost:3000
- **Network:** http://192.168.137.231:3000

---

## 📋 Contract Information

All three smart contracts are deployed on **Stellar Soroban Testnet**:

### 1. 📝 Claim Registry Contract
- **Contract ID:** `CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY`
- **Purpose:** Manages claim submissions, status tracking, and stake pools
- **Key Functions:**
  - Submit new claims with 0.5 XLM fee
  - Retrieve claim details by ID
  - List claims with pagination
  - Update claim verification status
  - Add stakes to claims
- **Explorer:** https://stellar.expert/explorer/testnet/contract/CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY

### 2. 👨‍🔬 Expert Registry Contract
- **Contract ID:** `CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC`
- **Purpose:** Expert registration and reputation management
- **Key Functions:**
  - Register as an expert with tiered stakes (100/500/1000 XLM)
  - Retrieve expert profile
  - Check if address is registered expert
  - Update expert reputation after reviews
  - Distribute rewards to experts
  - Penalize incorrect reviews (10% slashing)
- **Explorer:** https://stellar.expert/explorer/testnet/contract/CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC

### 3. ⚖️ Review Consensus Contract
- **Contract ID:** `CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4`
- **Purpose:** Review submission and consensus calculation
- **Key Functions:**
  - Submit expert reviews with stake
  - Retrieve review details
  - Calculate consensus with stake-weighted voting
  - Get all reviews for a claim
  - Automatic reward distribution (80% payout to correct reviews)
  - Slashing mechanism (10% penalty for incorrect reviews)
- **Explorer:** https://stellar.expert/explorer/testnet/contract/CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4

---

## 🌐 Network Configuration

- **Network:** Stellar Soroban Testnet
- **RPC URL:** https://soroban-testnet.stellar.org:443
- **Network Passphrase:** Test SDF Network ; September 2015
- **Deployment Date:** November 2, 2025

---

## 🏗️ Project Architecture

### Smart Contract Layer (Rust)
The platform consists of three interconnected Soroban smart contracts:

1. **Claim Registry** - Central hub for claim management
2. **Expert Registry** - Expert profile and reputation system
3. **Review Consensus** - Stake-weighted voting and reward distribution

### Frontend Layer (React + TypeScript)
- **Framework:** React 18.2.0
- **Language:** TypeScript 4.9.5
- **Blockchain Integration:** Stellar SDK + Freighter Wallet
- **Styling:** CSS3 with modern UI/UX

### Key Features:
- 💰 Economic stakes ensure accountability
- 🏆 Reputation-based expert system (5 levels: Seedling → Master)
- 🎯 Consensus-driven verification
- 📊 Transparent on-chain records
- ⚡ Fast, low-cost transactions on Stellar

---

## 💻 How to Use the Application

### 1. Setup Wallet
1. Install **Freighter Wallet** browser extension
2. Create or import a wallet
3. Get testnet XLM from: https://laboratory.stellar.org/#account-creator

### 2. Submit a Claim
1. Navigate to "Submit Claim" page
2. Enter claim text, category, and sources
3. Pay 0.5 XLM submission fee
4. Sign transaction in Freighter

### 3. Register as Expert
1. Go to "Expert Dashboard"
2. Fill in your expertise details
3. Choose your tier and stake amount:
   - **General:** 100 XLM minimum
   - **Specialized:** 500 XLM minimum
   - **Professional:** 1000 XLM minimum
4. Sign transaction to complete registration

### 4. Review Claims
1. Browse claims on "Browse Claims" page
2. Click on a claim to view details
3. Submit your verdict with:
   - Verdict (True/False)
   - Confidence rating (0-100)
   - Reasoning/evidence
   - Review stake amount
4. Sign transaction to submit review

### 5. Track Reputation
- View your expert profile and reputation level
- Monitor accuracy rate and earnings
- Track total reviews and correct verdicts
- See your position on the leaderboard

---

## 🎯 Economic Model

### Fee Structure
- **Claim Submission:** 0.5 XLM per claim
- **Expert Stakes:**
  - General Expert: 100 XLM minimum
  - Specialized Expert: 500 XLM minimum
  - Professional Expert: 1000 XLM minimum

### Reward Distribution
- **Correct Reviews:** 80% of claim pool distributed proportionally
- **Incorrect Reviews:** 10% stake slashing as penalty
- **Stake Pool:** Accumulates from submission fees and stakes

### Reputation Levels
1. **Seedling** (0-99 points)
2. **Sprout** (100-499 points)
3. **Established** (500-999 points)
4. **Expert** (1000-4999 points)
5. **Master** (5000+ points)

---

## 🛠️ Development Commands

### Build Contracts
```bash
./build.sh
```

### Test Contracts
```bash
./test.sh
```

### Deploy Contracts (already deployed)
```bash
./deploy.sh
```

### Contract Invocation Helper
```bash
# View help
./invoke_contracts.sh help

# Submit a claim
./invoke_contracts.sh submit-claim <address> "Claim text" "Category" '["source1"]'

# Get claim details
./invoke_contracts.sh get-claim 1

# Register as expert
./invoke_contracts.sh register-expert <address> "Name" "Bio" '["Category"]' 1000000000

# Get expert profile
./invoke_contracts.sh get-expert <address>
```

### Frontend Development
```bash
cd truthstamp-app
npm install    # Install dependencies
npm start      # Start dev server
npm run build  # Create production build
```

---

## 📁 Project Structure

```
truthstamp-dapp/
├── contracts/                    # Smart contracts (Rust)
│   ├── claim_registry/          # Claim management (~650 lines)
│   ├── expert_registry/         # Expert registration (~420 lines)
│   └── review_consensus/        # Consensus calculation (~630 lines)
│
├── truthstamp-app/              # React frontend
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── SubmitClaim.tsx
│   │   │   ├── BrowseClaims.tsx
│   │   │   ├── ClaimDetail.tsx
│   │   │   ├── ExpertDashboard.tsx
│   │   │   └── Leaderboard.tsx
│   │   └── utils/
│   │       ├── contracts.ts     # Contract interaction
│   │       └── wallet.ts        # Wallet connection
│   └── package.json
│
├── build.sh                     # Build script for contracts
├── deploy.sh                    # Deployment script
├── invoke_contracts.sh          # CLI helper script
├── test.sh                      # Test script
├── Cargo.toml                   # Rust workspace config
│
└── Documentation/
    ├── README.md
    ├── ARCHITECTURE.md
    ├── GETTING_STARTED.md
    ├── INTEGRATION_GUIDE.md
    ├── DEPLOYED_CONTRACTS.md
    ├── PROJECT_SUMMARY.md
    └── ROADMAP.md
```

---

## 🔧 Tech Stack

### Backend (Smart Contracts)
- **Language:** Rust 1.91.0
- **Platform:** Stellar Soroban SDK 21.7.7
- **Build:** Cargo, WASM target
- **Testing:** Cargo test framework

### Frontend
- **Framework:** React 18.2.0
- **Language:** TypeScript 4.9.5
- **Routing:** React Router DOM 6.20.0
- **Blockchain:** Stellar SDK, Freighter Wallet API
- **Styling:** CSS3 with gradients and animations

### Tools
- **CLI:** Stellar CLI (stellar-cli)
- **Wallet:** Freighter Browser Extension
- **Explorer:** Stellar Expert
- **Network:** Stellar Soroban Testnet

---

## 🔗 Useful Links

- **GitHub Repository:** https://github.com/aryanjain281005/truthstamp-dapp
- **Stellar Soroban Docs:** https://stellar.org/soroban
- **Stellar Laboratory:** https://laboratory.stellar.org/
- **Freighter Wallet:** https://freighter.app/
- **Stellar Expert Explorer:** https://stellar.expert/explorer/testnet
- **Get Testnet XLM:** https://laboratory.stellar.org/#account-creator

---

## 📞 Support & Documentation

For detailed information, check these files in your project:
- `README.md` - Project overview and quick start
- `GETTING_STARTED.md` - Comprehensive setup guide
- `ARCHITECTURE.md` - System architecture details
- `INTEGRATION_GUIDE.md` - Frontend integration guide
- `DEPLOYED_CONTRACTS.md` - Contract addresses and details
- `PROJECT_SUMMARY.md` - Project summary and statistics

---

## 🎉 You're All Set!

Your TruthStamp decentralized fact-checking platform is running at:
**http://localhost:3000**

Install Freighter Wallet and start verifying claims! 🚀
