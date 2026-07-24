# ARCLIFT Release Runbook

## Production gate

Do not push `main` until the user explicitly says `确认发布`.

## Local verification

1. Run `npm run verify`.
2. Run `git diff --check`.
3. Inspect `git status --short`.
4. Scan tracked files and `dist` for credential patterns.
5. Review `http://localhost:4321/`, `/contact/`, one ARC-C page and one ARC-F page at desktop and 390x844.

## Preview inquiry test

1. Announce that one `ARCLIFT TEST` email and one DingTalk message will be created.
2. Use the preview Worker; never add localhost to the production origin list.
3. Confirm arrival in Formspree, Gmail and DingTalk.
4. Record only time, request ID and channel status.

## Approved release

1. Re-run local verification.
2. Commit only reviewed files.
3. Push `main`.
4. Inspect GitHub Actions and Cloudflare Pages.
5. Report only failures unless the user asks for a deployment report.

## Rollback

1. Require an explicit user rollback instruction.
2. Create `git revert` for the faulty release commit; do not rewrite `main`.
3. Push the revert.
4. Verify both Pages and Worker deployments.
5. Submit a controlled inquiry test after rollback.

## Privacy

Never copy inquiry names, emails, phones, companies or messages into Git, Obsidian, logs or deployment reports.
