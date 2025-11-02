#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ReviewConsensus);
    let client = ReviewConsensusClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    assert_eq!(client.get_review_count(), 0);
}

#[test]
fn test_submit_review() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, ReviewConsensus);
    let client = ReviewConsensusClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let expert = Address::generate(&env);
    
    client.initialize(&admin);

    let claim_id = 1u64;
    let reasoning = String::from_str(&env, "Evidence supports this claim");
    let stake = 1_000_000_000i128; // 100 XLM

    let review_id = client.submit_review(&expert, &claim_id, &Verdict::True, &reasoning, &95, &stake);
    
    assert_eq!(review_id, 1);
    assert_eq!(client.get_review_count(), 1);

    let review = client.get_review(&review_id).unwrap();
    assert_eq!(review.verdict, Verdict::True);
    assert_eq!(review.confidence, 95);
}

#[test]
fn test_consensus_calculation() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, ReviewConsensus);
    let client = ReviewConsensusClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let claim_id = 1u64;
    let reasoning = String::from_str(&env, "My analysis");

    // Three experts review - 2 vote True, 1 votes False
    let expert1 = Address::generate(&env);
    let expert2 = Address::generate(&env);
    let expert3 = Address::generate(&env);

    client.submit_review(&expert1, &claim_id, &Verdict::True, &reasoning, &90, &2_000_000_000i128);
    client.submit_review(&expert2, &claim_id, &Verdict::True, &reasoning, &85, &1_500_000_000i128);
    client.submit_review(&expert3, &claim_id, &Verdict::False, &reasoning, &70, &500_000_000i128);

    // Consensus should be reached after 3 reviews
    let consensus = client.get_consensus(&claim_id).unwrap();
    assert_eq!(consensus.final_verdict, Verdict::True);
    assert_eq!(consensus.is_finalized, true);
    
    // True stake: 3.5 billion, False stake: 0.5 billion
    // Confidence: 3.5 / 4.0 = 87.5% ≈ 87%
    assert!(consensus.confidence_percentage >= 85 && consensus.confidence_percentage <= 90);
}
