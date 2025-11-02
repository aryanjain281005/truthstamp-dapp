# TruthStamp Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     TruthStamp DApp                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │            Frontend (React + TypeScript)            │    │
│  │                                                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │    │
│  │  │ Submit   │  │ Expert   │  │ Claim Detail │     │    │
│  │  │ Claim    │  │ Dashboard│  │ & Reviews    │     │    │
│  │  └──────────┘  └──────────┘  └──────────────┘     │    │
│  │                                                      │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │      Freighter Wallet Integration          │    │    │
│  │  └────────────────────────────────────────────┘    │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                      │
│                       │ Soroban Client SDK                   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │         Stellar Soroban Testnet                     │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │    Claim     │◄─┤    Expert    │  │  Review  │  │    │
│  │  │   Registry   │  │   Registry   │◄─┤Consensus │  │    │
│  │  │   Contract   │─►└──────────────┘  └──────────┘  │    │
│  │  └──────────────┘         ▲                │        │    │
│  │         │                 │                │        │    │
│  │         └─────────────────┴────────────────┘        │    │
│  │                Cross-Contract Calls                 │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Contract Architecture

### 1. Claim Registry Contract

**Purpose**: Manage claim submissions and lifecycle

**Storage Structure**:
```
DataKey::ClaimCount -> u64
DataKey::Claim(id) -> Claim {
    id: u64,
    submitter: Address,
    text: String,
    category: String,
    sources: Vec<String>,
    status: ClaimStatus,
    stake_pool: i128,
    timestamp: u64,
    review_count: u32
}
DataKey::Admin -> Address
DataKey::ClaimFee -> i128 (5_000_000 stroops = 0.5 XLM)
DataKey::ExpertRegistryContract -> Address
DataKey::ReviewConsensusContract -> Address
```

**Key Functions**:
- `initialize(admin)` - Set up contract
- `submit_claim(...)` - Create new claim with 0.5 XLM fee
- `get_claim(id)` - Retrieve claim details
- `update_claim_status(...)` - Update status (consensus contract only)
- `increment_review_count(...)` - Track reviews

**Access Control**:
- Submit: Any authenticated user
- Update status: Review Consensus contract only
- Admin functions: Contract admin only

### 2. Expert Registry Contract

**Purpose**: Manage expert profiles and reputation

**Storage Structure**:
```
DataKey::Expert(address) -> Expert {
    address: Address,
    name: String,
    bio: String,
    expertise_categories: Vec<String>,
    staked_amount: i128,
    expert_level: ExpertLevel,
    reputation_points: i64,
    reputation_level: ReputationLevel,
    total_reviews: u32,
    correct_reviews: u32,
    total_earnings: i128,
    registered_at: u64
}
DataKey::ExpertCount -> u64
DataKey::MinStakeGeneral -> i128 (100 XLM)
DataKey::MinStakeSpecialized -> i128 (500 XLM)
DataKey::MinStakeProfessional -> i128 (1000 XLM)
```

**Reputation System**:
```
Points      Level         Expert Level       Min Stake
0-99        Seedling      General            100 XLM
100-499     Sprout        Specialized        500 XLM
500-999     Established   Professional       1000 XLM
1000-4999   Expert
5000+       Master
```

**Key Functions**:
- `register_expert(...)` - Register with stake
- `get_expert(address)` - Get profile
- `update_reputation(...)` - Adjust reputation (consensus contract)
- `add_earnings(...)` - Track rewards
- `slash_stake(...)` - Penalize incorrect reviews

**Access Control**:
- Register: Any authenticated user with sufficient stake
- Update reputation/earnings: Review Consensus contract only

### 3. Review Consensus Contract

**Purpose**: Handle reviews, calculate consensus, distribute rewards

**Storage Structure**:
```
DataKey::Review(id) -> Review {
    id: u64,
    claim_id: u64,
    expert: Address,
    verdict: Verdict,
    reasoning: String,
    confidence: u32,
    stake_amount: i128,
    timestamp: u64,
    rewarded: bool
}
DataKey::ReviewCount -> u64
DataKey::ClaimReviews(claim_id) -> Vec<review_ids>
DataKey::ExpertReviews(expert) -> Vec<review_ids>
DataKey::ConsensusResult(claim_id) -> ConsensusResult {
    claim_id: u64,
    final_verdict: Verdict,
    total_stake_true: i128,
    total_stake_false: i128,
    confidence_percentage: u32,
    is_finalized: bool
}
DataKey::MinReviewsForConsensus -> u32 (3)
DataKey::RewardPercentage -> u32 (80%)
DataKey::SlashPercentage -> u32 (10%)
```

**Consensus Algorithm**:
```
1. Collect all reviews for a claim
2. Calculate total stake for True vs False
3. Winning verdict = side with >50% of stake
4. Confidence = (winning_stake / total_stake) * 100
5. Finalize after minimum 3 reviews
```

**Reward Distribution**:
```
Total Pool = sum of all stakes
Reward Pool = 80% of Total Pool

For correct voters:
    reward = (their_stake / total_winning_stake) * Reward Pool
    reputation += 10

For incorrect voters:
    slashed = 10% of their stake
    reputation -= 20
```

**Key Functions**:
- `submit_review(...)` - Submit verdict with stake
- `get_claim_reviews(claim_id)` - Get all reviews
- `get_consensus(claim_id)` - Get result
- `distribute_rewards(...)` - Payout winners (admin)

## Data Flow

### Claim Submission Flow

```
User → Frontend
  ↓
Connect Wallet (Freighter)
  ↓
Build Transaction
  ↓
Sign with Wallet
  ↓
Submit to Claim Registry
  ↓
Transfer 0.5 XLM Fee
  ↓
Store Claim
  ↓
Return Claim ID
  ↓
Update UI
```

### Expert Registration Flow

```
User → Frontend
  ↓
Enter Profile Details
  ↓
Select Expert Level (stake amount)
  ↓
Connect Wallet
  ↓
Sign Transaction
  ↓
Submit to Expert Registry
  ↓
Stake XLM
  ↓
Initialize Reputation (0 points, Seedling)
  ↓
Return Success
  ↓
Show Expert Dashboard
```

### Review & Consensus Flow

```
Expert → Select Claim
  ↓
Analyze Claim
  ↓
Submit Review (verdict, reasoning, stake)
  ↓
Review Consensus Contract
  ↓
Store Review
  ↓
Check Review Count
  ↓
If ≥ 3 reviews → Calculate Consensus
  ↓
Update Claim Status
  ↓
Admin Triggers Reward Distribution
  ↓
Calculate Winners/Losers
  ↓
Distribute Rewards (80% pool)
  ↓
Slash Losers (10%)
  ↓
Update Reputations (+10 / -20)
  ↓
Update Expert Earnings
  ↓
Notify Frontend
```

## Cross-Contract Communication

```
┌─────────────────┐
│ Claim Registry  │
│                 │
│ submit_claim()  │
└────────┬────────┘
         │
         │ Stores claim with
         │ Pending status
         │
         ▼
┌─────────────────────┐
│ Review Consensus    │
│                     │
│ submit_review()     │
│   ↓                 │
│ Check expert exists │──→ Expert Registry
│   ↓                 │    (is_expert)
│ Store review        │
│   ↓                 │
│ Calculate consensus │
│   ↓                 │
│ Update claim status │──→ Claim Registry
│                     │    (update_claim_status)
│ distribute_rewards()│
│   ↓                 │
│ Update reputation   │──→ Expert Registry
│                     │    (update_reputation)
│ Add earnings        │──→ Expert Registry
│                     │    (add_earnings)
│ Slash stake         │──→ Expert Registry
│                     │    (slash_stake)
└─────────────────────┘
```

## Security Model

### Authentication
- All state-changing functions require `require_auth()`
- Wallet signature verification via Freighter
- Address-based permissions

### Authorization
- Admin-only functions (initialize, set contracts)
- Contract-to-contract permissions
- Expert verification for reviews

### Economic Security
- Minimum stakes enforce quality
- Slashing discourages false reviews
- Reputation system creates long-term incentives

### Input Validation
- Confidence limited to 0-100
- Stake amounts validated against minimums
- Duplicate review prevention

## Performance Considerations

### Storage Optimization
- Use instance storage for contract state
- Efficient key structures
- Minimal data duplication

### Gas Optimization
- Batch operations where possible
- Efficient data structures (Vec, Map)
- Minimal cross-contract calls

### Scalability
- Paginated claim retrieval
- Indexed reviews by claim and expert
- Lazy consensus calculation

## Future Enhancements

1. **Multi-Category Support**
   - Category-specific expert pools
   - Dynamic stake requirements by category

2. **Time-Based Consensus**
   - Review deadlines
   - Automatic finalization

3. **Advanced Reputation**
   - Category-specific reputation
   - Historical accuracy tracking
   - Expert rankings

4. **Governance**
   - DAO for parameter updates
   - Community voting on disputes

5. **Integration**
   - Oracle integration for external data
   - NFT badges for expert levels
   - Cross-chain bridges

## Technology Stack

**Smart Contracts**:
- Language: Rust
- Framework: Soroban SDK
- Network: Stellar
- Version: 21.7.1

**Development Tools**:
- Cargo (Rust package manager)
- Soroban CLI
- Rust Analyzer

**Testing**:
- Soroban SDK testutils
- Unit tests per contract
- Integration test scripts

**Deployment**:
- Testnet: Soroban Testnet
- RPC: https://soroban-testnet.stellar.org:443
- Friendbot for test XLM

## Monitoring & Observability

**On-Chain Events**:
- `claim_sub` - New claim submitted
- `status_up` - Claim status updated
- `expert_r` - Expert registered
- `rep_upd` - Reputation updated
- `review_s` - Review submitted
- `consensus` - Consensus reached
- `rewards` - Rewards distributed

**Metrics to Track**:
- Total claims submitted
- Expert registration rate
- Average review time
- Consensus accuracy
- Reward distribution amounts
- Reputation score distribution

---

This architecture enables a fully decentralized fact-checking platform with economic incentives and reputation tracking on Stellar Soroban.
