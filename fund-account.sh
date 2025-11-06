#!/bin/bash

# Script to fund your Stellar testnet account
# Your public key: GC2Q7QI7OLFEFEC5BXWC5NQSIV2D6EKBYZVYISBVJAPDZSEPG4DBJM5I

PUBLIC_KEY="GC2Q7QI7OLFEFEC5BXWC5NQSIV2D6EKBYZVYISBVJAPDZSEPG4DBJM5I"

echo "🌟 Funding Stellar Testnet Account"
echo "===================================="
echo ""
echo "Public Key: $PUBLIC_KEY"
echo ""
echo "💰 Requesting 10,000 XLM from Friendbot..."
echo ""

# Fund the account using Stellar Friendbot
curl "https://friendbot.stellar.org?addr=$PUBLIC_KEY"

echo ""
echo ""
echo "✅ Account funded!"
echo ""
echo "🔍 Check your balance at:"
echo "https://stellar.expert/explorer/testnet/account/$PUBLIC_KEY"
echo ""
echo "💡 You can now use your wallet in the TruthStamp app!"
