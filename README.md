# 🎯 TruthStamp - Decentralized Fact-Checking Platform

> A blockchain-based fact-checking system built on Stellar's Soroban smart contract platform

[![Stellar](https://img.shields.io/badge/Stellar-Soroban-blue)](https://stellar.org/soroban)
[![Rust](https://img.shields.io/badge/Rust-1.91.0-orange)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Deployed Contracts](#deployed-contracts)
- [Usage](#usage)
- [Development](#development)
- [Project Structure](#project-structure)
- [Documentation](#documentation)

## 🌟 Overview

TruthStamp is a decentralized fact-checking system that incentivizes expert verification through economic stakes and reputation management. Built on Stellar's Soroban platform, it uses three interconnected smart contracts to create a transparent, incentivized ecosystem for claim verification.

**Key Principles:**
- 💰 Economic stakes ensure accountability
- 🏆 Reputation-based expert system
- 🎯 Consensus-driven verification
- 📊 Transparent on-chain records
- ⚡ Fast, low-cost transactions on Stellar

## ✨ Features

### For Users
- 📝 **Submit Claims** - Post any factual claim for expert verification (0.5 XLM fee)
- 🔍 **Browse Verified Claims** - View all claims with verification status
- 💰 **Stake on Claims** - Add economic weight to claims you believe in
- 📊 **Track Consensus** - See real-time expert consensus on claims

### For Experts
- 👨‍🔬 **Register as Expert** - Three-tier system (General/Specialized/Professional)
- ⭐ **Review Claims** - Provide professional verdicts with confidence ratings
- 💎 **Earn Rewards** - Receive 80% of claim pools for correct reviews
- 🏆 **Build Reputation** - Dynamic reputation system with 5 levels
- 📈 **Track Performance** - Monitor accuracy rate and earnings

### System Features
- 🔗 **Freighter Wallet Integration** - Seamless blockchain transactions
- ⚖️ **Stake-Weighted Voting** - Higher stakes = more influence
- 🎯 **Automatic Consensus** - Smart contract calculates final verdict
- 💸 **Reward Distribution** - Automatic payouts to accurate experts
- ⚠️ **Slashing Mechanism** - 10% penalty for incorrect reviews

## 🏗️ Architecture

TruthStamp consists of three interconnected smart contracts:

### 1. Claim Registry Contract
**Contract ID:** `CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY`
<img width="2922" height="1594" alt="image" src="https://github.com/user-attachments/assets/f3d34c88-1b38-4086-a64c-a4586551b39c" />


Manages claim lifecycle and verification status.

**Key Functions:**
- `submit_claim()` - Submit new claims with 0.5 XLM fee
- `get_claim()` - Retrieve claim details
- `update_claim_status()` - Update verification status
- `add_to_stake_pool()` - Add stakes to claims

### 2. Expert Registry Contract
**Contract ID:** `CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC`

Handles expert registration and reputation management.

**Key Functions:**
- `register_expert()` - Register with tiered stakes (100/500/1000 XLM)
- `get_expert()` - Retrieve expert profile
- `update_reputation()` - Update expert reputation after reviews
- `add_earnings()` - Distribute rewards to experts
- `slash_stake()` - Penalize incorrect reviews

### 3. Review Consensus Contract
**Contract ID:** `CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4`

Calculates consensus and manages reward distribution.

**Key Functions:**
- `submit_review()` - Submit expert reviews
- `get_consensus()` - Calculate stake-weighted consensus
- `distribute_rewards()` - Payout to accurate experts

## 🚀 Getting Started

### Prerequisites

- **Rust** 1.91.0 or higher
- **Node.js** 16+ and npm
- **Stellar CLI** (replaces soroban-cli)
- **Freighter Wallet** browser extension

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd truthstamp
```

2. **Install Rust dependencies**
```bash
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

3. **Install frontend dependencies**
```bash
cd truthstamp-app
npm install
```

### Quick Start

1. **Build contracts**
```bash
./build.sh
```

2. **Deploy to testnet** (Optional - already deployed)
```bash
./deploy.sh
```

3. **Start the frontend**
```bash
cd truthstamp-app
npm start
```

4. **Open browser**
```
http://localhost:3000
```

## 📡 Deployed Contracts

All contracts are live on **Stellar Soroban Testnet**:

| Contract | Address | Explorer |
|----------|---------|----------|
| Claim Registry | `CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY` | [View](https://stellar.expert/explorer/testnet/contract/CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY) |
| Expert Registry | `CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC` | [View](https://stellar.expert/explorer/testnet/contract/CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC) |
| Review Consensus | `CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4` | [View](https://stellar.expert/explorer/testnet/contract/CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4) |

**Network Details:**
- Network: Stellar Soroban Testnet
- RPC URL: https://soroban-testnet.stellar.org:443
- Network Passphrase: `Test SDF Network ; September 2015`

## 💻 Usage

### Using the Web Interface

1. **Connect Wallet**
   - Install [Freighter Wallet](https://freighter.app)
   - Click "Connect Wallet" in the app
   - Approve connection

2. **Get Testnet XLM**
   - Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator)
   - Fund your account with testnet XLM

3. **Submit a Claim**
   - Go to "Submit Claim" page
   - Enter claim text, category, and sources
   - Pay 0.5 XLM fee
   - Sign transaction in Freighter

4. **Register as Expert**
   - Go to "Expert Dashboard"
   - Fill registration form
   - Choose expertise level and stake amount
   - Sign transaction

5. **Review Claims**
   - Browse claims on "Browse Claims" page
   - Click on a claim to review
   - Submit your verdict with confidence rating

### Using the CLI

We provide a convenient script for contract invocation:

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

# Check claim count
./invoke_contracts.sh claim-count
```

## 🛠️ Development

### Building Contracts

```bash
# Build all contracts
cargo build --target wasm32-unknown-unknown --release

# Or use the build script
./build.sh
```

### Testing Contracts

```bash
# Run tests
cargo test

# Or use the test script
./test.sh
```

### Running Frontend Locally

```bash
cd truthstamp-app
npm start
```

The app will open at `http://localhost:3000`

### Contract Invocation Examples

```bash
# Initialize contracts
stellar contract invoke --id <CONTRACT_ID> --source deployer --network testnet -- initialize --admin <ADDRESS>

# Submit claim
stellar contract invoke --id <CLAIM_CONTRACT> --source deployer --network testnet -- submit_claim --submitter <ADDRESS> --text "Claim" --category "Science" --sources '["url"]'

# Register expert
stellar contract invoke --id <EXPERT_CONTRACT> --source deployer --network testnet -- register_expert --expert <ADDRESS> --name "Name" --bio "Bio" --expertise_categories '["Science"]' --stake_amount 1000000000
```

## 📁 Project Structure

```
truthstamp/
├── contracts/                  # Smart contracts (Rust)
│   ├── claim_registry/        # Claim management contract
│   │   └── src/lib.rs        # Main contract logic (650 lines)
│   ├── expert_registry/       # Expert registration contract
│   │   └── src/lib.rs        # Main contract logic (420 lines)
│   └── review_consensus/      # Consensus calculation contract
│       └── src/lib.rs        # Main contract logic (630 lines)
├── truthstamp-app/            # React frontend
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── SubmitClaim.tsx
│   │   │   ├── BrowseClaims.tsx
│   │   │   ├── ClaimDetail.tsx
│   │   │   ├── ExpertDashboard.tsx
│   │   │   └── Leaderboard.tsx
│   │   └── utils/            # Utility functions
│   │       ├── contracts.ts  # Contract interaction
│   │       └── wallet.ts     # Wallet connection
│   └── package.json
├── build.sh                   # Build script for contracts
├── deploy.sh                  # Deployment script
├── invoke_contracts.sh        # CLI helper script
├── Cargo.toml                 # Rust workspace config
└── README.md                  # This file
```

## 📚 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture details
- [GETTING_STARTED.md](GETTING_STARTED.md) - Setup and installation guide
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Frontend integration guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview
- [DEPLOYED_CONTRACTS.md](DEPLOYED_CONTRACTS.md) - Contract addresses and details
- [ROADMAP.md](ROADMAP.md) - Future development plans

## 🔧 Tech Stack

### Smart Contracts
- **Language:** Rust 1.91.0
- **Platform:** Stellar Soroban SDK 21.7.7
- **Build:** Cargo, WASM target
- **Network:** Stellar Soroban Testnet

### Frontend
- **Framework:** React 18.2.0
- **Language:** TypeScript 4.9.5
- **Routing:** React Router DOM 6.20.0
- **Blockchain:** Stellar SDK, Freighter Wallet
- **Styling:** CSS3 with gradients and animations

### Tools
- **CLI:** Stellar CLI (stellar-cli)
- **Wallet:** Freighter Browser Extension
- **Explorer:** Stellar Expert
- **Testing:** Cargo test, React Testing Library

## 🎯 Economic Model

### Fee Structure
- **Claim Submission:** 0.5 XLM
- **Expert Stakes:** 
  - General: 100 XLM minimum
  - Specialized: 500 XLM minimum  
  - Professional: 1000 XLM minimum

### Reward Distribution
- **Correct Reviews:** 80% of claim pool
- **Incorrect Reviews:** 10% stake slashing
- **Stake Pool:** Accumulates from submission fees

### Reputation Levels
1. **Seedling** (0-99 points)
2. **Sprout** (100-499 points)
3. **Established** (500-999 points)
4. **Expert** (1000-4999 points)
5. **Master** (5000+ points)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stellar Foundation** - For the Soroban smart contract platform
- **Freighter Team** - For the excellent wallet integration
- **Rust Community** - For the amazing tooling

## 📞 Contact

- **Project:** TruthStamp
- **Network:** Stellar Soroban Testnet
- **Deployment Date:** November 2, 2025

## 🔗 Links

- [Stellar Soroban](https://stellar.org/soroban)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Freighter Wallet](https://freighter.app)
- [Stellar Expert Explorer](https://stellar.expert/explorer/testnet)

---

Built with ❤️ on Stellar Soroban
