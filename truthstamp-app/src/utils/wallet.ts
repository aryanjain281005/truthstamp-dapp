import { isConnected, getPublicKey as getFreighterPublicKey, signTransaction } from '@stellar/freighter-api';

export async function connectWallet(): Promise<string> {
  const connected = await isConnected();
  
  if (!connected) {
    alert('Please install Freighter wallet extension');
    window.open('https://www.freighter.app/', '_blank');
    throw new Error('Freighter not installed');
  }
  
  const publicKey = await getFreighterPublicKey();
  localStorage.setItem('walletPublicKey', publicKey);
  return publicKey;
}

export async function getPublicKey(): Promise<string | null> {
  try {
    const connected = await isConnected();
    if (!connected) return null;
    
    const publicKey = await getFreighterPublicKey();
    return publicKey;
  } catch (err) {
    return null;
  }
}

export async function disconnectWallet(): Promise<void> {
  localStorage.removeItem('walletPublicKey');
}

export { signTransaction };
