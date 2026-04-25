# Repo conventions for Claude

## GitHub PR/issue replies

When replying to a comment on a PR or issue (including during `/autofix-pr` runs), **always tag the author of the comment being replied to** with `@username` at the start of the reply.

- Example: `@<comment-author> — fixed in <commit>, the selector is now scoped to ...`
- Applies to both human reviewers and bot accounts (`@<bot-account>`, etc.).
- Reason: GitHub's threaded replies don't always trigger a mention notification for the recipient. Without the tag, the reply can sit unseen.

## Pushing back on review comments

You are not required to apply every PR comment. If a suggestion is wrong, off-scope, or makes the code worse, **push back** instead of silently complying.

- Decide on the merits, not on who left the comment (human reviewer, Copilot, another bot — same bar).
- If you disagree, reply explaining *why* (constraint, prior decision, simpler alternative) and leave the code as-is.
- If a suggestion is partially right, take the good part and explain what you skipped.
- Only apply a change you'd defend on its own. "The reviewer asked" is not a sufficient reason.
- Out-of-scope suggestions: don't bundle them into the current PR — open a follow-up PR instead and link it in the reply.
