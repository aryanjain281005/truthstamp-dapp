#!/bin/bash

# TruthStamp Smart Contracts Deployment Script for Stellar Soroban Testnet
# This script deploys all contracts to the testnet and initializes them

set -e

echo "🚀 Deploying TruthStamp Smart Contracts to Soroban Testnet..."

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI is not installed. Please install it first:"
    echo "   cargo install --locked stellar-cli"
    exit 1
fi

# Configuration
NETWORK="testnet"
SOROBAN_RPC_URL="https://soroban-testnet.stellar.org:443"
SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Create identity if it doesn't exist
if ! stellar keys show deployer &> /dev/null; then
    echo "Creating deployer identity..."
    stellar keys generate deployer --network $NETWORK
fi

# Get deployer address
DEPLOYER_ADDRESS=$(stellar keys address deployer)
echo "Deployer address: $DEPLOYER_ADDRESS"

# Fund the deployer account with Friendbot
echo ""
echo "💰 Funding deployer account with Friendbot..."
curl "https://friendbot.stellar.org?addr=$DEPLOYER_ADDRESS"

echo ""
echo ""
echo "📦 Deploying Claim Registry Contract..."
CLAIM_REGISTRY_ID=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/claim_registry.wasm \
    --source deployer \
    --network $NETWORK)
echo "✅ Claim Registry deployed: $CLAIM_REGISTRY_ID"

echo ""
echo "📦 Deploying Expert Registry Contract..."
EXPERT_REGISTRY_ID=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/expert_registry.wasm \
    --source deployer \
    --network $NETWORK)
echo "✅ Expert Registry deployed: $EXPERT_REGISTRY_ID"

echo ""
echo "📦 Deploying Review Consensus Contract..."
REVIEW_CONSENSUS_ID=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/review_consensus.wasm \
    --source deployer \
    --network $NETWORK)
echo "✅ Review Consensus deployed: $REVIEW_CONSENSUS_ID"

echo ""
echo "⚙️  Initializing contracts..."

# Initialize Claim Registry
echo "Initializing Claim Registry..."
stellar contract invoke \
    --id $CLAIM_REGISTRY_ID \
    --source deployer \
    --network $NETWORK \
    -- initialize \
    --admin $DEPLOYER_ADDRESS

# Initialize Expert Registry
echo "Initializing Expert Registry..."
stellar contract invoke \
    --id $EXPERT_REGISTRY_ID \
    --source deployer \
    --network $NETWORK \
    -- initialize \
    --admin $DEPLOYER_ADDRESS

# Initialize Review Consensus
echo "Initializing Review Consensus..."
stellar contract invoke \
    --id $REVIEW_CONSENSUS_ID \
    --source deployer \
    --network $NETWORK \
    -- initialize \
    --admin $DEPLOYER_ADDRESS

# Link contracts together
echo ""
echo "🔗 Linking contracts..."

echo "Setting Expert Registry in Claim Registry..."
stellar contract invoke \
    --id $CLAIM_REGISTRY_ID \
    --source deployer \
    --network $NETWORK \
    -- set_expert_registry \
    --admin $DEPLOYER_ADDRESS \
    --expert_contract $EXPERT_REGISTRY_ID

echo "Setting Review Consensus in Claim Registry..."
stellar contract invoke \
    --id $CLAIM_REGISTRY_ID \
    --source deployer \
    --network $NETWORK \
    -- set_review_consensus \
    --admin $DEPLOYER_ADDRESS \
    --review_contract $REVIEW_CONSENSUS_ID

echo "Setting Claim Registry in Review Consensus..."
stellar contract invoke \
    --id $REVIEW_CONSENSUS_ID \
    --source deployer \
    --network $NETWORK \
    -- set_claim_registry \
    --admin $DEPLOYER_ADDRESS \
    --claim_contract $CLAIM_REGISTRY_ID

echo "Setting Expert Registry in Review Consensus..."
stellar contract invoke \
    --id $REVIEW_CONSENSUS_ID \
    --source deployer \
    --network $NETWORK \
    -- set_expert_registry \
    --admin $DEPLOYER_ADDRESS \
    --expert_contract $EXPERT_REGISTRY_ID

echo ""
echo "✅ All contracts deployed and initialized successfully!"
echo ""
echo "📝 Contract Addresses:"
echo "   Claim Registry:   $CLAIM_REGISTRY_ID"
echo "   Expert Registry:  $EXPERT_REGISTRY_ID"
echo "   Review Consensus: $REVIEW_CONSENSUS_ID"
echo ""
echo "💾 Saving contract addresses to .env file..."

cat > .env << EOF
# TruthStamp Contract Addresses - Soroban Testnet
VITE_CLAIM_REGISTRY_CONTRACT=$CLAIM_REGISTRY_ID
VITE_EXPERT_REGISTRY_CONTRACT=$EXPERT_REGISTRY_ID
VITE_REVIEW_CONSENSUS_CONTRACT=$REVIEW_CONSENSUS_ID
VITE_NETWORK=testnet
VITE_SOROBAN_RPC_URL=$SOROBAN_RPC_URL
VITE_NETWORK_PASSPHRASE=$SOROBAN_NETWORK_PASSPHRASE
EOF

echo "✅ Contract addresses saved to .env file"
echo ""
echo "🎉 Deployment complete! You can now build the frontend."
