#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short, Map};

// Verdict type
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Verdict {
    True,
    False,
}

// Review structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Review {
    pub id: u64,
    pub claim_id: u64,
    pub expert: Address,
    pub verdict: Verdict,
    pub reasoning: String,
    pub confidence: u32,  // 0-100
    pub stake_amount: i128,
    pub timestamp: u64,
    pub rewarded: bool,
}

// Consensus result
#[contracttype]
#[derive(Clone, Debug)]
pub struct ConsensusResult {
    pub claim_id: u64,
    pub final_verdict: Verdict,
    pub total_stake_true: i128,
    pub total_stake_false: i128,
    pub confidence_percentage: u32,
    pub is_finalized: bool,
}

// Storage keys
#[contracttype]
pub enum DataKey {
    Review(u64),
    ReviewCount,
    ClaimReviews(u64),        // Maps claim_id -> Vec<review_ids>
    ExpertReviews(Address),   // Maps expert -> Vec<review_ids>
    ConsensusResult(u64),     // Maps claim_id -> ConsensusResult
    Admin,
    ClaimRegistryContract,
    ExpertRegistryContract,
    MinReviewsForConsensus,
    RewardPercentage,
    SlashPercentage,
    CorrectReviewPoints,
    IncorrectReviewPoints,
}

const MIN_REVIEWS_FOR_CONSENSUS: u32 = 3;
const REWARD_PERCENTAGE: u32 = 80;  // 80% of stake pool to winners
const SLASH_PERCENTAGE: u32 = 10;   // 10% slash for losers
const CORRECT_REVIEW_POINTS: i64 = 10;
const INCORRECT_REVIEW_POINTS: i64 = -20;

#[contract]
pub struct ReviewConsensus;

#[contractimpl]
impl ReviewConsensus {
    /// Initialize the contract
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ReviewCount, &0u64);
        env.storage().instance().set(&DataKey::MinReviewsForConsensus, &MIN_REVIEWS_FOR_CONSENSUS);
        env.storage().instance().set(&DataKey::RewardPercentage, &REWARD_PERCENTAGE);
        env.storage().instance().set(&DataKey::SlashPercentage, &SLASH_PERCENTAGE);
        env.storage().instance().set(&DataKey::CorrectReviewPoints, &CORRECT_REVIEW_POINTS);
        env.storage().instance().set(&DataKey::IncorrectReviewPoints, &INCORRECT_REVIEW_POINTS);
    }

    /// Set the claim registry contract address
    pub fn set_claim_registry(env: Env, admin: Address, claim_contract: Address) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        env.storage().instance().set(&DataKey::ClaimRegistryContract, &claim_contract);
    }

    /// Set the expert registry contract address
    pub fn set_expert_registry(env: Env, admin: Address, expert_contract: Address) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        env.storage().instance().set(&DataKey::ExpertRegistryContract, &expert_contract);
    }

    /// Submit a review for a claim
    pub fn submit_review(
        env: Env,
        expert: Address,
        claim_id: u64,
        verdict: Verdict,
        reasoning: String,
        confidence: u32,
        stake_amount: i128,
    ) -> u64 {
        expert.require_auth();

        // Validate confidence is between 0-100
        if confidence > 100 {
            panic!("Confidence must be between 0 and 100");
        }

        // Check if expert is registered (would call expert registry)
        // In production: call expert_registry.is_expert(expert)

        // Check if claim exists (would call claim registry)
        // In production: call claim_registry.get_claim(claim_id)

        // Check if expert has already reviewed this claim
        let claim_reviews: Vec<u64> = env.storage().instance()
            .get(&DataKey::ClaimReviews(claim_id))
            .unwrap_or(Vec::new(&env));

        for review_id in claim_reviews.iter() {
            let review: Review = env.storage().instance()
                .get(&DataKey::Review(review_id))
                .unwrap();
            if review.expert == expert {
                panic!("Expert has already reviewed this claim");
            }
        }

        // Create the review
        let mut review_count: u64 = env.storage().instance().get(&DataKey::ReviewCount).unwrap_or(0);
        review_count += 1;

        let review = Review {
            id: review_count,
            claim_id,
            expert: expert.clone(),
            verdict: verdict.clone(),
            reasoning,
            confidence,
            stake_amount,
            timestamp: env.ledger().timestamp(),
            rewarded: false,
        };

        // Store the review
        env.storage().instance().set(&DataKey::Review(review_count), &review);
        env.storage().instance().set(&DataKey::ReviewCount, &review_count);

        // Add review to claim's review list
        let mut claim_reviews: Vec<u64> = env.storage().instance()
            .get(&DataKey::ClaimReviews(claim_id))
            .unwrap_or(Vec::new(&env));
        claim_reviews.push_back(review_count);
        env.storage().instance().set(&DataKey::ClaimReviews(claim_id), &claim_reviews);

        // Add review to expert's review list
        let mut expert_reviews: Vec<u64> = env.storage().instance()
            .get(&DataKey::ExpertReviews(expert.clone()))
            .unwrap_or(Vec::new(&env));
        expert_reviews.push_back(review_count);
        env.storage().instance().set(&DataKey::ExpertReviews(expert.clone()), &expert_reviews);

        // Check if we can reach consensus
        let review_count_for_claim = claim_reviews.len();
        let min_reviews: u32 = env.storage().instance()
            .get(&DataKey::MinReviewsForConsensus)
            .unwrap_or(MIN_REVIEWS_FOR_CONSENSUS);

        if review_count_for_claim >= min_reviews {
            Self::calculate_consensus(&env, claim_id);
        }

        env.events().publish((symbol_short!("review_s"),), review_count);

        review_count
    }

    /// Get a review by ID
    pub fn get_review(env: Env, review_id: u64) -> Option<Review> {
        env.storage().instance().get(&DataKey::Review(review_id))
    }

    /// Get all reviews for a claim
    pub fn get_claim_reviews(env: Env, claim_id: u64) -> Vec<Review> {
        let review_ids: Vec<u64> = env.storage().instance()
            .get(&DataKey::ClaimReviews(claim_id))
            .unwrap_or(Vec::new(&env));

        let mut reviews = Vec::new(&env);
        for review_id in review_ids.iter() {
            if let Some(review) = env.storage().instance().get(&DataKey::Review(review_id)) {
                reviews.push_back(review);
            }
        }

        reviews
    }

    /// Get consensus result for a claim
    pub fn get_consensus(env: Env, claim_id: u64) -> Option<ConsensusResult> {
        env.storage().instance().get(&DataKey::ConsensusResult(claim_id))
    }

    /// Calculate consensus for a claim (internal)
    fn calculate_consensus(env: &Env, claim_id: u64) {
        let review_ids: Vec<u64> = env.storage().instance()
            .get(&DataKey::ClaimReviews(claim_id))
            .unwrap_or(Vec::new(env));

        let mut total_stake_true: i128 = 0;
        let mut total_stake_false: i128 = 0;

        // Calculate total stakes for each verdict
        for review_id in review_ids.iter() {
            let review: Review = env.storage().instance()
                .get(&DataKey::Review(review_id))
                .unwrap();

            match review.verdict {
                Verdict::True => total_stake_true += review.stake_amount,
                Verdict::False => total_stake_false += review.stake_amount,
            }
        }

        let total_stake = total_stake_true + total_stake_false;

        // Determine the winning verdict (>50% of stake)
        let (final_verdict, winning_stake) = if total_stake_true > total_stake_false {
            (Verdict::True, total_stake_true)
        } else {
            (Verdict::False, total_stake_false)
        };

        // Calculate confidence percentage
        let confidence_percentage = if total_stake > 0 {
            ((winning_stake * 100) / total_stake) as u32
        } else {
            0
        };

        let consensus = ConsensusResult {
            claim_id,
            final_verdict: final_verdict.clone(),
            total_stake_true,
            total_stake_false,
            confidence_percentage,
            is_finalized: true,
        };

        env.storage().instance().set(&DataKey::ConsensusResult(claim_id), &consensus);

        env.events().publish((symbol_short!("consensus"),), claim_id);
    }

    /// Distribute rewards and update reputations after consensus
    pub fn distribute_rewards(env: Env, admin: Address, claim_id: u64) {
        admin.require_auth();

        let consensus: ConsensusResult = env.storage().instance()
            .get(&DataKey::ConsensusResult(claim_id))
            .expect("Consensus not reached");

        let review_ids: Vec<u64> = env.storage().instance()
            .get(&DataKey::ClaimReviews(claim_id))
            .unwrap_or(Vec::new(&env));

        let mut total_winning_stake: i128 = 0;
        let mut total_losing_stake: i128 = 0;

        // Calculate total winning and losing stakes
        for review_id in review_ids.iter() {
            let review: Review = env.storage().instance()
                .get(&DataKey::Review(review_id))
                .unwrap();

            if review.verdict == consensus.final_verdict {
                total_winning_stake += review.stake_amount;
            } else {
                total_losing_stake += review.stake_amount;
            }
        }

        let reward_percentage: u32 = env.storage().instance()
            .get(&DataKey::RewardPercentage)
            .unwrap_or(REWARD_PERCENTAGE);

        let slash_percentage: u32 = env.storage().instance()
            .get(&DataKey::SlashPercentage)
            .unwrap_or(SLASH_PERCENTAGE);

        // Calculate total reward pool (80% of total stake pool)
        let total_reward_pool = (total_winning_stake + total_losing_stake) * (reward_percentage as i128) / 100;

        let correct_points: i64 = env.storage().instance()
            .get(&DataKey::CorrectReviewPoints)
            .unwrap_or(CORRECT_REVIEW_POINTS);

        let incorrect_points: i64 = env.storage().instance()
            .get(&DataKey::IncorrectReviewPoints)
            .unwrap_or(INCORRECT_REVIEW_POINTS);

        // Distribute rewards and update reputations
        for review_id in review_ids.iter() {
            let mut review: Review = env.storage().instance()
                .get(&DataKey::Review(review_id))
                .unwrap();

            if review.rewarded {
                continue; // Skip if already rewarded
            }

            let is_correct = review.verdict == consensus.final_verdict;

            if is_correct {
                // Calculate proportional reward
                let reward = (review.stake_amount * total_reward_pool) / total_winning_stake;
                
                // In production: transfer reward to expert
                // expert_registry.add_earnings(review.expert, reward)
                
                // Update reputation (+10)
                // expert_registry.update_reputation(review.expert, +10, true)
            } else {
                // Slash 10% of stake
                let slash_amount = (review.stake_amount * (slash_percentage as i128)) / 100;
                
                // In production: slash expert stake
                // expert_registry.slash_stake(review.expert, slash_amount)
                
                // Update reputation (-20)
                // expert_registry.update_reputation(review.expert, -20, false)
            }

            review.rewarded = true;
            env.storage().instance().set(&DataKey::Review(review_id), &review);
        }

        env.events().publish((symbol_short!("rewards"),), claim_id);
    }

    /// Get review count
    pub fn get_review_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::ReviewCount).unwrap_or(0)
    }

    /// Get expert's reviews
    pub fn get_expert_reviews(env: Env, expert: Address) -> Vec<Review> {
        let review_ids: Vec<u64> = env.storage().instance()
            .get(&DataKey::ExpertReviews(expert))
            .unwrap_or(Vec::new(&env));

        let mut reviews = Vec::new(&env);
        for review_id in review_ids.iter() {
            if let Some(review) = env.storage().instance().get(&DataKey::Review(review_id)) {
                reviews.push_back(review);
            }
        }

        reviews
    }
}

#[cfg(test)]
mod test;
