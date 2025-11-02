# 🚀 Getting Started with TruthStamp

**Welcome to TruthStamp!** This guide will get you from zero to deployed smart contracts in under 10 minutes.

## 🎯 What You'll Achieve

By following this guide, you will:
- ✅ Build 3 Soroban smart contracts
- ✅ Run comprehensive tests
- ✅ Deploy to Stellar testnet
- ✅ Have contracts ready for frontend integration

## ⚡ Quick Start (For the Impatient)

```bash
cd /Users/aryanjain/Documents/git

# 1. Build contracts
./build.sh

# 2. Run tests  
./test.sh

# 3. Deploy to testnet
./deploy.sh

# Done! Your contracts are now live on Stellar Soroban testnet! 🎉
```

Contract addresses will be in `.env` file.

---

## 📋 Prerequisites

Before you start, make sure you have:

### 1. Rust Installed
```bash
# Check if Rust is installed
rustc --version

# Should show: rustc 1.70.0 or later
# If not installed, run:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. WASM Target Added
```bash
# Check if WASM target is installed
rustup target list | grep wasm32-unknown-unknown

# Should show: wasm32-unknown-unknown (installed)
# If not, run:
rustup target add wasm32-unknown-unknown
```

### 3. Soroban CLI Installed
```bash
# Check if Soroban is installed
soroban --version

# Should show: soroban 21.0.0 or later
# If not installed, run:
cargo install --locked soroban-cli
```

### Quick Install All Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli

# Verify installations
rustc --version && soroban --version
```

---

## 🔨 Step 1: Build the Contracts

Navigate to the project directory and build:

```bash
cd /Users/aryanjain/Documents/git
./build.sh
```

**Expected Output:**
```
🔨 Building TruthStamp Smart Contracts...

📦 Building Claim Registry Contract...
   Compiling claim_registry v0.1.0
    Finished release [optimized] target(s)

📦 Building Expert Registry Contract...
   Compiling expert_registry v0.1.0
    Finished release [optimized] target(s)

📦 Building Review Consensus Contract...
   Compiling review_consensus v0.1.0
    Finished release [optimized] target(s)

✅ All contracts built successfully!

📁 WASM files location:
   - target/wasm32-unknown-unknown/release/claim_registry.wasm
   - target/wasm32-unknown-unknown/release/expert_registry.wasm
   - target/wasm32-unknown-unknown/release/review_consensus.wasm
```

**What Just Happened?**
- Compiled 3 Rust contracts to WebAssembly (WASM)
- Optimized for deployment
- Ready to deploy to Soroban

**Troubleshooting:**
```bash
# If build fails, try:
cargo clean
rustup update
./build.sh
```

---

## 🧪 Step 2: Run the Tests

Verify everything works correctly:

```bash
./test.sh
```

**Expected Output:**
```
🧪 Running TruthStamp Smart Contract Tests...

Testing Claim Registry Contract...
   Compiling claim_registry v0.1.0
    Finished test [unoptimized + debuginfo]
     Running tests (target/debug/deps/claim_registry-...)

running 3 tests
test test_initialize ... ok
test test_submit_claim ... ok
test test_get_claim ... ok

test result: ok. 3 passed; 0 failed

Testing Expert Registry Contract...
running 4 tests
test test_initialize ... ok
test test_register_expert ... ok
test test_update_reputation ... ok
test test_get_accuracy ... ok

test result: ok. 4 passed; 0 failed

Testing Review Consensus Contract...
running 4 tests
test test_initialize ... ok
test test_submit_review ... ok
test test_consensus_calculation ... ok
test test_get_reviews ... ok

test result: ok. 4 passed; 0 failed

✅ All tests passed!
```

**What Just Happened?**
- Ran 11 unit tests across all contracts
- Verified claim submission works
- Verified expert registration works
- Verified review and consensus logic works
- All tests passed! ✅

**Troubleshooting:**
```bash
# If tests fail, check the error message
# Run tests with more detail:
cd contracts/claim_registry && cargo test -- --nocapture
```

---

## 🌐 Step 3: Deploy to Testnet

Now deploy your contracts to Stellar Soroban testnet:

```bash
./deploy.sh
```

**Expected Output:**
```
🚀 Deploying TruthStamp Smart Contracts to Soroban Testnet...

Creating deployer identity...
✅ Generated new key: deployer

Deployer address: GCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

💰 Funding deployer account with Friendbot...
{
  "successful": true,
  "hash": "...",
  "ledger": 123456
}

📦 Deploying Claim Registry Contract...
✅ Claim Registry deployed: CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

📦 Deploying Expert Registry Contract...
✅ Expert Registry deployed: CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB

📦 Deploying Review Consensus Contract...
✅ Review Consensus deployed: CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC

⚙️  Initializing contracts...
Initializing Claim Registry...
Initializing Expert Registry...
Initializing Review Consensus...

🔗 Linking contracts...
Setting Expert Registry in Claim Registry...
Setting Review Consensus in Claim Registry...
Setting Claim Registry in Review Consensus...
Setting Expert Registry in Review Consensus...

✅ All contracts deployed and initialized successfully!

📝 Contract Addresses:
   Claim Registry:   CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
   Expert Registry:  CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
   Review Consensus: CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC

💾 Saving contract addresses to .env file...
✅ Contract addresses saved to .env file

🎉 Deployment complete! You can now build the frontend.
```

**What Just Happened?**
- Created a Soroban identity (deployer)
- Funded the account with test XLM from Friendbot
- Deployed 3 contracts to testnet
- Initialized each contract with admin
- Linked contracts together (for cross-contract calls)
- Saved contract addresses to `.env` file

**Important:** Save these contract addresses! You'll need them for the frontend.

---

## ✅ Step 4: Verify Deployment

Check that everything deployed correctly:

```bash
# View contract addresses
cat .env

# You should see:
# VITE_CLAIM_REGISTRY_CONTRACT=CAAAA...
# VITE_EXPERT_REGISTRY_CONTRACT=CBBB...
# VITE_REVIEW_CONSENSUS_CONTRACT=CCCC...
```

**Verify on Stellar Explorer:**
1. Go to https://stellar.expert/explorer/testnet
2. Search for your contract addresses
3. You should see your deployed contracts!

---

## 🧪 Step 5: Test Your Deployed Contracts

Let's submit a test claim to your deployed contract:

```bash
# Get your deployer address
DEPLOYER=$(soroban keys address deployer)
echo "Deployer address: $DEPLOYER"

# Get contract ID
CLAIM_CONTRACT=$(grep VITE_CLAIM_REGISTRY_CONTRACT .env | cut -d'=' -f2)

# Submit a test claim
soroban contract invoke \
  --id $CLAIM_CONTRACT \
  --source deployer \
  --network testnet \
  -- submit_claim \
  --submitter $DEPLOYER \
  --text "The Earth is round" \
  --category "Science" \
  --sources '["https://nasa.gov"]'
```

**Expected Output:**
```
1
```
This is your claim ID! Your first claim has been submitted! 🎉

**Try More:**
```bash
# Get the claim you just submitted
soroban contract invoke \
  --id $CLAIM_CONTRACT \
  --source deployer \
  --network testnet \
  -- get_claim \
  --claim_id 1
```

---

## 📊 What You've Accomplished

✅ Built 3 production-ready smart contracts
✅ Ran comprehensive unit tests (11 tests passed)
✅ Deployed to Stellar Soroban testnet
✅ Initialized and linked contracts
✅ Submitted your first test claim
✅ Verified everything works!

**Your contracts are now:**
- ✅ Live on Stellar testnet
- ✅ Ready to accept claims
- ✅ Ready for expert registration
- ✅ Ready for frontend integration

---

## 🎨 Next Steps: Build the Frontend

Now that your contracts are deployed, you can build the frontend!

### Option 1: Follow the Roadmap
Read `ROADMAP.md` for a complete development plan.

### Option 2: Use Integration Guide
Read `INTEGRATION_GUIDE.md` for code examples.

### Option 3: Quick Frontend Setup
```bash
# Create React app
npm create vite@latest truthstamp-frontend -- --template react-ts
cd truthstamp-frontend

# Install dependencies
npm install @stellar/stellar-sdk @stellar/freighter-api
npm install react-router-dom tailwindcss

# Copy contract addresses
cp ../git/.env .env

# Start building!
```

---

## 📚 Additional Resources

### Documentation
- `README.md` - Complete project overview
- `QUICKSTART.md` - This file
- `ARCHITECTURE.md` - System architecture
- `INTEGRATION_GUIDE.md` - Frontend integration
- `ROADMAP.md` - Development plan
- `PROJECT_SUMMARY.md` - Project summary
- `CHECKLIST.md` - Completion checklist

### Tools & Links
- [Stellar Laboratory](https://laboratory.stellar.org/) - Test transactions
- [Stellar Expert](https://stellar.expert/explorer/testnet) - View contracts
- [Friendbot](https://friendbot.stellar.org/) - Get test XLM
- [Soroban Docs](https://soroban.stellar.org/docs) - Official documentation
- [Freighter Wallet](https://www.freighter.app/) - Browser wallet

---

## 🐛 Troubleshooting

### Build Issues
```bash
# Problem: Rust not installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Problem: WASM target missing
rustup target add wasm32-unknown-unknown

# Problem: Build errors
cargo clean
cargo update
./build.sh
```

### Test Issues
```bash
# Problem: Tests failing
cd contracts/claim_registry
cargo test -- --nocapture

# Check for specific errors and fix them
```

### Deployment Issues
```bash
# Problem: Soroban CLI not found
cargo install --locked soroban-cli

# Problem: Insufficient funds
# Wait a moment and try Friendbot again
curl "https://friendbot.stellar.org?addr=$(soroban keys address deployer)"

# Problem: Network issues
# Check your internet connection
# Try again in a few minutes
```

### Common Errors

**Error: `soroban: command not found`**
```bash
cargo install --locked soroban-cli
# Then restart your terminal
```

**Error: `target not found`**
```bash
rustup target add wasm32-unknown-unknown
```

**Error: Contract deployment failed**
```bash
# Check your network connection
# Try deploying again
./deploy.sh
```

---

## 💡 Pro Tips

1. **Save Your Contract Addresses**: The `.env` file contains your contract addresses. Don't lose it!

2. **Use Friendbot**: Need more test XLM? Just run:
   ```bash
   curl "https://friendbot.stellar.org?addr=$(soroban keys address deployer)"
   ```

3. **Monitor Transactions**: Use Stellar Expert to watch your transactions in real-time.

4. **Test Locally First**: Always run `./test.sh` before deploying.

5. **Read the Docs**: Check the other markdown files for detailed information.

---

## 🎊 Congratulations!

You've successfully:
- ✅ Set up a complete Soroban development environment
- ✅ Built 3 interconnected smart contracts
- ✅ Deployed to Stellar testnet
- ✅ Verified everything works

**You're now ready to:**
- 🎨 Build the frontend
- 🎤 Present at Stellar Bootcamp
- 🚀 Expand your DApp
- 🌟 Deploy to mainnet (eventually)

---

## 🤝 Need Help?

- **Documentation**: Check the other `.md` files in this repo
- **Stellar Discord**: Join the community
- **Stack Exchange**: Search for solutions
- **GitHub Issues**: Report bugs

---

## 📞 Quick Commands Cheat Sheet

```bash
# Build contracts
./build.sh

# Run tests
./test.sh

# Deploy to testnet
./deploy.sh

# View contract addresses
cat .env

# Get more test XLM
curl "https://friendbot.stellar.org?addr=$(soroban keys address deployer)"

# Submit a claim
soroban contract invoke \
  --id $(grep VITE_CLAIM_REGISTRY_CONTRACT .env | cut -d'=' -f2) \
  --source deployer \
  --network testnet \
  -- submit_claim \
  --submitter $(soroban keys address deployer) \
  --text "Your claim here" \
  --category "Science" \
  --sources '["https://source.com"]'

# Clean build
cargo clean

# Check code
cargo check

# Format code
cargo fmt
```

---

**Happy Building! 🚀**

*Now go create an amazing decentralized fact-checking platform!*

---

*Last updated: November 2, 2025*
