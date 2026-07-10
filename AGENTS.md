# Briefloom Project Continuity Ledger

This file is the mandatory source of truth for every agent session in this repository. Keep it concise, factual, and current. Its purpose is to let a new agent resume work without rescanning the project or repeating failed work.

## Mandatory Agent Protocol

### Session start

1. Read this file completely before inspecting or changing code.
2. Run only `git status --short --branch` and `git log -5 --oneline --decorate`.
3. Start from **Next executable action** below. Do not perform a broad repository scan.
4. Read only the files listed in **Active Files** or explicitly named by the next action.
5. If this ledger conflicts with Git or source code, trust Git/source code, correct this ledger immediately, and record the correction.

### Work discipline

- Work one numbered plan step at a time. Do not start the next step before the current step is implemented, verified, recorded here, committed, and pushed.
- Before editing, list every intended file in **Active Files**.
- After each meaningful change, update **Current State**, **Changes Made**, **Failed Attempts**, **Next steps**, and the **Resume Point**.
- Record facts only. Never mark a feature or check complete because a file exists; mark it complete only after implementation and verification.
- Do not repeat a command or failed approach already recorded here unless the code or environment changed. If retrying, state why.
- Never store access tokens, passwords, API keys, cookies, private URLs, database credentials, or personal data in this file.
- Do not rename package names, API paths, database identifiers, analytics keys, or deployment topology while applying the Briefloom public identity.

### Credits/context emergency rule

- Treat any visible low-credit, low-token, context-window, quota, or forced-stop warning as an immediate checkpoint event.
- At **25% remaining or the first low-credit warning**, stop starting new work. Finish only the smallest safe in-progress edit, then update this entire ledger.
- At **10% remaining or a critical warning**, stop implementation and testing immediately. Only write the checkpoint, inspect the resulting diff, commit, and push.
- The emergency checkpoint must include: exact completed work, active files, uncommitted files, verification already run, failures, blockers, the next single action, and the exact first files/commands needed by the next agent.
- If the remaining balance is not visible, checkpoint after every atomic plan step and before any operation likely to consume substantial context.

### GitHub checkpoint and commit rules

- Every completed atomic step must end with this ledger updated in the same commit as the code.
- Before committing, run `git status --short`, inspect the scoped diff, and run `git diff --check`.
- Stage only files belonging to the current atomic step. Never include unrelated or generated files, especially `.env*`, credentials, build output, dependency caches, or `.verdent/`.
- Use a concise conventional commit message describing the actual completed step.
- Push the commit to the current tracked branch immediately after committing. Never force-push, rewrite history, amend another agent's commit, or change branches unless the user explicitly requests it.
- Record the prior substantive commit hash and push result at the next normal checkpoint. Never create a recursive ledger-only commit solely to record its own hash; required session-start Git commands are the source of truth for the current ledger commit and remote parity.
- If commit or push fails, preserve the working tree, copy the exact failure into **Failed Attempts**, and make resolving that failure the first next step.
- Never claim a commit or push succeeded without command output confirming it.

## 1) Goal

Rebuild the existing React 19/Vite frontend as **Briefloom**, a cohesive premium direct-response copy intelligence product, while preserving every existing URL and all successful authentication, project, brand-voice, generation, billing, analytics, database, package, and deployment contracts.

The work is frontend-only with respect to product contracts:

- Keep supported server behavior intact.
- Remove, disable, or honestly explain unsupported operations instead of simulating them.
- Consume only the real generation stream events: `stage`, `token`, `complete`, and `error`.
- Do not fabricate assets, scores, stages, percentages, queue positions, refunds, testimonials, metrics, invoices, sessions, API keys, or checkout success.
- Preserve internal names such as `ghostwriter-os`, `@ghostwriter/shared`, API routes, database identifiers, and analytics storage keys unless directly visible to users.
- Execute the rebuild incrementally in the 12-step order summarized under **Next steps**.

## 2) Current State

**Last verified:** 2026-07-10

**Repository:** `Noteoparfums/ghostproject`

**Branch:** `main` tracking `origin/main`

**Verified HEAD before this ledger:** `ad19a12` (`p`)

**Working tree before this ledger:** only untracked `.verdent/`; it is unrelated and must not be committed.

### Confirmed present in the repository

- Briefloom identity configuration: `client/src/config/brand.ts`.
- Brand components: `client/src/components/brand/BrandMark.tsx` and `BrandLockup.tsx`.
- Six brand SVG assets under `client/public/brand/`.
- Central public pricing file: `client/src/config/pricing.ts`.
- Public pages for About, Blog, Changelog, Privacy, Terms, and Refund.
- Explicit status-page rendering for `/403`, `/404`, and the wildcard route.
- Lazy route declarations for all current marketing, legal, auth, and application URLs in `client/src/App.tsx`.
- Root `verdentc.json` still declares the existing split full-stack deployment.
- `README.md` uses Briefloom publicly while retaining operational package terminology.

### Confirmed incomplete or not yet verified

- Step 1 brand work is only **partially evidenced by files**; stale-brand search, metadata behavior, SVG rendering, and contract-name preservation have not been verified in this ledger.
- Dedicated semantic style files under `client/src/styles/` are absent from the tracked file inventory.
- Three/WebGL packages are absent from `client/package.json`; the progressive hero work is not complete.
- The planned auth shell and generation component split are absent from the tracked file inventory.
- Steps 2-12 have not been behaviorally, visually, or contract-verified in this ledger.
- No build, lint, test, browser, console, network, responsive, accessibility, or production-bundle result is currently recorded.

### Contract boundary

Supported and retained: auth lifecycle, email verification, password reset, project CRUD/archive/restore, brand-voice CRUD, generation start/history, project assets, persisted-asset section regeneration, billing state/invoices/checkout/portal/cancellation, consent, credits, and current analytics.

Unsupported and never simulated: generation cancellation, A/B variants, generation detail hydration, asset editing/favoriting, exports, invoice PDF download, refund submission, billing-detail persistence, subscription reactivation, profile/password/session/notification/API-key mutations, fake checkout completion, and mock credit ledger data.

### Resume Point

```yaml
last_updated: 2026-07-10
branch: main
verified_head_at_session_start: 2c7873b
remote_parity_at_session_start: main matches origin/main
working_tree_at_session_start: clean
phase: frontend-rebuild
current_plan_step: 1
current_step_name: Centralize Briefloom identity and brand assets
step_status: partial-unverified
next_executable_action: Audit only the Step 1 brand targets, patch missing brand requirements, then run targeted client checks.
first_files_to_read:
  - AGENTS.md
  - client/src/config/brand.ts
  - client/src/components/brand/BrandMark.tsx
  - client/src/components/brand/BrandLockup.tsx
  - client/index.html
  - client/src/hooks/useDocumentMeta.ts
  - docs/brand-identity.md
  - README.md
files_to_ignore:
  - .verdent/
known_blockers: []
verification_completed: []
verification_pending:
  - stale visible Ghostwriter OS search
  - SVG variant rendering
  - metadata defaults and canonical behavior
  - internal contract identifier preservation
  - client build
  - client lint
do_not_repeat:
  - broad repository inventory already captured on 2026-07-10
```

## 3) Active Files

| File | Purpose | State | Next action |
|---|---|---|---|
| `AGENTS.md` | Persistent project memory and mandatory handoff protocol | Tracked; stale pre-commit state corrected in the current checkpoint | Validate, commit, and push this factual correction |

No product source file is currently active. The next agent must add Step 1 files to this table before editing them.

## 4) Changes Made

| Date | Plan step | Change | Verification | Commit / push |
|---|---:|---|---|---|
| 2026-07-10 | Continuity setup | Added this root continuity ledger with mandatory session-start, low-credit checkpoint, atomic commit/push, failure logging, and exact resume rules. Captured only repository facts verified from Git and targeted files. | Initial unstaged check did not cover the untracked file; staged `git diff --cached --check` passed after whitespace fix | Present in verified `HEAD` `2c7873b`; session-start status confirmed `main` matches `origin/main` |
| 2026-07-10 | Continuity correction | Replaced stale pending-commit and working-tree claims with the Git state verified at session start. | Session-start `git status --short --branch`, `git log -5 --oneline --decorate`, and `git show HEAD:AGENTS.md` | Current correction pending scoped diff check, commit, and push |

When recording future work, append a row; do not erase historical rows. Keep entries short and link each change to one plan step.

## 5) Failed Attempts

| Date | Plan step | Command or approach | Failure | Files changed | Retry condition / resolution |
|---|---:|---|---|---|---|
| 2026-07-10 | Continuity setup | Staged `AGENTS.md`, then ran `git diff --cached --check` before commit | Four Markdown hard-break lines had trailing whitespace; the command exited 2, so commit and push did not run | No additional files changed; `AGENTS.md` remained staged and was then corrected | Resolved by replacing hard-break whitespace with blank lines; rerun the staged check before committing |
| 2026-07-10 | Continuity setup | Ran the validated commit without an explicit author identity | Git could not auto-detect `user.name` and `user.email`; commit and push did not run | No files changed at failure time | Resolved in a prior session: `AGENTS.md` is present in verified `HEAD` `2c7873b`, and `main` matches `origin/main`; do not repeat the failed identity-less command |

For every future failure, append: date, plan step, command or approach, exact error summary, whether files changed, and the condition required before retrying. Never delete a failure merely because it is later resolved; mark it resolved and reference the successful change.

## 6) Next steps

### Next executable action — Step 1 only

The continuity-ledger setup is complete once the current factual correction is committed and pushed. The next product action remains:

1. Audit only the brand files listed in the **Resume Point**.
2. Search user-visible client source and built HTML for stale `Ghostwriter OS` naming while excluding intentional internal identifiers.
3. Compare the existing implementation against Step 1 requirements: centralized copy/navigation/support/legal metadata, brand variants, favicon/social/hero assets, document metadata, cookie/error labels, naming caveat documentation, and README terminology.
4. Patch only confirmed Step 1 gaps.
5. Run the smallest targeted checks first, then client build and client lint.
6. Update every mutable section of this ledger with exact results.
7. Commit the Step 1 code and this ledger together, then push to the tracked branch.
8. Only after a successful push, mark Step 1 complete and activate Step 2.

### Ordered project queue

- [~] **1. Brand:** central identity, marks/assets, metadata, legal naming caveat. Partial and unverified.
- [ ] **2. Theme:** semantic tokens, typography, surfaces, motion, system/light/dark, no-flash bootstrap.
- [ ] **3. UI system:** shared primitives, overlays, focus handling, feedback, responsive data patterns.
- [ ] **4. Marketing:** public shell, truthful landing narrative, progressive WebGL hero, unified pricing.
- [ ] **5. Public/legal:** complete editorial, legal, forbidden, and not-found routes with metadata.
- [ ] **6. Auth:** unified auth shell while preserving real auth behavior and safe redirects.
- [ ] **7. App shell/dashboard:** document scrolling, mobile sheet, exact nav, real account state.
- [ ] **8. Generation:** honest Brief → Generate → Review workspace using actual SSE payloads only.
- [ ] **9. Projects/voice:** existing CRUD contracts, accessible controls, detail and wizard states.
- [ ] **10. Billing/settings:** provider-backed behavior only; remove all simulated operations.
- [ ] **11. Routing/publishing:** lazy boundaries, status surfaces, proxy/HMR configuration, route inventory.
- [ ] **12. Quality:** static, behavioral, accessibility, visual, responsive, bundle, and preview verification.

### Definition for changing a checkbox to complete

A step can become `[x]` only when its implementation is complete, its required verification has passed, the results are recorded in this file, and the corresponding commit has been pushed. Use `[~]` for partial work and `[!]` for blocked work.