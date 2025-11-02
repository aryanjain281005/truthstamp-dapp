#!/bin/bash

# TruthStamp Test Script
# Runs all contract tests

set -e

echo "🧪 Running TruthStamp Smart Contract Tests..."

echo ""
echo "Testing Claim Registry Contract..."
cd contracts/claim_registry
cargo test
cd ../..

echo ""
echo "Testing Expert Registry Contract..."
cd contracts/expert_registry
cargo test
cd ../..

echo ""
echo "Testing Review Consensus Contract..."
cd contracts/review_consensus
cargo test
cd ../..

echo ""
echo "✅ All tests passed!"
