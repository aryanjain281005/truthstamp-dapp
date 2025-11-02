# TruthStamp Smart Contract Integration Guide

This guide explains how to integrate the TruthStamp smart contracts with your React/TypeScript frontend.

## Table of Contents

1. [Setup](#setup)
2. [Contract Addresses](#contract-addresses)
3. [Wallet Integration](#wallet-integration)
4. [Contract Interactions](#contract-interactions)
5. [Data Structures](#data-structures)
6. [Example Code](#example-code)

## Setup

### Install Dependencies

```bash
npm install @stellar/stellar-sdk @stellar/freighter-api soroban-client
# or
yarn add @stellar/stellar-sdk @stellar/freighter-api soroban-client
```

### Environment Configuration

Create a `.env` file in your frontend project:

```env
VITE_CLAIM_REGISTRY_CONTRACT=<your_claim_registry_contract_id>
VITE_EXPERT_REGISTRY_CONTRACT=<your_expert_registry_contract_id>
VITE_REVIEW_CONSENSUS_CONTRACT=<your_review_consensus_contract_id>
VITE_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

## Contract Addresses

After running `./deploy.sh`, contract addresses are saved to `.env`. Copy these to your frontend project.

## Wallet Integration

### Connect Freighter Wallet

```typescript
import { isConnected, getPublicKey, signTransaction } from "@stellar/freighter-api";

async function connectWallet(): Promise<string> {
  const isConnected = await isConnected();
  
  if (!isConnected) {
    alert("Please install Freighter wallet");
    window.open("https://www.freighter.app/", "_blank");
    throw new Error("Freighter not installed");
  }
  
  const publicKey = await getPublicKey();
  return publicKey;
}
```

### Get Test XLM from Friendbot

```typescript
async function fundAccount(publicKey: string): Promise<void> {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    const result = await response.json();
    console.log("Account funded:", result);
  } catch (error) {
    console.error("Failed to fund account:", error);
    throw error;
  }
}
```

## Contract Interactions

### Initialize Soroban Client

```typescript
import { Server, Contract, TransactionBuilder, Networks } from "soroban-client";
import { Account } from "@stellar/stellar-sdk";

const server = new Server(import.meta.env.VITE_SOROBAN_RPC_URL);
const networkPassphrase = import.meta.env.VITE_NETWORK_PASSPHRASE;

async function getAccount(publicKey: string): Promise<Account> {
  const accountResponse = await server.getAccount(publicKey);
  return new Account(accountResponse.accountId(), accountResponse.sequence);
}
```

### 1. Submit a Claim

```typescript
interface SubmitClaimParams {
  submitter: string;
  text: string;
  category: string;
  sources: string[];
}

async function submitClaim(params: SubmitClaimParams): Promise<number> {
  const { submitter, text, category, sources } = params;
  
  const contractAddress = import.meta.env.VITE_CLAIM_REGISTRY_CONTRACT;
  const contract = new Contract(contractAddress);
  
  // Build transaction
  const account = await getAccount(submitter);
  
  const transaction = new TransactionBuilder(account, {
    fee: "10000000", // 1 XLM base fee
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "submit_claim",
        xdr.ScVal.scvAddress(new Address(submitter).toScAddress()),
        xdr.ScVal.scvString(text),
        xdr.ScVal.scvString(category),
        xdr.ScVal.scvVec(sources.map(s => xdr.ScVal.scvString(s)))
      )
    )
    .setTimeout(30)
    .build();
  
  // Simulate first
  const simulated = await server.simulateTransaction(transaction);
  
  // Prepare and sign
  const prepared = assembleTransaction(transaction, simulated).build();
  const signedXdr = await signTransaction(prepared.toXDR(), {
    network: "testnet",
    accountToSign: submitter,
  });
  
  // Submit
  const signed = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  const result = await server.sendTransaction(signed);
  
  // Parse claim ID from result
  const claimId = parseClaimIdFromResult(result);
  return claimId;
}
```

### 2. Get Claim Details

```typescript
interface Claim {
  id: number;
  submitter: string;
  text: string;
  category: string;
  sources: string[];
  status: "Pending" | "UnderReview" | "True" | "False";
  stake_pool: string;
  timestamp: number;
  review_count: number;
}

async function getClaim(claimId: number): Promise<Claim | null> {
  const contractAddress = import.meta.env.VITE_CLAIM_REGISTRY_CONTRACT;
  const contract = new Contract(contractAddress);
  
  // Build read-only transaction
  const account = await getAccount("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF");
  
  const transaction = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "get_claim",
        xdr.ScVal.scvU64(new xdr.Uint64(claimId))
      )
    )
    .setTimeout(30)
    .build();
  
  const simulated = await server.simulateTransaction(transaction);
  
  if (simulated.results && simulated.results.length > 0) {
    const result = simulated.results[0];
    return parseClaimFromScVal(result.retval);
  }
  
  return null;
}
```

### 3. Register as Expert

```typescript
interface RegisterExpertParams {
  expert: string;
  name: string;
  bio: string;
  expertiseCategories: string[];
  stakeAmount: string; // in stroops (1 XLM = 10_000_000 stroops)
}

async function registerExpert(params: RegisterExpertParams): Promise<boolean> {
  const { expert, name, bio, expertiseCategories, stakeAmount } = params;
  
  const contractAddress = import.meta.env.VITE_EXPERT_REGISTRY_CONTRACT;
  const contract = new Contract(contractAddress);
  
  const account = await getAccount(expert);
  
  const transaction = new TransactionBuilder(account, {
    fee: "10000000",
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "register_expert",
        xdr.ScVal.scvAddress(new Address(expert).toScAddress()),
        xdr.ScVal.scvString(name),
        xdr.ScVal.scvString(bio),
        xdr.ScVal.scvVec(expertiseCategories.map(c => xdr.ScVal.scvString(c))),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ lo: BigInt(stakeAmount), hi: 0n }))
      )
    )
    .setTimeout(30)
    .build();
  
  const simulated = await server.simulateTransaction(transaction);
  const prepared = assembleTransaction(transaction, simulated).build();
  
  const signedXdr = await signTransaction(prepared.toXDR(), {
    network: "testnet",
    accountToSign: expert,
  });
  
  const signed = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  await server.sendTransaction(signed);
  
  return true;
}
```

### 4. Get Expert Profile

```typescript
interface Expert {
  address: string;
  name: string;
  bio: string;
  expertise_categories: string[];
  staked_amount: string;
  expert_level: "General" | "Specialized" | "Professional";
  reputation_points: number;
  reputation_level: "Seedling" | "Sprout" | "Established" | "Expert" | "Master";
  total_reviews: number;
  correct_reviews: number;
  total_earnings: string;
  registered_at: number;
}

async function getExpert(expertAddress: string): Promise<Expert | null> {
  const contractAddress = import.meta.env.VITE_EXPERT_REGISTRY_CONTRACT;
  const contract = new Contract(contractAddress);
  
  const nullAccount = await getAccount("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF");
  
  const transaction = new TransactionBuilder(nullAccount, {
    fee: "100",
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "get_expert",
        xdr.ScVal.scvAddress(new Address(expertAddress).toScAddress())
      )
    )
    .setTimeout(30)
    .build();
  
  const simulated = await server.simulateTransaction(transaction);
  
  if (simulated.results && simulated.results.length > 0) {
    return parseExpertFromScVal(simulated.results[0].retval);
  }
  
  return null;
}
```

### 5. Submit Review

```typescript
interface SubmitReviewParams {
  expert: string;
  claimId: number;
  verdict: "True" | "False";
  reasoning: string;
  confidence: number; // 0-100
  stakeAmount: string; // in stroops
}

async function submitReview(params: SubmitReviewParams): Promise<number> {
  const { expert, claimId, verdict, reasoning, confidence, stakeAmount } = params;
  
  const contractAddress = import.meta.env.VITE_REVIEW_CONSENSUS_CONTRACT;
  const contract = new Contract(contractAddress);
  
  const account = await getAccount(expert);
  
  const verdictScVal = verdict === "True" 
    ? xdr.ScVal.scvSymbol("True")
    : xdr.ScVal.scvSymbol("False");
  
  const transaction = new TransactionBuilder(account, {
    fee: "10000000",
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "submit_review",
        xdr.ScVal.scvAddress(new Address(expert).toScAddress()),
        xdr.ScVal.scvU64(new xdr.Uint64(claimId)),
        verdictScVal,
        xdr.ScVal.scvString(reasoning),
        xdr.ScVal.scvU32(confidence),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ lo: BigInt(stakeAmount), hi: 0n }))
      )
    )
    .setTimeout(30)
    .build();
  
  const simulated = await server.simulateTransaction(transaction);
  const prepared = assembleTransaction(transaction, simulated).build();
  
  const signedXdr = await signTransaction(prepared.toXDR(), {
    network: "testnet",
    accountToSign: expert,
  });
  
  const signed = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  const result = await server.sendTransaction(signed);
  
  const reviewId = parseReviewIdFromResult(result);
  return reviewId;
}
```

### 6. Get Claim Reviews

```typescript
interface Review {
  id: number;
  claim_id: number;
  expert: string;
  verdict: "True" | "False";
  reasoning: string;
  confidence: number;
  stake_amount: string;
  timestamp: number;
  rewarded: boolean;
}

async function getClaimReviews(claimId: number): Promise<Review[]> {
  const contractAddress = import.meta.env.VITE_REVIEW_CONSENSUS_CONTRACT;
  const contract = new Contract(contractAddress);
  
  const nullAccount = await getAccount("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF");
  
  const transaction = new TransactionBuilder(nullAccount, {
    fee: "100",
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "get_claim_reviews",
        xdr.ScVal.scvU64(new xdr.Uint64(claimId))
      )
    )
    .setTimeout(30)
    .build();
  
  const simulated = await server.simulateTransaction(transaction);
  
  if (simulated.results && simulated.results.length > 0) {
    return parseReviewsFromScVal(simulated.results[0].retval);
  }
  
  return [];
}
```

### 7. Get Consensus Result

```typescript
interface ConsensusResult {
  claim_id: number;
  final_verdict: "True" | "False";
  total_stake_true: string;
  total_stake_false: string;
  confidence_percentage: number;
  is_finalized: boolean;
}

async function getConsensus(claimId: number): Promise<ConsensusResult | null> {
  const contractAddress = import.meta.env.VITE_REVIEW_CONSENSUS_CONTRACT;
  const contract = new Contract(contractAddress);
  
  const nullAccount = await getAccount("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF");
  
  const transaction = new TransactionBuilder(nullAccount, {
    fee: "100",
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "get_consensus",
        xdr.ScVal.scvU64(new xdr.Uint64(claimId))
      )
    )
    .setTimeout(30)
    .build();
  
  const simulated = await server.simulateTransaction(transaction);
  
  if (simulated.results && simulated.results.length > 0) {
    return parseConsensusFromScVal(simulated.results[0].retval);
  }
  
  return null;
}
```

## Data Structures

### ClaimStatus Enum

```typescript
enum ClaimStatus {
  Pending = "Pending",
  UnderReview = "UnderReview",
  True = "True",
  False = "False"
}
```

### ExpertLevel Enum

```typescript
enum ExpertLevel {
  General = "General",          // 100 XLM
  Specialized = "Specialized",  // 500 XLM
  Professional = "Professional" // 1000 XLM
}
```

### ReputationLevel Enum

```typescript
enum ReputationLevel {
  Seedling = "Seedling",       // 0-99 points
  Sprout = "Sprout",           // 100-499 points
  Established = "Established", // 500-999 points
  Expert = "Expert",           // 1000-4999 points
  Master = "Master"            // 5000+ points
}
```

## Helper Functions

### Convert XLM to Stroops

```typescript
function xlmToStroops(xlm: number): string {
  return (xlm * 10_000_000).toString();
}

function stroopsToXlm(stroops: string): number {
  return parseInt(stroops) / 10_000_000;
}
```

### Format Timestamps

```typescript
function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}
```

### Calculate Accuracy

```typescript
function calculateAccuracy(correctReviews: number, totalReviews: number): number {
  if (totalReviews === 0) return 0;
  return Math.round((correctReviews / totalReviews) * 100);
}
```

## Error Handling

```typescript
async function handleContractCall<T>(
  callFunction: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await callFunction();
  } catch (error) {
    console.error(errorMessage, error);
    if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`);
    }
    throw error;
  }
}

// Usage
const claim = await handleContractCall(
  () => getClaim(1),
  "Failed to fetch claim"
);
```

## React Hooks Examples

### useWallet Hook

```typescript
import { useState, useEffect } from "react";

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const connect = async () => {
    try {
      const key = await connectWallet();
      setPublicKey(key);
      setIsConnected(true);
      localStorage.setItem("walletPublicKey", key);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };
  
  const disconnect = () => {
    setPublicKey(null);
    setIsConnected(false);
    localStorage.removeItem("walletPublicKey");
  };
  
  useEffect(() => {
    const savedKey = localStorage.getItem("walletPublicKey");
    if (savedKey) {
      setPublicKey(savedKey);
      setIsConnected(true);
    }
  }, []);
  
  return { publicKey, isConnected, connect, disconnect };
}
```

### useContract Hook

```typescript
export function useContract(contractType: "claim" | "expert" | "review") {
  const getContractAddress = () => {
    switch (contractType) {
      case "claim":
        return import.meta.env.VITE_CLAIM_REGISTRY_CONTRACT;
      case "expert":
        return import.meta.env.VITE_EXPERT_REGISTRY_CONTRACT;
      case "review":
        return import.meta.env.VITE_REVIEW_CONSENSUS_CONTRACT;
    }
  };
  
  return {
    address: getContractAddress(),
    contract: new Contract(getContractAddress())
  };
}
```

## Testing

Use Stellar Laboratory to test contract calls:
- **Testnet Laboratory**: https://laboratory.stellar.org/#explorer?network=test

## Best Practices

1. **Always simulate transactions before submitting**
2. **Handle errors gracefully with user-friendly messages**
3. **Cache frequently accessed data (claims, expert profiles)**
4. **Use loading states for async operations**
5. **Validate user input before sending to contract**
6. **Monitor transaction status and show confirmations**
7. **Use retry logic for network failures**
8. **Keep private keys secure (never expose in frontend)**

## Next Steps

1. Implement the above functions in your React app
2. Create UI components for each contract interaction
3. Add state management (Context API, Redux, or Zustand)
4. Implement real-time updates using polling or websockets
5. Add comprehensive error handling and loading states

---

**Note**: This guide provides TypeScript pseudocode. You'll need to adapt it based on the actual Soroban SDK version and API you're using. Always refer to the official [Soroban documentation](https://soroban.stellar.org/docs) for the latest updates.
