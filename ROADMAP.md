# TruthStamp Development Roadmap

## Phase 1: Smart Contracts ✅ COMPLETE

- [x] Project structure setup
- [x] Claim Registry contract
- [x] Expert Registry contract
- [x] Review Consensus contract
- [x] Unit tests for all contracts
- [x] Build scripts
- [x] Deployment scripts
- [x] Documentation

**Status**: All smart contracts are built, tested, and ready for deployment!

---

## Phase 2: Frontend Setup (Next Steps)

### 2.1 Project Initialization

```bash
# Create React + TypeScript project with Vite
npm create vite@latest truthstamp-frontend -- --template react-ts
cd truthstamp-frontend

# Install dependencies
npm install @stellar/stellar-sdk @stellar/freighter-api
npm install react-router-dom
npm install tailwindcss postcss autoprefixer
npm install zustand  # State management
npm install react-hot-toast  # Notifications
```

**Estimated Time**: 30 minutes

### 2.2 Wallet Integration

**Tasks**:
- [ ] Create `useWallet` hook
- [ ] Implement Freighter connection
- [ ] Handle wallet events (connect/disconnect)
- [ ] Show wallet address
- [ ] Display XLM balance

**Files to Create**:
- `src/hooks/useWallet.ts`
- `src/components/WalletButton.tsx`
- `src/utils/freighter.ts`

**Estimated Time**: 2 hours

### 2.3 Soroban Client Setup

**Tasks**:
- [ ] Configure Soroban RPC client
- [ ] Create contract client instances
- [ ] Implement transaction builder utilities
- [ ] Add error handling
- [ ] Create helper functions (XLM/stroops conversion)

**Files to Create**:
- `src/lib/soroban.ts`
- `src/lib/contracts/ClaimRegistry.ts`
- `src/lib/contracts/ExpertRegistry.ts`
- `src/lib/contracts/ReviewConsensus.ts`
- `src/utils/conversions.ts`

**Estimated Time**: 4 hours

---

## Phase 3: Core Features

### 3.1 Claim Submission Page

**Features**:
- [ ] Claim submission form
- [ ] Text input with character counter (max 1000)
- [ ] Category dropdown (Science, Politics, Health, Technology, etc.)
- [ ] Source URL inputs (dynamic add/remove)
- [ ] 0.5 XLM fee display
- [ ] Submit transaction handling
- [ ] Success/error notifications
- [ ] Redirect to claim detail page

**Components**:
- `src/pages/SubmitClaim.tsx`
- `src/components/ClaimForm.tsx`
- `src/components/SourceInput.tsx`

**Estimated Time**: 4 hours

### 3.2 Browse Claims Page

**Features**:
- [ ] List all claims (paginated)
- [ ] Filter by category
- [ ] Filter by status (Pending, UnderReview, True, False)
- [ ] Search by text
- [ ] Sort by date, stake pool, review count
- [ ] Claim cards with preview
- [ ] Click to view details

**Components**:
- `src/pages/BrowseClaims.tsx`
- `src/components/ClaimCard.tsx`
- `src/components/ClaimFilters.tsx`
- `src/components/Pagination.tsx`

**Estimated Time**: 6 hours

### 3.3 Claim Detail Page

**Features**:
- [ ] Display full claim details
- [ ] Show all reviews
- [ ] Display consensus result
- [ ] Show confidence percentage
- [ ] Visualize stake distribution (pie chart)
- [ ] Review timeline
- [ ] Expert profiles in reviews
- [ ] Real-time updates

**Components**:
- `src/pages/ClaimDetail.tsx`
- `src/components/ReviewList.tsx`
- `src/components/ReviewCard.tsx`
- `src/components/ConsensusDisplay.tsx`
- `src/components/StakeChart.tsx`

**Estimated Time**: 6 hours

---

## Phase 4: Expert Features

### 4.1 Expert Registration

**Features**:
- [ ] Registration form (name, bio, categories)
- [ ] Expert level selection (General/Specialized/Professional)
- [ ] Stake amount display and input
- [ ] Minimum stake validation
- [ ] Transaction confirmation
- [ ] Success redirect to dashboard

**Components**:
- `src/pages/RegisterExpert.tsx`
- `src/components/ExpertRegistrationForm.tsx`
- `src/components/StakeLevelSelector.tsx`

**Estimated Time**: 3 hours

### 4.2 Expert Dashboard

**Features**:
- [ ] Expert profile display
- [ ] Reputation score and level
- [ ] Badges/achievements
- [ ] Total reviews and accuracy
- [ ] Current stake and earnings
- [ ] Available claims to review (filtered by expertise)
- [ ] Review history
- [ ] Statistics charts

**Components**:
- `src/pages/ExpertDashboard.tsx`
- `src/components/ExpertProfile.tsx`
- `src/components/ReputationDisplay.tsx`
- `src/components/AvailableClaims.tsx`
- `src/components/ReviewHistory.tsx`
- `src/components/StatsChart.tsx`

**Estimated Time**: 8 hours

### 4.3 Review Submission

**Features**:
- [ ] Review form (verdict, reasoning, confidence)
- [ ] Stake amount input
- [ ] Claim context display
- [ ] Confidence slider (0-100)
- [ ] Rich text editor for reasoning
- [ ] Preview before submit
- [ ] Transaction handling
- [ ] Success notification

**Components**:
- `src/pages/SubmitReview.tsx`
- `src/components/ReviewForm.tsx`
- `src/components/ConfidenceSlider.tsx`
- `src/components/StakeInput.tsx`

**Estimated Time**: 5 hours

---

## Phase 5: Additional Features

### 5.1 Leaderboard

**Features**:
- [ ] Top experts by reputation
- [ ] Filter by category
- [ ] Sort by reputation, accuracy, earnings
- [ ] Expert profiles (clickable)
- [ ] Statistics display
- [ ] Rank badges

**Components**:
- `src/pages/Leaderboard.tsx`
- `src/components/LeaderboardTable.tsx`
- `src/components/ExpertRankCard.tsx`

**Estimated Time**: 4 hours

### 5.2 User Profile

**Features**:
- [ ] View submitted claims
- [ ] View review participation
- [ ] Transaction history
- [ ] Earnings summary (if expert)
- [ ] Settings

**Components**:
- `src/pages/Profile.tsx`
- `src/components/ClaimHistory.tsx`
- `src/components/TransactionHistory.tsx`

**Estimated Time**: 3 hours

### 5.3 Real-time Updates

**Features**:
- [ ] Polling for new reviews
- [ ] Notification system
- [ ] Live consensus updates
- [ ] Toast notifications

**Utilities**:
- `src/hooks/usePolling.ts`
- `src/hooks/useNotifications.ts`
- `src/lib/polling.ts`

**Estimated Time**: 3 hours

---

## Phase 6: UI/UX Polish

### 6.1 Design System

**Tasks**:
- [ ] Set up Tailwind CSS
- [ ] Define color palette
- [ ] Create component library
- [ ] Design tokens
- [ ] Responsive layouts
- [ ] Dark mode support

**Estimated Time**: 4 hours

### 6.2 Loading States

**Tasks**:
- [ ] Skeleton loaders
- [ ] Spinners
- [ ] Progress indicators
- [ ] Empty states
- [ ] Error states

**Estimated Time**: 2 hours

### 6.3 Animations

**Tasks**:
- [ ] Page transitions
- [ ] Component animations
- [ ] Micro-interactions
- [ ] Loading animations

**Estimated Time**: 2 hours

---

## Phase 7: Testing & Optimization

### 7.1 Testing

**Tasks**:
- [ ] Unit tests (components)
- [ ] Integration tests (contract calls)
- [ ] E2E tests (user flows)
- [ ] Contract interaction tests
- [ ] Error handling tests

**Estimated Time**: 6 hours

### 7.2 Performance Optimization

**Tasks**:
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Minimize bundle size

**Estimated Time**: 3 hours

### 7.3 Error Handling

**Tasks**:
- [ ] Global error boundary
- [ ] Transaction error handling
- [ ] Network error handling
- [ ] User-friendly error messages
- [ ] Retry mechanisms

**Estimated Time**: 3 hours

---

## Phase 8: Deployment & Launch

### 8.1 Deployment Setup

**Tasks**:
- [ ] Configure build
- [ ] Environment variables
- [ ] Deploy to Vercel/Netlify
- [ ] Set up CI/CD
- [ ] Domain configuration

**Estimated Time**: 2 hours

### 8.2 Documentation

**Tasks**:
- [ ] User guide
- [ ] FAQ
- [ ] Video tutorials
- [ ] API documentation
- [ ] Deployment guide

**Estimated Time**: 4 hours

### 8.3 Launch Preparation

**Tasks**:
- [ ] Testnet testing
- [ ] Bug fixes
- [ ] Performance testing
- [ ] Security audit
- [ ] User feedback

**Estimated Time**: 6 hours

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|-------------|
| Phase 1: Smart Contracts | ✅ Complete | None |
| Phase 2: Frontend Setup | 1 day | Phase 1 |
| Phase 3: Core Features | 2 days | Phase 2 |
| Phase 4: Expert Features | 2 days | Phase 3 |
| Phase 5: Additional Features | 1.5 days | Phase 4 |
| Phase 6: UI/UX Polish | 1 day | Phase 5 |
| Phase 7: Testing & Optimization | 1.5 days | Phase 6 |
| Phase 8: Deployment & Launch | 1 day | Phase 7 |

**Total Estimated Time**: ~10 days (working solo, full-time)

For a bootcamp demo, focus on Phases 1-4 (~5 days).

---

## Recommended Development Order

1. ✅ **Smart Contracts** (Complete)
2. **Wallet Integration** - Must have to interact with blockchain
3. **Claim Submission** - Core feature #1
4. **Browse Claims** - Core feature #2
5. **Expert Registration** - Core feature #3
6. **Claim Detail + Reviews** - Core feature #4
7. **Expert Dashboard** - Expert feature
8. **Review Submission** - Expert feature
9. **Polish & Testing** - Quality
10. **Deployment** - Launch

---

## Tech Stack Summary

**Frontend**:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (state management)

**Blockchain**:
- Stellar SDK
- Freighter API
- Soroban Client

**Development**:
- ESLint
- Prettier
- Vitest (testing)

**Deployment**:
- Vercel / Netlify

---

## Key Considerations for Stellar Bootcamp

### Must-Have Features for Demo
1. ✅ Smart contracts deployed to testnet
2. Wallet connection (Freighter)
3. Submit a claim
4. Register as expert
5. Submit a review
6. Show consensus result

### Nice-to-Have Features
- Leaderboard
- Dark mode
- Advanced filtering
- Real-time updates
- Charts and visualizations

### Presentation Tips
1. **Start with the problem**: Why do we need decentralized fact-checking?
2. **Show the contracts**: Explain the architecture
3. **Live demo**: Submit claim → Register expert → Review → Consensus
4. **Highlight unique features**: Staking, reputation, automatic rewards
5. **Future vision**: How this scales, governance, cross-chain

---

## Resources for Frontend Development

**Stellar/Soroban**:
- [Soroban Docs](https://soroban.stellar.org/docs)
- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Docs](https://docs.freighter.app/)

**React/TypeScript**:
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

**UI/UX**:
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Headless UI](https://headlessui.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## Next Immediate Steps

1. **Test smart contracts on testnet**:
   ```bash
   ./test.sh
   ./deploy.sh
   ```

2. **Initialize frontend project**:
   ```bash
   npm create vite@latest truthstamp-frontend -- --template react-ts
   ```

3. **Copy contract addresses**:
   ```bash
   cp .env truthstamp-frontend/.env
   ```

4. **Start building**! 🚀

---

**Good luck with your Stellar Bootcamp project!** 🌟

If you need help with frontend implementation, refer to `INTEGRATION_GUIDE.md` for detailed code examples.
