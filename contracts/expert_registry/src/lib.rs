#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short};

// Expert level based on stake amount
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ExpertLevel {
    General,      // 100 XLM
    Specialized,  // 500 XLM
    Professional, // 1000 XLM
}

// Reputation level based on reputation points
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ReputationLevel {
    Seedling,     // 0-99 points
    Sprout,       // 100-499 points
    Established,  // 500-999 points
    Expert,       // 1000-4999 points
    Master,       // 5000+ points
}

// Expert profile
#[contracttype]
#[derive(Clone, Debug)]
pub struct Expert {
    pub address: Address,
    pub name: String,
    pub bio: String,
    pub expertise_categories: Vec<String>,
    pub staked_amount: i128,
    pub expert_level: ExpertLevel,
    pub reputation_points: i64,
    pub reputation_level: ReputationLevel,
    pub total_reviews: u32,
    pub correct_reviews: u32,
    pub total_earnings: i128,
    pub registered_at: u64,
}

// Storage keys
#[contracttype]
pub enum DataKey {
    Expert(Address),
    ExpertCount,
    Admin,
    MinStakeGeneral,
    MinStakeSpecialized,
    MinStakeProfessional,
}

// Minimum stakes in stroops
const MIN_STAKE_GENERAL: i128 = 1_000_000_000;      // 100 XLM
const MIN_STAKE_SPECIALIZED: i128 = 5_000_000_000;  // 500 XLM
const MIN_STAKE_PROFESSIONAL: i128 = 10_000_000_000; // 1000 XLM

#[contract]
pub struct ExpertRegistry;

#[contractimpl]
impl ExpertRegistry {
    /// Initialize the contract
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ExpertCount, &0u64);
        env.storage().instance().set(&DataKey::MinStakeGeneral, &MIN_STAKE_GENERAL);
        env.storage().instance().set(&DataKey::MinStakeSpecialized, &MIN_STAKE_SPECIALIZED);
        env.storage().instance().set(&DataKey::MinStakeProfessional, &MIN_STAKE_PROFESSIONAL);
    }

    /// Register as an expert with stake
    pub fn register_expert(
        env: Env,
        expert: Address,
        name: String,
        bio: String,
        expertise_categories: Vec<String>,
        stake_amount: i128,
    ) -> bool {
        expert.require_auth();

        // Check if already registered
        if env.storage().instance().has(&DataKey::Expert(expert.clone())) {
            panic!("Expert already registered");
        }

        // Determine expert level based on stake
        let expert_level = Self::determine_expert_level(&env, stake_amount);

        // Note: In production, transfer stake from expert to contract
        // using Stellar Asset Contract

        let expert_profile = Expert {
            address: expert.clone(),
            name,
            bio,
            expertise_categories,
            staked_amount: stake_amount,
            expert_level,
            reputation_points: 0,
            reputation_level: ReputationLevel::Seedling,
            total_reviews: 0,
            correct_reviews: 0,
            total_earnings: 0,
            registered_at: env.ledger().timestamp(),
        };

        env.storage().instance().set(&DataKey::Expert(expert.clone()), &expert_profile);

        let mut expert_count: u64 = env.storage().instance().get(&DataKey::ExpertCount).unwrap_or(0);
        expert_count += 1;
        env.storage().instance().set(&DataKey::ExpertCount, &expert_count);

        env.events().publish((symbol_short!("expert_r"),), expert);

        true
    }

    /// Get expert profile
    pub fn get_expert(env: Env, expert: Address) -> Option<Expert> {
        env.storage().instance().get(&DataKey::Expert(expert))
    }

    /// Check if address is a registered expert
    pub fn is_expert(env: Env, expert: Address) -> bool {
        env.storage().instance().has(&DataKey::Expert(expert))
    }

    /// Update expert reputation (called after review consensus)
    pub fn update_reputation(env: Env, expert: Address, points_change: i64, was_correct: bool) {
        let mut expert_profile: Expert = env.storage().instance()
            .get(&DataKey::Expert(expert.clone()))
            .expect("Expert not found");

        expert_profile.reputation_points = expert_profile.reputation_points.saturating_add(points_change);
        
        // Ensure reputation doesn't go below 0
        if expert_profile.reputation_points < 0 {
            expert_profile.reputation_points = 0;
        }

        expert_profile.total_reviews += 1;
        if was_correct {
            expert_profile.correct_reviews += 1;
        }

        // Update reputation level
        expert_profile.reputation_level = Self::calculate_reputation_level(expert_profile.reputation_points);

        env.storage().instance().set(&DataKey::Expert(expert.clone()), &expert_profile);

        env.events().publish((symbol_short!("rep_upd"),), expert);
    }

    /// Add earnings to expert
    pub fn add_earnings(env: Env, expert: Address, amount: i128) {
        let mut expert_profile: Expert = env.storage().instance()
            .get(&DataKey::Expert(expert.clone()))
            .expect("Expert not found");

        expert_profile.total_earnings += amount;
        env.storage().instance().set(&DataKey::Expert(expert.clone()), &expert_profile);
    }

    /// Slash expert stake (for incorrect reviews)
    pub fn slash_stake(env: Env, expert: Address, amount: i128) -> i128 {
        let mut expert_profile: Expert = env.storage().instance()
            .get(&DataKey::Expert(expert.clone()))
            .expect("Expert not found");

        let slash_amount = if amount > expert_profile.staked_amount {
            expert_profile.staked_amount
        } else {
            amount
        };

        expert_profile.staked_amount -= slash_amount;
        env.storage().instance().set(&DataKey::Expert(expert.clone()), &expert_profile);

        slash_amount
    }

    /// Add to expert stake
    pub fn add_stake(env: Env, expert: Address, amount: i128) {
        expert.require_auth();

        let mut expert_profile: Expert = env.storage().instance()
            .get(&DataKey::Expert(expert.clone()))
            .expect("Expert not found");

        expert_profile.staked_amount += amount;
        expert_profile.expert_level = Self::determine_expert_level(&env, expert_profile.staked_amount);
        
        env.storage().instance().set(&DataKey::Expert(expert.clone()), &expert_profile);
    }

    /// Get expert count
    pub fn get_expert_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::ExpertCount).unwrap_or(0)
    }

    /// Get accuracy percentage
    pub fn get_accuracy(env: Env, expert: Address) -> u32 {
        let expert_profile: Expert = env.storage().instance()
            .get(&DataKey::Expert(expert))
            .expect("Expert not found");

        if expert_profile.total_reviews == 0 {
            return 0;
        }

        (expert_profile.correct_reviews * 100) / expert_profile.total_reviews
    }

    // Helper functions

    fn determine_expert_level(env: &Env, stake_amount: i128) -> ExpertLevel {
        let min_professional: i128 = env.storage().instance().get(&DataKey::MinStakeProfessional).unwrap_or(MIN_STAKE_PROFESSIONAL);
        let min_specialized: i128 = env.storage().instance().get(&DataKey::MinStakeSpecialized).unwrap_or(MIN_STAKE_SPECIALIZED);
        let min_general: i128 = env.storage().instance().get(&DataKey::MinStakeGeneral).unwrap_or(MIN_STAKE_GENERAL);

        if stake_amount >= min_professional {
            ExpertLevel::Professional
        } else if stake_amount >= min_specialized {
            ExpertLevel::Specialized
        } else if stake_amount >= min_general {
            ExpertLevel::General
        } else {
            panic!("Stake amount too low");
        }
    }

    fn calculate_reputation_level(points: i64) -> ReputationLevel {
        if points >= 5000 {
            ReputationLevel::Master
        } else if points >= 1000 {
            ReputationLevel::Expert
        } else if points >= 500 {
            ReputationLevel::Established
        } else if points >= 100 {
            ReputationLevel::Sprout
        } else {
            ReputationLevel::Seedling
        }
    }
}

#[cfg(test)]
mod test;
