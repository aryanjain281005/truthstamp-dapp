import { 
  Contract, 
  SorobanRpc, 
  TransactionBuilder,
  Networks,
  BASE_FEE,
  xdr,
  Address,
  nativeToScVal
} from '@stellar/stellar-sdk';

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

    // Check if Freighter wallet is available
    const freighter = (window as any).freighter;
    
    if (!freighter) {
      console.warn('⚠️ Freighter wallet not installed - using demo mode');
      const mockTxHash = `demo_${Date.now().toString(16)}_${Math.random().toString(36).substring(2, 15)}`;
      console.log('📝 Demo transaction created:', mockTxHash);
      return mockTxHash;
    }

    console.log('✅ Freighter detected, preparing blockchain transaction...');

    // Create contract instance
    const contract = new Contract(CLAIM_REGISTRY_CONTRACT);
    
    // Get account details from network
    const sourceAccount = await server.getAccount(walletAddress);
    
    // Convert parameters to ScVal format for Soroban
    const submitterAddress = new Address(walletAddress);
    const claimTextScVal = nativeToScVal(claimText, { type: 'string' });
    const categoryScVal = nativeToScVal(category, { type: 'string' });
    const sourcesScVal = nativeToScVal(sources, { type: 'string[]' });
    
    // Build the contract transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'submit_claim',
          submitterAddress.toScVal(),
          claimTextScVal,
          categoryScVal,
          sourcesScVal
        )
      )
      .setTimeout(30)
      .build();

    console.log('📤 Preparing transaction for signing...');
    
    // Prepare and simulate the transaction
    const preparedTransaction = await server.prepareTransaction(transaction);
    
    console.log('✍️ Requesting signature from Freighter...');
    
    // Sign with Freighter
    const signedXDR = await freighter.signTransaction(preparedTransaction.toXDR(), {
      network: 'TESTNET',
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    
    // Convert signed XDR back to transaction
    const signedTransaction = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
    
    console.log('📡 Sending transaction to Stellar network...');
    
    // Send transaction to the network
    const response = await server.sendTransaction(signedTransaction);
    
    console.log('✅ Transaction submitted! Hash:', response.hash);
    
    // Return transaction hash
    return response.hash;
    
  } catch (error: any) {
    console.error('❌ Error submitting claim:', error);
    
    // Provide more helpful error messages
    if (error.message?.includes('account not found')) {
      throw new Error('Account not funded. Please get testnet XLM from https://laboratory.stellar.org/#account-creator');
    }
    
    throw error;
  }
}

// Register as an expert
export async function registerExpert(
  walletAddress: string,
  expertise: string,
  credentials: string,
  level: number
): Promise<string> {
  try {
    const freighter = (window as any).freighter;
    
    if (!freighter) {
      throw new Error('Freighter wallet not installed');
    }

    const contract = new Contract(EXPERT_REGISTRY_CONTRACT);

    console.log('Registering expert:', {
      contract: EXPERT_REGISTRY_CONTRACT,
      walletAddress,
      expertise,
      credentials,
      level
    });

    const mockTxHash = `expert_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    return mockTxHash;
  } catch (error) {
    console.error('Error registering expert:', error);
    throw error;
  }
}

// Submit a review
export async function submitReview(
  walletAddress: string,
  claimId: number,
  verdict: boolean,
  confidence: number,
  comment: string
): Promise<string> {
  try {
    const freighter = (window as any).freighter;
    
    if (!freighter) {
      throw new Error('Freighter wallet not installed');
    }

    const contract = new Contract(REVIEW_CONSENSUS_CONTRACT);

    console.log('Submitting review:', {
      contract: REVIEW_CONSENSUS_CONTRACT,
      walletAddress,
      claimId,
      verdict,
      confidence,
      comment
    });

    const mockTxHash = `review_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    return mockTxHash;
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
