# Contributing to TruthStamp

Thank you for your interest in contributing to TruthStamp! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, versions)

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Create an issue with:
   - Clear description of the enhancement
   - Rationale for why it would be useful
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add some AmazingFeature'`)
6. Push to your branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Development Guidelines

#### Smart Contracts (Rust)

- Follow Rust style guide
- Add tests for new functionality
- Document public functions
- Keep functions focused and single-purpose
- Use meaningful variable names

```rust
/// Submit a new claim to the registry
/// 
/// # Arguments
/// * `submitter` - Address of the claim submitter
/// * `text` - The claim text (max 1000 chars)
/// * `category` - Claim category
/// * `sources` - Vector of source URLs
pub fn submit_claim(
    env: Env,
    submitter: Address,
    text: String,
    category: String,
    sources: Vec<String>
) -> u64 {
    // Implementation
}
```

#### Frontend (React/TypeScript)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Add proper error handling

```typescript
interface ClaimProps {
  claimId: number;
  walletAddress: string | null;
}

const ClaimDetail: React.FC<ClaimProps> = ({ claimId, walletAddress }) => {
  // Implementation
};
```

#### Testing

- Write unit tests for smart contracts
- Test edge cases and error conditions
- Ensure tests pass before submitting PR

```bash
# Run contract tests
cargo test

# Run frontend tests
cd truthstamp-app
npm test
```

#### Documentation

- Update README.md for user-facing changes
- Update technical docs for architecture changes
- Add inline comments for complex logic
- Update CHANGELOG.md

## Project Structure

```
contracts/          - Smart contracts (Rust/Soroban)
truthstamp-app/     - React frontend
docs/              - Documentation
scripts/           - Build and deployment scripts
```

## Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and PRs when applicable

Examples:
```
Add expert reputation calculation

Fix consensus calculation bug (#123)

Update documentation for deployment

Refactor claim submission flow
- Extract validation logic
- Add error handling
- Update tests
```

## Review Process

1. PRs require at least one review
2. All tests must pass
3. Code must follow style guidelines
4. Documentation must be updated
5. No merge conflicts

## Questions?

Feel free to open an issue for discussion or ask in pull request comments.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
