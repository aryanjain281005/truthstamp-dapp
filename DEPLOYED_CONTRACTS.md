# TruthStamp - Deployed Smart Contracts

## ✅ All Contracts Successfully Deployed on Stellar Soroban Testnet

### 1. Claim Registry Contract
- **Contract ID:** `CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY`
- **Purpose:** Manages claim submissions, status tracking, and stake pools
- **Functions:**
  - `submit_claim` - Submit new claims with 0.5 XLM fee
  - `get_claim` - Retrieve claim details by ID
  - `get_all_claims` - List claims with pagination
  - `update_claim_status` - Update claim verification status
  - `add_to_stake_pool` - Add stakes to claims
- **Explorer:** https://stellar.expert/explorer/testnet/contract/CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY

### 2. Expert Registry Contract
- **Contract ID:** `CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC`
- **Purpose:** Expert registration and reputation management
- **Functions:**
  - `register_expert` - Register as an expert with tiered stakes (100/500/1000 XLM)
  - `get_expert` - Retrieve expert profile
  - `is_expert` - Check if address is registered expert
  - `update_reputation` - Update expert reputation after reviews
  - `add_earnings` - Distribute rewards to experts
  - `slash_stake` - Penalize incorrect reviews
- **Explorer:** https://stellar.expert/explorer/testnet/contract/CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC

### 3. Review Consensus Contract
- **Contract ID:** `CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4`
- **Purpose:** Review submission and consensus calculation
- **Functions:**
  - `submit_review` - Submit expert reviews with stake
  - `get_review` - Retrieve review details
  - `get_consensus` - Calculate consensus with stake-weighted voting
  - `get_claim_reviews` - Get all reviews for a claim
  - Automatic reward distribution (80% payout, 10% slashing for incorrect reviews)
- **Explorer:** https://stellar.expert/explorer/testnet/contract/CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4

## Network Details
- **Network:** Stellar Soroban Testnet
- **RPC URL:** https://soroban-testnet.stellar.org:443
- **Network Passphrase:** Test SDF Network ; September 2015
- **Deployment Date:** November 2, 2025

## Frontend Integration
All contracts are integrated into the TruthStamp React app at:
- **URL:** http://localhost:3000
- **Config File:** `/truthstamp-app/src/utils/contracts.ts`

## Testing
Get free testnet XLM:
- Friendbot: https://laboratory.stellar.org/#account-creator
- Stellar Laboratory: https://laboratory.stellar.org/

## Contract Interactions
All three contracts work together:
1. Users submit claims via Claim Registry (0.5 XLM fee)
2. Experts register via Expert Registry (tiered stakes)
3. Experts review claims via Review Consensus
4. Consensus automatically calculates and distributes rewards
5. Expert reputations update based on accuracy
