# Repo conventions for Claude

## GitHub PR/issue replies

When replying to a comment on a PR or issue (including during `/autofix-pr` runs), **always tag the original commenter** with `@username` at the start of the reply.

- Example: `@Copilot — fixed in <commit>, the selector is now scoped to ...`
- Applies to both human reviewers and bot accounts (`@Copilot`, etc.).
- Reason: GitHub's threaded replies don't auto-notify the original author. Without the tag, the reply can sit unseen.
