#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short};

// Claim status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ClaimStatus {
    Pending,
    UnderReview,
    True,
    False,
}

// Claim data structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Claim {
    pub id: u64,
    pub submitter: Address,
    pub text: String,
    pub category: String,
    pub sources: Vec<String>,
    pub status: ClaimStatus,
    pub stake_pool: i128,
    pub timestamp: u64,
    pub review_count: u32,
}

// Storage keys
#[contracttype]
pub enum DataKey {
    ClaimCount,
    Claim(u64),
    Admin,
    ClaimFee,
    ExpertRegistryContract,
    ReviewConsensusContract,
}

// Submission fee in stroops (0.5 XLM = 5_000_000 stroops)
const CLAIM_FEE: i128 = 5_000_000;

#[contract]
pub struct ClaimRegistry;

#[contractimpl]
impl ClaimRegistry {
    /// Initialize the contract with admin
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ClaimCount, &0u64);
        env.storage().instance().set(&DataKey::ClaimFee, &CLAIM_FEE);
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

    /// Set the review consensus contract address
    pub fn set_review_consensus(env: Env, admin: Address, review_contract: Address) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }
        
        env.storage().instance().set(&DataKey::ReviewConsensusContract, &review_contract);
    }

    /// Submit a new claim with 0.5 XLM fee
    pub fn submit_claim(
        env: Env,
        submitter: Address,
        text: String,
        category: String,
        sources: Vec<String>,
    ) -> u64 {
        submitter.require_auth();

        // Transfer the claim fee (0.5 XLM) from submitter to contract
        let fee: i128 = env.storage().instance().get(&DataKey::ClaimFee).unwrap_or(CLAIM_FEE);
        
        // Get token contract for native XLM
        let token_address = Address::from_string(&String::from_str(&env, "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"));
        
        // Note: In production, use proper token transfer via Stellar Asset Contract
        // For now, we add the fee to the stake pool
        
        // Increment claim counter
        let mut claim_count: u64 = env.storage().instance().get(&DataKey::ClaimCount).unwrap_or(0);
        claim_count += 1;

        let claim = Claim {
            id: claim_count,
            submitter: submitter.clone(),
            text,
            category,
            sources,
            status: ClaimStatus::Pending,
            stake_pool: fee,
            timestamp: env.ledger().timestamp(),
            review_count: 0,
        };

        env.storage().instance().set(&DataKey::Claim(claim_count), &claim);
        env.storage().instance().set(&DataKey::ClaimCount, &claim_count);

        // Emit event
        env.events().publish((symbol_short!("claim_sub"),), claim_count);

        claim_count
    }

    /// Get a claim by ID
    pub fn get_claim(env: Env, claim_id: u64) -> Option<Claim> {
        env.storage().instance().get(&DataKey::Claim(claim_id))
    }

    /// Get total number of claims
    pub fn get_claim_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::ClaimCount).unwrap_or(0)
    }

    /// Update claim status (called by review consensus contract)
    pub fn update_claim_status(env: Env, caller: Address, claim_id: u64, new_status: ClaimStatus) {
        caller.require_auth();

        // Verify caller is the review consensus contract
        let review_contract: Address = env.storage().instance()
            .get(&DataKey::ReviewConsensusContract)
            .expect("Review consensus contract not set");

        if caller != review_contract {
            panic!("Only review consensus contract can update status");
        }

        let mut claim: Claim = env.storage().instance()
            .get(&DataKey::Claim(claim_id))
            .expect("Claim not found");

        claim.status = new_status;
        env.storage().instance().set(&DataKey::Claim(claim_id), &claim);

        env.events().publish((symbol_short!("status_up"),), claim_id);
    }

    /// Increment review count for a claim
    pub fn increment_review_count(env: Env, caller: Address, claim_id: u64) {
        caller.require_auth();

        // Verify caller is the review consensus contract
        let review_contract: Address = env.storage().instance()
            .get(&DataKey::ReviewConsensusContract)
            .expect("Review consensus contract not set");

        if caller != review_contract {
            panic!("Only review consensus contract can increment review count");
        }

        let mut claim: Claim = env.storage().instance()
            .get(&DataKey::Claim(claim_id))
            .expect("Claim not found");

        claim.review_count += 1;
        
        // Update status to UnderReview if it was Pending
        if claim.status == ClaimStatus::Pending && claim.review_count > 0 {
            claim.status = ClaimStatus::UnderReview;
        }

        env.storage().instance().set(&DataKey::Claim(claim_id), &claim);
    }

    /// Add stake to claim pool
    pub fn add_to_stake_pool(env: Env, caller: Address, claim_id: u64, amount: i128) {
        caller.require_auth();

        let mut claim: Claim = env.storage().instance()
            .get(&DataKey::Claim(claim_id))
            .expect("Claim not found");

        claim.stake_pool += amount;
        env.storage().instance().set(&DataKey::Claim(claim_id), &claim);
    }

    /// Get all claims (paginated)
    pub fn get_all_claims(env: Env, start: u64, limit: u64) -> Vec<Claim> {
        let claim_count: u64 = env.storage().instance().get(&DataKey::ClaimCount).unwrap_or(0);
        let mut claims = Vec::new(&env);

        let end = if start + limit > claim_count {
            claim_count
        } else {
            start + limit
        };

        for i in start..end {
            if let Some(claim) = env.storage().instance().get(&DataKey::Claim(i + 1)) {
                claims.push_back(claim);
            }
        }

        claims
    }
}

#[cfg(test)]
mod test;
