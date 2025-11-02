#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String, Vec};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ExpertRegistry);
    let client = ExpertRegistryClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    assert_eq!(client.get_expert_count(), 0);
}

#[test]
fn test_register_expert() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, ExpertRegistry);
    let client = ExpertRegistryClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let expert = Address::generate(&env);
    
    client.initialize(&admin);

    let name = String::from_str(&env, "Dr. Smith");
    let bio = String::from_str(&env, "PhD in Physics");
    let mut categories = Vec::new(&env);
    categories.push_back(String::from_str(&env, "Science"));
    
    let stake = 1_000_000_000i128; // 100 XLM

    let result = client.register_expert(&expert, &name, &bio, &categories, &stake);
    assert_eq!(result, true);
    assert_eq!(client.get_expert_count(), 1);

    let profile = client.get_expert(&expert).unwrap();
    assert_eq!(profile.expert_level, ExpertLevel::General);
    assert_eq!(profile.reputation_level, ReputationLevel::Seedling);
}

#[test]
fn test_update_reputation() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, ExpertRegistry);
    let client = ExpertRegistryClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let expert = Address::generate(&env);
    
    client.initialize(&admin);

    let name = String::from_str(&env, "Dr. Smith");
    let bio = String::from_str(&env, "PhD in Physics");
    let categories = Vec::new(&env);
    let stake = 1_000_000_000i128;

    client.register_expert(&expert, &name, &bio, &categories, &stake);
    
    // Correct review: +10 points
    client.update_reputation(&expert, &10, &true);
    
    let profile = client.get_expert(&expert).unwrap();
    assert_eq!(profile.reputation_points, 10);
    assert_eq!(profile.total_reviews, 1);
    assert_eq!(profile.correct_reviews, 1);

    // Incorrect review: -20 points
    client.update_reputation(&expert, &-20, &false);
    
    let profile = client.get_expert(&expert).unwrap();
    assert_eq!(profile.reputation_points, 0); // Can't go below 0
    assert_eq!(profile.total_reviews, 2);
    assert_eq!(profile.correct_reviews, 1);
}
