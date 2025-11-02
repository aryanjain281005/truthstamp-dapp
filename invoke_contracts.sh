#!/bin/bash

# TruthStamp Contract Invocation Script
# This script provides easy commands to invoke your deployed smart contracts

CLAIM_REGISTRY="CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY"
EXPERT_REGISTRY="CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC"
REVIEW_CONSENSUS="CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4"
ADMIN_ADDRESS="GAFOMD2BD4ML4P4EKPIGNQHPIJ7LYHPETTSY5LS7DNKFY32B35UAM6XA"

echo "🎯 TruthStamp Contract Invocation Helper"
echo "========================================"
echo ""

case "$1" in
  "submit-claim")
    echo "📝 Submitting claim to blockchain..."
    stellar contract invoke \
      --id $CLAIM_REGISTRY \
      --source deployer \
      --network testnet \
      -- \
      submit_claim \
      --submitter "$2" \
      --text "$3" \
      --category "$4" \
      --sources "$5"
    ;;

  "get-claim")
    echo "🔍 Getting claim #$2..."
    stellar contract invoke \
      --id $CLAIM_REGISTRY \
      --source deployer \
      --network testnet \
      -- \
      get_claim \
      --claim_id "$2"
    ;;

  "claim-count")
    echo "📊 Getting total claim count..."
    stellar contract invoke \
      --id $CLAIM_REGISTRY \
      --source deployer \
      --network testnet \
      -- \
      get_claim_count
    ;;

  "register-expert")
    echo "👨‍🔬 Registering as expert..."
    stellar contract invoke \
      --id $EXPERT_REGISTRY \
      --source deployer \
      --network testnet \
      -- \
      register_expert \
      --expert "$2" \
      --name "$3" \
      --bio "$4" \
      --expertise_categories "$5" \
      --stake_amount "$6"
    ;;

  "get-expert")
    echo "👤 Getting expert profile..."
    stellar contract invoke \
      --id $EXPERT_REGISTRY \
      --source deployer \
      --network testnet \
      -- \
      get_expert \
      --expert "$2"
    ;;

  "is-expert")
    echo "❓ Checking if address is expert..."
    stellar contract invoke \
      --id $EXPERT_REGISTRY \
      --source deployer \
      --network testnet \
      -- \
      is_expert \
      --expert "$2"
    ;;

  "expert-count")
    echo "📊 Getting expert count..."
    stellar contract invoke \
      --id $EXPERT_REGISTRY \
      --source deployer \
      --network testnet \
      -- \
      get_expert_count
    ;;

  "submit-review")
    echo "⭐ Submitting review..."
    stellar contract invoke \
      --id $REVIEW_CONSENSUS \
      --source deployer \
      --network testnet \
      -- \
      submit_review \
      --expert "$2" \
      --claim_id "$3" \
      --verdict "$4" \
      --confidence "$5" \
      --comment "$6"
    ;;

  "get-review")
    echo "🔍 Getting review..."
    stellar contract invoke \
      --id $REVIEW_CONSENSUS \
      --source deployer \
      --network testnet \
      -- \
      get_review \
      --claim_id "$2" \
      --expert "$3"
    ;;

  "get-consensus")
    echo "🎯 Getting consensus for claim..."
    stellar contract invoke \
      --id $REVIEW_CONSENSUS \
      --source deployer \
      --network testnet \
      -- \
      get_consensus \
      --claim_id "$2"
    ;;

  "help"|*)
    echo "Usage: ./invoke_contracts.sh <command> [arguments]"
    echo ""
    echo "Available commands:"
    echo ""
    echo "CLAIM REGISTRY:"
    echo "  submit-claim <submitter> <text> <category> <sources>"
    echo "    Example: ./invoke_contracts.sh submit-claim $ADMIN_ADDRESS \"AI will help humanity\" \"Technology\" '[\"https://example.com\"]'"
    echo ""
    echo "  get-claim <claim_id>"
    echo "    Example: ./invoke_contracts.sh get-claim 1"
    echo ""
    echo "  claim-count"
    echo "    Example: ./invoke_contracts.sh claim-count"
    echo ""
    echo "EXPERT REGISTRY:"
    echo "  register-expert <address> <name> <bio> <categories> <stake_amount>"
    echo "    Example: ./invoke_contracts.sh register-expert $ADMIN_ADDRESS \"John Doe\" \"Expert in AI\" '[\"Technology\"]' 1000000000"
    echo ""
    echo "  get-expert <address>"
    echo "    Example: ./invoke_contracts.sh get-expert $ADMIN_ADDRESS"
    echo ""
    echo "  is-expert <address>"
    echo "    Example: ./invoke_contracts.sh is-expert $ADMIN_ADDRESS"
    echo ""
    echo "  expert-count"
    echo "    Example: ./invoke_contracts.sh expert-count"
    echo ""
    echo "REVIEW CONSENSUS:"
    echo "  submit-review <expert> <claim_id> <verdict> <confidence> <comment>"
    echo "    Example: ./invoke_contracts.sh submit-review $ADMIN_ADDRESS 1 true 90 \"This is accurate\""
    echo ""
    echo "  get-review <claim_id> <expert>"
    echo "    Example: ./invoke_contracts.sh get-review 1 $ADMIN_ADDRESS"
    echo ""
    echo "  get-consensus <claim_id>"
    echo "    Example: ./invoke_contracts.sh get-consensus 1"
    echo ""
    echo "Contract Addresses:"
    echo "  Claim Registry:    $CLAIM_REGISTRY"
    echo "  Expert Registry:   $EXPERT_REGISTRY"
    echo "  Review Consensus:  $REVIEW_CONSENSUS"
    ;;
esac
