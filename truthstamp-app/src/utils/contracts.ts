import { 
  Contract, 
  SorobanRpc, 
  TransactionBuilder,
  Networks,
  BASE_FEE,
  xdr,
  Address,
  nativeToScVal,
  scValToNative
} from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

// Contract addresses from deployed contracts
export const CLAIM_REGISTRY_CONTRACT = 'CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY';
export const EXPERT_REGISTRY_CONTRACT = 'CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC';
export const REVIEW_CONSENSUS_CONTRACT = 'CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4';

export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const RPC_URL = 'https://soroban-testnet.stellar.org:443';

// Initialize Soroban RPC Server
export const server = new SorobanRpc.Server(RPC_URL);

// Check if Freighter is installed
export function isFreighterInstalled(): boolean {
  return typeof (window as any).freighter !== 'undefined';
}

// Submit a claim to the Claim Registry contract
export async function submitClaim(
  walletAddress: string,
  claimText: string,
  category: string,
  sources: string[]
): Promise<string> {
  try {
    console.log('🚀 Submitting claim to blockchain:', {
      contract: CLAIM_REGISTRY_CONTRACT,
      walletAddress,
      claimText,
      category,
      sources
    });

    console.log('✅ Preparing real blockchain transaction...');

    // Create contract instance
    const contract = new Contract(CLAIM_REGISTRY_CONTRACT);
    
    // Get account details from network
    console.log('📡 Fetching account from Stellar network...');
    const sourceAccount = await server.getAccount(walletAddress);
    
    console.log('🔨 Building contract transaction...');
    console.log('Parameters:', { claimText, category, sources });
    
    // Properly encode each parameter using xdr
    const addressParam = new Address(walletAddress).toScVal();
    const textParam = xdr.ScVal.scvString(claimText);
    const categoryParam = xdr.ScVal.scvString(category);
    
    // Encode sources as a vector of strings
    const filteredSources = sources.filter(s => s && s.trim() !== '');
    const sourcesParam = xdr.ScVal.scvVec(
      filteredSources.map(source => xdr.ScVal.scvString(source))
    );
    
    console.log('Encoded parameters successfully');
    
    // Build the contract transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'submit_claim',
          addressParam,
          textParam,
          categoryParam,
          sourcesParam
        )
      )
      .setTimeout(180)
      .build();

    console.log('� Simulating transaction...');
    
    // Prepare and simulate the transaction
    const preparedTransaction = await server.prepareTransaction(transaction);
    
    console.log('✍️ Requesting signature from Freighter wallet...');
    
    // Sign with Freighter using the imported function
    const signedXDR = await signTransaction(preparedTransaction.toXDR(), {
      network: 'TESTNET',
      networkPassphrase: NETWORK_PASSPHRASE,
      accountToSign: walletAddress,
    });
    
    console.log('✅ Transaction signed successfully!');
    
    // Convert signed XDR back to transaction
    const signedTransaction = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
    
    console.log('📡 Sending transaction to Stellar network...');
    
    // Send transaction to the network
    const response = await server.sendTransaction(signedTransaction);
    
    console.log('✅ Transaction submitted! Response:', response);
    console.log('🎉 Claim submitted successfully! Hash:', response.hash);
    
    // Return transaction hash immediately (don't wait for confirmation to avoid XDR parsing issues)
    return response.hash;
    
  } catch (error: any) {
    console.error('❌ Error submitting claim:', error);
    
    // Provide more helpful error messages
    if (error.message?.includes('account not found') || error.message?.includes('Account not found')) {
      throw new Error('Account not funded. Please get testnet XLM from https://laboratory.stellar.org/#account-creator');
    }
    
    if (error.message?.includes('User declined')) {
      throw new Error('Transaction rejected by user');
    }
    
    throw error;
  }
}

// Register as an expert
export async function registerExpert(
  walletAddress: string,
  name: string,
  bio: string,
  expertiseCategories: string[],
  stakeAmount: bigint
): Promise<string> {
  try {
    console.log('🚀 Registering expert on blockchain:', {
      contract: EXPERT_REGISTRY_CONTRACT,
      walletAddress,
      name,
      bio,
      expertiseCategories,
      stakeAmount
    });

    const contract = new Contract(EXPERT_REGISTRY_CONTRACT);
    
    // Get account details from network
    const sourceAccount = await server.getAccount(walletAddress);
    
    // Convert parameters to ScVal format
    const expertAddress = new Address(walletAddress);
    const nameScVal = nativeToScVal(name, { type: 'string' });
    const bioScVal = nativeToScVal(bio, { type: 'string' });
    // Convert categories array properly for Soroban
    const categoriesScVal = nativeToScVal(expertiseCategories.map(c => c || ''));
    const stakeScVal = nativeToScVal(stakeAmount, { type: 'i128' });
    
    // Build the transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'register_expert',
          expertAddress.toScVal(),
          nameScVal,
          bioScVal,
          categoriesScVal,
          stakeScVal
        )
      )
      .setTimeout(180)
      .build();
    
    // Prepare and simulate
    const preparedTransaction = await server.prepareTransaction(transaction);
    
    // Sign with Freighter
    const signedXDR = await signTransaction(preparedTransaction.toXDR(), {
      network: 'TESTNET',
      networkPassphrase: NETWORK_PASSPHRASE,
      accountToSign: walletAddress,
    });
    
    const signedTransaction = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
    
    // Send transaction
    const response = await server.sendTransaction(signedTransaction);
    
    console.log('✅ Expert registered! Hash:', response.hash);
    
    return response.hash;
  } catch (error) {
    console.error('Error registering expert:', error);
    throw error;
  }
}

// Submit a review
export async function submitReview(
  walletAddress: string,
  claimId: bigint,
  verdict: 'True' | 'False',
  reasoning: string,
  confidence: number,
  stakeAmount: bigint
): Promise<string> {
  try {
    console.log('🚀 Submitting review to blockchain:', {
      contract: REVIEW_CONSENSUS_CONTRACT,
      walletAddress,
      claimId,
      verdict,
      confidence,
      stakeAmount
    });

    const contract = new Contract(REVIEW_CONSENSUS_CONTRACT);
    
    // Get account details from network
    const sourceAccount = await server.getAccount(walletAddress);
    
    // Convert parameters to ScVal format
    const expertAddress = new Address(walletAddress);
    const claimIdScVal = nativeToScVal(claimId, { type: 'u64' });
    const verdictScVal = xdr.ScVal.scvSymbol(verdict);
    const reasoningScVal = nativeToScVal(reasoning, { type: 'string' });
    const confidenceScVal = nativeToScVal(confidence, { type: 'u32' });
    const stakeScVal = nativeToScVal(stakeAmount, { type: 'i128' });
    
    // Build the transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'submit_review',
          expertAddress.toScVal(),
          claimIdScVal,
          verdictScVal,
          reasoningScVal,
          confidenceScVal,
          stakeScVal
        )
      )
      .setTimeout(180)
      .build();
    
    // Prepare and simulate
    const preparedTransaction = await server.prepareTransaction(transaction);
    
    // Sign with Freighter
    const signedXDR = await signTransaction(preparedTransaction.toXDR(), {
      network: 'TESTNET',
      networkPassphrase: NETWORK_PASSPHRASE,
      accountToSign: walletAddress,
    });
    
    const signedTransaction = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
    
    // Send transaction
    const response = await server.sendTransaction(signedTransaction);
    
    console.log('✅ Review submitted! Hash:', response.hash);
    
    return response.hash;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
}

// Get claim details
export async function getClaim(claimId: number): Promise<any> {
  try {
    // TODO: Query contract state
    console.log('Fetching claim:', claimId);
    
    return null; // Will return actual claim data
  } catch (error) {
    console.error('Error fetching claim:', error);
    throw error;
  }
}
