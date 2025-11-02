#!/bin/bash

# TruthStamp Smart Contracts Build Script
# This script builds all Soroban contracts for the TruthStamp DApp

set -e

echo "🔨 Building TruthStamp Smart Contracts..."

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI is not installed. Please install it first:"
    echo "   cargo install --locked stellar-cli"
    exit 1
fi

# Build all contracts
echo ""
echo "📦 Building Claim Registry Contract..."
cd contracts/claim_registry
stellar contract build
cd ../..

echo ""
echo "📦 Building Expert Registry Contract..."
cd contracts/expert_registry
stellar contract build
cd ../..

echo ""
echo "📦 Building Review Consensus Contract..."
cd contracts/review_consensus
stellar contract build
cd ../..

echo ""
echo "✅ All contracts built successfully!"
echo ""
echo "📁 WASM files location:"
echo "   - target/wasm32-unknown-unknown/release/claim_registry.wasm"
echo "   - target/wasm32-unknown-unknown/release/expert_registry.wasm"
echo "   - target/wasm32-unknown-unknown/release/review_consensus.wasm"
