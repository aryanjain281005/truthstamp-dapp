.PHONY: build test deploy clean install help

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "TruthStamp Smart Contracts - Makefile Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies and setup
	@echo "📦 Installing Rust and Soroban CLI..."
	@command -v rustc >/dev/null 2>&1 || curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
	@rustup target add wasm32-unknown-unknown
	@cargo install --locked soroban-cli --version 21.7.1 || echo "Soroban CLI already installed"
	@echo "✅ Setup complete!"

build: ## Build all smart contracts
	@chmod +x build.sh
	@./build.sh

test: ## Run all tests
	@chmod +x test.sh
	@./test.sh

deploy: ## Deploy contracts to Soroban testnet
	@chmod +x deploy.sh
	@./deploy.sh

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	@cargo clean
	@rm -f .env
	@echo "✅ Clean complete!"

optimize: ## Build optimized contracts
	@echo "🔧 Building optimized contracts..."
	@cd contracts/claim_registry && cargo build --target wasm32-unknown-unknown --release
	@cd contracts/expert_registry && cargo build --target wasm32-unknown-unknown --release
	@cd contracts/review_consensus && cargo build --target wasm32-unknown-unknown --release
	@soroban contract optimize --wasm target/wasm32-unknown-unknown/release/claim_registry.wasm
	@soroban contract optimize --wasm target/wasm32-unknown-unknown/release/expert_registry.wasm
	@soroban contract optimize --wasm target/wasm32-unknown-unknown/release/review_consensus.wasm
	@echo "✅ Optimization complete!"

check: ## Check code without building
	@echo "🔍 Checking code..."
	@cargo check --all-targets
	@echo "✅ Check complete!"

format: ## Format code with rustfmt
	@echo "✨ Formatting code..."
	@cargo fmt --all
	@echo "✅ Format complete!"

lint: ## Lint code with clippy
	@echo "🔎 Linting code..."
	@cargo clippy --all-targets -- -D warnings
	@echo "✅ Lint complete!"

watch: ## Watch for changes and rebuild
	@echo "👀 Watching for changes..."
	@cargo watch -x build

all: clean build test ## Clean, build, and test everything
	@echo "🎉 All tasks complete!"
