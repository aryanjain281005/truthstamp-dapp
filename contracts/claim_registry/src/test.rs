#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String, Vec};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ClaimRegistry);
    let client = ClaimRegistryClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    assert_eq!(client.get_claim_count(), 0);
}

#[test]
fn test_submit_claim() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, ClaimRegistry);
    let client = ClaimRegistryClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let submitter = Address::generate(&env);
    
    client.initialize(&admin);

    let text = String::from_str(&env, "The Earth is round");
    let category = String::from_str(&env, "Science");
    let mut sources = Vec::new(&env);
    sources.push_back(String::from_str(&env, "https://nasa.gov"));

    let claim_id = client.submit_claim(&submitter, &text, &category, &sources);
    
    assert_eq!(claim_id, 1);
    assert_eq!(client.get_claim_count(), 1);

    let claim = client.get_claim(&claim_id).unwrap();
    assert_eq!(claim.id, 1);
    assert_eq!(claim.status, ClaimStatus::Pending);
    assert_eq!(claim.review_count, 0);
}
