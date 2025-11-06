# 🧪 TruthStamp Testing Guide

## Prerequisites
- ✅ Freighter wallet installed and configured
- ✅ Wallet on Stellar TESTNET network
- ✅ Account funded with testnet XLM
- ✅ Development server running (`npm start`)

---

## 🎯 Complete Testing Workflow

### 1. Initial Setup (5 minutes)

```bash
# Navigate to app directory
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/truthstamp-app

# Start development server
npm start
```

**Expected:** App opens at http://localhost:3000

---

### 2. Test Expert Registration (10 minutes)

**Steps:**
1. Open http://localhost:3000
2. Click "Connect Wallet" in top right
3. Approve Freighter connection
4. Navigate to "Expert Dashboard"
5. Fill registration form:
   - **Name:** Your Name
   - **Bio:** Brief description of expertise
   - **Categories:** Select 2-3 (e.g., Science, Technology, Health)
   - **Tier:** Choose one (General=100 XLM, Specialized=500, Professional=1000)
6. Click "Register as Expert"
7. Freighter pops up - Review transaction
8. Click "Approve"
9. Wait 5-10 seconds

**Expected Results:**
- ✅ Success message with transaction hash
- ✅ XLM deducted from wallet (check Freighter)
- ✅ Expert profile displayed with stats
- ✅ Reputation level: Seedling (0 points)
- ✅ Stats show: 0 reviews, 0% accuracy, 0 XLM earned

**Transaction Verification:**
1. Copy transaction hash
2. Visit https://stellar.expert/explorer/testnet
3. Search for hash
4. Verify:
   - Status: SUCCESS
   - Function: register_expert
   - Wallet address matches yours

---

### 3. Test Claim Submission (5 minutes)

**Steps:**
1. Navigate to "Submit a Claim"
2. Fill form:
   - **Claim:** "Quantum computing will revolutionize cryptography"
   - **Category:** Technology
   - **Sources:** https://quantum.example.com (optional)
3. Click "Submit Claim"
4. Freighter pops up showing 0.5 XLM fee
5. Approve transaction
6. Wait for confirmation

**Expected Results:**
- ✅ Success alert with transaction hash
- ✅ 0.5 XLM deducted
- ✅ Claim submitted to blockchain
- ✅ Can navigate to Browse Claims to see it

---

### 4. Test Browse Claims (5 minutes)

**Steps:**
1. Navigate to "Browse Claims"
2. Wait for claims to load

**Expected Results:**
- ✅ Loading message appears
- ✅ Claims display in grid (if any exist)
- ✅ Each claim shows:
  - Category badge
  - Status indicator
  - Claim text (truncated)
  - Stake pool amount
  - Review count
  - Date

**Test Search:**
1. Type "quantum" in search bar
2. Expected: Only matching claims show

**Test Filters:**
1. Click "Pending" filter
2. Expected: Only pending claims show
3. Click "All Claims"
4. Expected: All claims show again

**Test Navigation:**
1. Click any claim card
2. Expected: Navigate to Claim Detail page

---

### 5. Test Claim Detail Page (5 minutes)

**Steps:**
1. From Browse Claims, click a claim
2. Observe all sections

**Expected Results:**
- ✅ Claim header with category and status
- ✅ Full claim text displayed
- ✅ Info grid shows:
  - Submitter (address truncated)
  - Submission date
  - Stake pool amount
  - Review count
- ✅ If reviews exist: Consensus section with:
  - Verdict badge (True/False)
  - Confidence percentage
  - Stake distribution bars
- ✅ Sources section (if any)
- ✅ Reviews section (shows count)
- ✅ "Review This Claim" button (if < 10 reviews)
- ✅ Back button

**Test Navigation:**
1. Click "Back" button
2. Expected: Return to Browse Claims
3. Click claim again
4. Click "Review This Claim"
5. Expected: Navigate to Expert Dashboard

---

### 6. Test Review Submission (10 minutes)

**Prerequisites:** Must be registered as expert (Step 2)

**Steps:**
1. Go to Expert Dashboard
2. Mock pending claims should show
3. Click a claim to select it
4. Review form appears
5. Fill form:
   - **Verdict:** Choose "True" or "False"
   - **Confidence:** Move slider (e.g., 80%)
   - **Reasoning:** "This claim is supported by extensive research in quantum mechanics..."
   - **Stake Amount:** Enter amount (e.g., 10 XLM)
6. Click "Submit Review"
7. Freighter pops up
8. Approve transaction

**Expected Results:**
- ✅ Success message with transaction hash
- ✅ XLM stake deducted
- ✅ Review submitted to blockchain
- ✅ Expert stats update:
  - Total reviews increment
  - Reputation points change
- ✅ Form resets

**Note:** Currently reviewing mock claims. For real claims:
1. Submit a claim first (Step 3)
2. Note the claim ID from transaction
3. Use that ID to review

---

### 7. Test Expert Profile Display (2 minutes)

**Steps:**
1. Stay on Expert Dashboard
2. Observe profile section

**Expected Display:**
- ✅ Your name
- ✅ Expert level (General/Specialized/Professional)
- ✅ Reputation level (Seedling/Sprout/etc.)
- ✅ Reputation points
- ✅ Stats cards showing:
  - Reviews Submitted
  - Accuracy Rate
  - Rewards Earned
  - Current Stake

**Test Accuracy Calculation:**
- If 0 reviews: Shows "—"
- After 1+ reviews: Shows percentage

---

### 8. Test Wallet Interactions (5 minutes)

**Test Disconnect:**
1. Click wallet address in header
2. Click "Disconnect"
3. Expected: All pages show "Connect Wallet" prompts

**Test Reconnect:**
1. Click "Connect Wallet"
2. Approve in Freighter
3. Expected: All data loads again

**Test Without Wallet:**
1. Disconnect wallet
2. Try to access:
   - Expert Dashboard: Shows "Connect Wallet" message
   - Browse Claims: Shows "Connect Wallet" message
   - Claim Detail: Shows "Connect Wallet" message
3. Expected: All pages handle gracefully

---

### 9. Test Edge Cases (10 minutes)

**Test Empty States:**
1. **New account with no claims:**
   - Browse Claims → "No Claims Yet"
2. **No search results:**
   - Search for "zzz999" → "No Claims Found"
3. **Filtered to empty:**
   - Filter "Verified" when none exist → "No Claims Found"

**Test Error States:**
1. **Insufficient XLM:**
   - Try registering with < 100 XLM
   - Expected: Transaction fails with clear message
2. **User Rejection:**
   - Start registration, click "Reject" in Freighter
   - Expected: "Transaction rejected by user"
3. **Network Error:**
   - Disconnect internet, try action
   - Expected: Error message displayed

**Test Form Validation:**
1. **Expert Registration:**
   - Leave name empty → Form won't submit
   - Leave bio empty → Form won't submit
   - Select no categories → Alert message
2. **Claim Submission:**
   - Leave claim text empty → Form won't submit
   - Leave category empty → Form won't submit
3. **Review Submission:**
   - Leave reasoning empty → Form won't submit
   - Enter 0 stake → Validation error

---

### 10. Test Responsive Design (5 minutes)

**Resize Browser:**
1. Open Dev Tools (F12)
2. Toggle device toolbar
3. Test mobile view (375px)
4. Test tablet view (768px)
5. Test desktop view (1440px)

**Expected:**
- ✅ All pages adjust layout
- ✅ Navigation menu adapts
- ✅ Cards stack properly
- ✅ Forms remain usable
- ✅ Buttons are touchable
- ✅ Text is readable

---

## 🔍 Verification Checklist

After all tests, verify:

### Blockchain State
- [ ] Go to https://stellar.expert/explorer/testnet
- [ ] Search your wallet address
- [ ] See all transactions listed
- [ ] Check contract interactions
- [ ] Verify XLM balances

### Contract Deployments
- [ ] Claim Registry: `CDJDSL4LO3442NKVWAQIXGZLJOR7IKIZWFAQZUERPKEFSUETJLZFNUAY`
- [ ] Expert Registry: `CCLPI23VX3PVWBMPGDOYJZTKS4XMUWPWIPEOKSTZYK2WDQ6OEFQUJHUC`
- [ ] Review Consensus: `CBQOIHPAZMEZDGAPQRPPB3WCXL5YHWKVQ6SUVU5CUJUSEHCDLVER67M4`

### Browser Console
- [ ] Open Console (F12)
- [ ] No red errors (warnings OK)
- [ ] See log messages for transactions
- [ ] Check network requests succeed

---

## 🐛 Common Issues & Solutions

### Issue: "Account not found"
**Solution:** Fund account at https://laboratory.stellar.org/#account-creator

### Issue: Freighter doesn't pop up
**Solution:** 
- Check Freighter is installed
- Verify wallet is unlocked
- Refresh page
- Check popup blockers

### Issue: Transaction fails
**Solutions:**
- Verify on TESTNET network
- Check XLM balance sufficient
- Wait for previous transaction to clear
- Try again in 10 seconds

### Issue: Loading forever
**Solutions:**
- Check internet connection
- Refresh page
- Clear browser cache
- Restart development server

### Issue: Claims not showing
**Solutions:**
- Verify wallet connected
- Check claims exist (submit one first)
- Wait for blockchain sync
- Check console for errors

---

## 📊 Success Metrics

**All tests passed if:**
- ✅ Can register as expert
- ✅ Expert profile displays correctly
- ✅ Can submit claims
- ✅ Claims appear in Browse page
- ✅ Can search and filter claims
- ✅ Claim details display properly
- ✅ Can submit reviews
- ✅ Consensus displays correctly
- ✅ All transactions verify on Stellar Explorer
- ✅ XLM balances update correctly
- ✅ Error states handle gracefully
- ✅ Mobile responsive works

---

## 🎉 Testing Complete!

If all tests pass, your TruthStamp implementation is **production-ready** for Stellar Testnet!

**Next Steps:**
1. ✅ Document any bugs found
2. ✅ Test with multiple users
3. ✅ Verify all transaction hashes
4. ✅ Check blockchain state
5. ✅ Prepare for mainnet deployment (when ready)

---

**Happy Testing! 🚀**
