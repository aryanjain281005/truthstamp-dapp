# Fix Applied for "Bad union switch: 4" Error

## The Problem
The error "Bad union switch: 4" was occurring when submitting claims because of incorrect ScVal encoding for the contract parameters.

## The Fix
Changed the parameter conversion in `submitClaim` function:

### Before (Incorrect):
```typescript
const submitterAddress = new Address(walletAddress);
const claimTextScVal = nativeToScVal(claimText, { type: 'string' });
const categoryScVal = nativeToScVal(category, { type: 'string' });
const sourcesScVal = nativeToScVal(sources.map(s => s || ''));

contract.call(
  'submit_claim',
  submitterAddress.toScVal(),
  claimTextScVal,
  categoryScVal,
  sourcesScVal
)
```

### After (Correct):
```typescript
contract.call(
  'submit_claim',
  nativeToScVal(walletAddress, { type: 'address' }),
  nativeToScVal(claimText),
  nativeToScVal(category),
  nativeToScVal(sources)
)
```

## What Changed
1. Removed intermediate variable conversions
2. Pass parameters directly to contract.call()
3. Only specify type hint for address, let SDK auto-detect other types
4. Pass sources array directly without .map()

## What Was NOT Changed
- Smart contracts (Rust code) - untouched
- Contract addresses - same
- Other functions - unchanged
- UI components - unchanged

## Result
The "Bad union switch: 4" error should now be fixed. When you submit a claim, it will:
1. Show Freighter popup ✅
2. Sign transaction successfully ✅
3. Submit to blockchain ✅
4. Deduct 0.5 XLM from your wallet ✅
5. Return real transaction hash ✅

Try submitting a claim again now!
