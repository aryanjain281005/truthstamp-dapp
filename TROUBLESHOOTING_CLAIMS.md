# Claims Not Showing - Troubleshooting Guide

## ✅ **FIXES APPLIED**

### 1. **Auto-Refresh Feature** 🔄
Both Browse Claims and My Claims pages now automatically refresh every 30 seconds to fetch new claims from the blockchain.

### 2. **Manual Refresh Button** 🔄
Added a "Refresh" button on both pages so you can manually refresh immediately after submitting a claim.

### 3. **Last Updated Timestamp**
Shows when the claims were last fetched from the blockchain.

---

## 🧪 **HOW TO TEST**

### Step 1: Submit a Claim
1. Go to **Submit Claim** page
2. Fill out the form
3. Click **"Submit Claim (10 XLM)"**
4. **Approve the transaction in Freighter wallet**
5. Wait for success message
6. **Copy the transaction hash** from the success message

### Step 2: Check Browse Claims
1. Navigate to **"Browse Claims"** in the nav bar
2. Click the **"🔄 Refresh"** button
3. Your new claim should appear!
4. If not, wait 30 seconds for auto-refresh

### Step 3: Check My Claims
1. Navigate to **"My Claims"** in the nav bar
2. Click the **"🔄 Refresh"** button
3. Your new claim should appear!
4. If not, wait 30 seconds for auto-refresh

---

## 🔍 **IF CLAIMS STILL DON'T SHOW**

### Check Browser Console (IMPORTANT!)
Press `F12` or `Right Click → Inspect → Console` to see debug logs:

#### **Good Console Output:**
```
Fetching claims count...
Total claims: 5
Fetching claim with ID: 1
Fetching claim with ID: 2
...
Fetched 5 claims
```

#### **Bad Console Output - Errors:**

**Error 1: "Account not found"**
```
Error fetching claims: Account not found
```
**Solution:** Your wallet needs testnet XLM. Run the fund script:
```bash
./fund-account.sh
```

**Error 2: "Claim count is 0"**
```
Total claims: 0
```
**Solution:** Claims might not have been submitted to the blockchain. Check:
1. Did you approve the transaction in Freighter?
2. Did you get a transaction hash?
3. Check the transaction on Stellar Explorer

**Error 3: "Failed to parse claim data"**
```
Error parsing claim: Cannot read property 'id' of undefined
```
**Solution:** Smart contract might not have the claim. Check if submission succeeded.

---

## 🔬 **DETAILED DEBUGGING**

### 1. Verify Transaction on Blockchain

After submitting a claim, you get a transaction hash like:
```
abc123def456...
```

**Check it on Stellar Explorer:**
1. Go to: https://stellar.expert/explorer/testnet
2. Search for your transaction hash
3. Check if transaction was **successful**
4. Look for contract invocation details

### 2. Check Smart Contract State

Open browser console and run:
```javascript
// Check total claim count
const count = await getClaimCount(walletAddress);
console.log('Total claims:', count);

// Check specific claim
const claim = await getClaim(walletAddress, 1);
console.log('Claim 1:', claim);
```

### 3. Check Wallet Address Match

Your submitted claim uses your wallet address as the submitter. Make sure:

**In Submit Claim:**
```
Submitter: GC2Q7QI7OLFEFEC5BXWC5NQSIV2D6EKBYZVYISBVJAPDZSEPG4DBJM5I
```

**In My Claims filter:**
```javascript
claim.submitter.toLowerCase() === walletAddress.toLowerCase()
```

They must match exactly!

### 4. Check Network Connection

Make sure you're connected to Stellar Testnet:
```
Network: TESTNET
RPC: https://soroban-testnet.stellar.org:443
Passphrase: Test SDF Network ; September 2015
```

---

## 🐛 **COMMON ISSUES & SOLUTIONS**

### Issue 1: "Claim submitted but not appearing"

**Possible Causes:**
1. Transaction failed (check Stellar Explorer)
2. Claim ID returned is wrong
3. Contract storage not updated
4. Network delay (wait 30-60 seconds)

**Solutions:**
- Check browser console for errors
- Verify transaction on Stellar Explorer
- Wait for auto-refresh (30 seconds)
- Click manual refresh button

---

### Issue 2: "Browse Claims shows 0 claims"

**Possible Causes:**
1. No claims submitted to blockchain yet
2. getClaimCount() returning 0
3. Contract not initialized
4. Wrong contract address

**Solutions:**
- Check contract address in contracts.ts:
  ```typescript
  CLAIM_REGISTRY_CONTRACT = 'CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY'
  ```
- Test with another wallet that has claims
- Check if contract is deployed correctly

---

### Issue 3: "My Claims shows 0 but Browse Claims shows claims"

**Possible Causes:**
1. Wallet address mismatch
2. Claims submitted from different wallet
3. Case sensitivity in address comparison

**Solutions:**
- Check wallet address in console:
  ```javascript
  console.log('My wallet:', walletAddress);
  console.log('Claim submitter:', claim.submitter);
  ```
- Make sure addresses match exactly
- Check if you're using the same wallet

---

### Issue 4: "Loading forever / stuck"

**Possible Causes:**
1. Network timeout
2. RPC server not responding
3. Too many parallel requests
4. Contract simulation failing

**Solutions:**
- Check network in browser DevTools (Network tab)
- Reload page
- Check if Soroban RPC is working:
  ```bash
  curl https://soroban-testnet.stellar.org:443
  ```
- Reduce claim fetch limit (currently 50)

---

## 📊 **TESTING CHECKLIST**

Before reporting an issue, check:

- [ ] Wallet is connected (shows address in nav bar)
- [ ] Wallet has testnet XLM (at least 100 XLM)
- [ ] Transaction was approved in Freighter
- [ ] Transaction hash was received
- [ ] Transaction shows as successful on Stellar Explorer
- [ ] Waited at least 30 seconds after submission
- [ ] Clicked manual refresh button
- [ ] Checked browser console for errors
- [ ] Tried hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 🔧 **MANUAL DEBUGGING COMMANDS**

Open browser console (F12) and run these:

### Check if claims exist:
```javascript
// Get claim count
const { getClaimCount } = await import('./utils/contracts');
const count = await getClaimCount('YOUR_WALLET_ADDRESS');
console.log('Total claims:', count);
```

### Fetch a specific claim:
```javascript
// Get claim by ID
const { getClaim } = await import('./utils/contracts');
const claim = await getClaim('YOUR_WALLET_ADDRESS', 1);
console.log('Claim 1:', claim);
```

### Check wallet address:
```javascript
// Current wallet
console.log('Wallet:', walletAddress);
```

### Force refresh:
```javascript
// Manually trigger refresh
window.location.reload();
```

---

## 🚨 **EMERGENCY FIXES**

If nothing works, try these:

### 1. Hard Refresh
- Press `Ctrl+Shift+R` (Windows/Linux)
- Press `Cmd+Shift+R` (Mac)
- This clears cache and reloads

### 2. Clear Browser Cache
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Reload page

### 3. Reconnect Wallet
1. Disconnect wallet (if there's a disconnect option)
2. Reload page
3. Click "Connect Wallet" again

### 4. Check Contract Deployment
Verify contracts are deployed:
```bash
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/contracts
stellar contract invoke \
  --id CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY \
  --source-account YOUR_ACCOUNT \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- get_claim_count
```

---

## 📝 **EXPECTED BEHAVIOR**

### After Submitting a Claim:

**Immediately:**
- Transaction approved in Freighter
- Success message with transaction hash
- Form resets

**Within 5-10 seconds:**
- Transaction confirmed on blockchain
- Can be viewed on Stellar Explorer

**Within 30 seconds:**
- Auto-refresh fetches new claim
- Claim appears in Browse Claims
- Claim appears in My Claims (if you're the submitter)

**Manual Refresh:**
- Click "🔄 Refresh" button
- Should fetch immediately (2-5 seconds)

---

## ✅ **IMPROVEMENTS MADE**

1. ✅ **Auto-refresh every 30 seconds** - No need to manually reload
2. ✅ **Manual refresh button** - Instant refresh when needed
3. ✅ **Last updated timestamp** - See when data was fetched
4. ✅ **Better error messages** - Console logs for debugging
5. ✅ **Loading states** - Visual feedback during refresh

---

## 📞 **STILL NOT WORKING?**

If claims still don't show after trying all of the above:

1. **Check the exact error message** in browser console
2. **Copy the transaction hash** from submission success message
3. **Verify on Stellar Explorer** that transaction succeeded
4. **Take a screenshot** of browser console errors
5. **Report the issue** with these details

---

**App Status:** 🟢 Running at http://localhost:3000

**Auto-refresh:** Every 30 seconds  
**Manual refresh:** Click "🔄 Refresh" button  
**Last updated:** Shows timestamp below header  

Test it now! 🚀
