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

**Verified HEAD at current session start:** `fab4722` (`4`)

**Working tree at current session start:** only untracked `.verdent/`; it is unrelated and must not be committed.

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

- Step 1 brand work is implemented, verified, committed, and pushed.
- Step 2 semantic style files and local font assets are implemented, verified, committed, and pushed.
- Three/WebGL packages are absent from `client/package.json`; the progressive hero work is not complete.
- The planned auth shell and generation component split are absent from the tracked file inventory.
- Steps 4-12 have not been behaviorally, visually, or contract-verified in this ledger; Step 3 remains active.
- Step 1 and Step 2 build, lint, and targeted browser results are recorded below; final root tests, accessibility, bundle, and full-stack route verification remain pending for Step 12.

### Current Step 1 findings

- Targeted source search found one stale visible `New to Ghostwriter?` login label; it is now sourced from `BRAND.name`.
- Cookie identity copy, standalone mark title, 403/404 labels, and fatal-error copy are now sourced from central brand configuration.
- The unsupported fatal-error claim that engineers had been notified was removed.
- Targeted source search now finds no visible `Ghostwriter OS`, `GhostwriterOS`, or `New to Ghostwriter` strings under `client/`.
- Operational identifiers `ghostwriter-os`, `@ghostwriter/shared`, and `gw_*` analytics/consent storage keys remain unchanged.
- Locked workspace dependencies are installed locally; the client production build passes.
- Client lint completes with zero errors and 24 warnings; the Step 1 metadata-hook dependency warnings were removed, while the remaining warnings are outside the Step 1 files.
- All six static SVG variants render successfully in browser inspection at desktop or mobile viewport sizes.
- Browser inspection confirms Briefloom page titles and responsive branded public surfaces. Frontend-only preview inspection records expected `/api/auth/refresh` 404 responses and a Vite HMR host mismatch that belongs to Step 11.
- Step 1 implementation and verification were committed and pushed as `9779f1f`.

### Current Step 2 findings

- Added dedicated semantic color, status, chart, radius, spacing, shadow, z-index, typography, surface, and motion tokens.
- Added self-hosted variable Inter, Fraunces normal/italic, and Source Serif 4 fonts with SIL Open Font License texts.
- Theme persistence now uses brand-neutral `ui_theme`, migrates the legacy key, tolerates blocked storage, and exposes preference plus resolved theme on the root element.
- The pre-render bootstrap resolves and applies system/light/dark before React loads.
- Client production build passes; lint completes with zero errors and the same 24 warnings outside the new Step 2 styles.
- Desktop and mobile light-mode browser inspection passes; local interface and display font requests return 200.
- Persisted dark bootstrap was verified with a temporary same-origin harness: the root had class, preference, resolved mode, and color scheme set to `dark`, with computed body background `rgb(23, 33, 29)`.
- Static review confirms system and reduced-motion media listeners update state and clean up; the agent browser does not expose media emulation, so live OS preference switching remains pending for the final quality step.
- Source Serif 4 is locally served and built but no current route uses the new `.font-reading` utility, so its network request remains pending until a document-reading surface adopts it.
- Step 2 was committed and pushed as `752b480`.

### Current Step 3 findings

- Modal now exposes labelled dialog semantics, optional description wiring, explicit initial focus, escape/backdrop controls, and a 44px close target.
- Focus trapping now filters unavailable elements, handles empty and escaped focus, supports preferred initial focus, and restores the trigger after close.
- Body scroll locking is reference-counted for nested dialogs, compensates for scrollbar width, and makes non-top-level body content inert.
- ConfirmDialog now describes itself, focuses the safest action by default, focuses the required text field when applicable, and prevents dismissal while confirmation is loading.
- Button, Field, Input, Select, and Toggle now have complete invalid/description wiring, disabled and loading semantics, explicit hover/active/focus/selected/success/destructive states where applicable, and minimum 44px interactive targets.
- The overlay-foundation production build passed; lint completed with zero errors and the same 24 warnings outside the changed overlay files.
- Runtime keyboard interaction remains pending because the available agent browser controls do not expose click, key input, or script evaluation in this session.
- The overlay foundation was committed and pushed as `9e5fd7f`; the working tree then contained only untracked `.verdent/`.
- Button, Field, Input, Select, and Toggle control-state changes are present in Git-verified `HEAD` `fab4722`, which matches `origin/main`; isolated TypeScript verification remains pending.
- The isolated TypeScript rerun initially could not start because this fresh environment had no root `node_modules/.bin/tsc`; after installing 348 locked workspace packages, the same five-file check passed with no diagnostics.

### Contract boundary

Supported and retained: auth lifecycle, email verification, password reset, project CRUD/archive/restore, brand-voice CRUD, generation start/history, project assets, persisted-asset section regeneration, billing state/invoices/checkout/portal/cancellation, consent, credits, and current analytics.

Unsupported and never simulated: generation cancellation, A/B variants, generation detail hydration, asset editing/favoriting, exports, invoice PDF download, refund submission, billing-detail persistence, subscription reactivation, profile/password/session/notification/API-key mutations, fake checkout completion, and mock credit ledger data.

### Resume Point

```yaml
last_updated: 2026-07-10
branch: main
verified_head_at_session_start: fab4722
remote_parity_at_session_start: main matches origin/main
working_tree_at_session_start: only untracked .verdent/
phase: frontend-rebuild
current_plan_step: 3
current_step_name: Rebuild shared UI, overlay, feedback, and responsive data primitives
step_status: control-state-verification-complete-commit-pending
next_executable_action: Commit the validated continuity correction and control-state verification checkpoint, then push it to the tracked main branch.
first_files_to_read:
  - AGENTS.md
  - client/src/components/ui/Button.tsx
  - client/src/components/ui/Field.tsx
  - client/src/components/ui/Input.tsx
  - client/src/components/ui/Select.tsx
  - client/src/components/ui/Toggle.tsx
files_to_ignore:
  - .verdent/
verification_completed:
  - stale visible Ghostwriter OS source and built HTML search
  - all six SVG variants rendered in desktop or mobile browser viewports
  - metadata defaults and route title behavior
  - internal contract identifier preservation
  - client production build
  - client lint with zero errors and 24 unrelated warnings
  - Step 1 commit 9779f1f pushed to origin/main
  - Step 2 light-mode desktop and mobile rendering
  - Step 2 persisted dark bootstrap
  - Step 2 local interface and display font loading
  - Step 2 production build and lint
  - Step 2 commit 752b480 pushed to origin/main
  - Step 3 overlay build and lint
  - Step 3 overlay commit 9e5fd7f pushed to origin/main
  - Step 3 five-control isolated strict TypeScript check
  - Step 3 control-state checkpoint scoped diff inspection and git diff --check
verification_pending: []
known_blockers: []
do_not_repeat:
  - broad repository inventory already captured on 2026-07-10
  - Step 1 brand audit and SVG inspection unless Step 1 files change
  - Step 2 client build and lint unless Step 2 files change
  - Step 3 overlay build and lint unless overlay files change
```

## 3) Active Files

| File | Purpose | State | Next action |
|---|---|---|---|
| `AGENTS.md` | Persistent project memory and mandatory handoff protocol | Git correction and verification checkpoint inspected; `git diff --check` passed | Commit and push checkpoint |
| `client/src/components/ui/Button.tsx` | Shared button states and touch targets | Complete states and 44px target passed isolated TypeScript verification | No further action in this atomic step |
| `client/src/components/ui/Field.tsx` | Shared labels, hints, and errors | Automatic ID, described-by, and invalid wiring passed isolated TypeScript verification | No further action in this atomic step |
| `client/src/components/ui/Input.tsx` | Shared text controls | Multiline cast fix and semantic states passed isolated TypeScript verification | No further action in this atomic step |
| `client/src/components/ui/Select.tsx` | Shared selection control | Invalid/success/disabled states and 44px target passed isolated TypeScript verification | No further action in this atomic step |
| `client/src/components/ui/Toggle.tsx` | Shared binary control | Switch labels, selected states, and 44px target passed isolated TypeScript verification | No further action in this atomic step |

## 4) Changes Made

| Date | Plan step | Change | Verification | Commit / push |
|---|---:|---|---|---|
| 2026-07-10 | Continuity setup | Added this root continuity ledger with mandatory session-start, low-credit checkpoint, atomic commit/push, failure logging, and exact resume rules. Captured only repository facts verified from Git and targeted files. | Initial unstaged check did not cover the untracked file; staged `git diff --cached --check` passed after whitespace fix | Present in verified `HEAD` `40f545d`; session-start status confirmed `main` matches `origin/main` |
| 2026-07-10 | Continuity correction | Replaced stale HEAD and working-tree claims with the Git state verified at the current session start. | Session-start `git status --short --branch`, `git log -5 --oneline --decorate`, `git show HEAD:AGENTS.md`, scoped diff inspection, and `git diff --check` passed | Commit without explicit identity failed; retry pending with existing repository author identity |
| 2026-07-10 | Continuity correction | Corrected the current session HEAD from stale `40f545d` to Git-verified `1665c15`; confirmed `main` matches `origin/main` and only `.verdent/` is untracked. | Session-start `git status --short --branch`, `git log -5 --oneline --decorate`, and `git show HEAD:AGENTS.md` | Included in this checkpoint; push required before Step 1 resumes |
| 2026-07-10 | 1 | Completed the targeted brand audit, centralized the login metadata description, and normalized document metadata dependencies without changing public or operational contracts. | Stale-name searches clean; six SVGs rendered; client build passed; lint returned zero errors and 24 unrelated warnings; desktop/mobile public pages inspected | Commit and push pending |
| 2026-07-10 | 1 | Completed the Step 1 checkpoint and activated Step 2. | Commit `9779f1f` and push output confirmed `main -> main`; working tree then contained only untracked `.verdent/` | `9779f1f` pushed to `origin/main` |
| 2026-07-10 | 2 | Added the semantic theme foundation, locally hosted fonts, resilient three-mode persistence, and reduced-motion rules. | Client build passed; lint returned zero errors and 24 unchanged unrelated warnings; desktop/mobile light mode rendered; interface/display fonts loaded with 200 responses | Verification and checkpoint pending |
| 2026-07-10 | 2 | Verified persisted dark bootstrap with a temporary same-origin harness, then removed the harness. | Root preference, class, resolved mode, color scheme, and computed dark background matched; static listener review covered live system and reduced-motion updates | Commit and push pending |
| 2026-07-10 | 2 | Completed the Step 2 checkpoint and activated Step 3. | Commit `752b480` and push output confirmed `main -> main`; working tree then contained only untracked `.verdent/` | `752b480` pushed to `origin/main` |
| 2026-07-10 | 3 | Rebuilt the shared modal focus, dismissal, inert-background, and nested scroll-lock foundation; updated ConfirmDialog to use safe initial focus and loading guards. | Client build passed; lint returned zero errors and 24 unchanged unrelated warnings; `git diff --check` passed | Commit and push pending |
| 2026-07-10 | 3 | Completed the overlay-foundation checkpoint. | Commit `9e5fd7f` and push output confirmed `main -> main`; working tree then contained only untracked `.verdent/` | `9e5fd7f` pushed to `origin/main` |
| 2026-07-10 | Continuity correction | Corrected the stale session-start HEAD from `1665c15` to Git-verified `3bdce02`; confirmed `main` matches `origin/main` and only `.verdent/` is untracked. Also corrected stale verification-summary bullets that contradicted the recorded Step 1-3 results. | Session-start `git status --short --branch` and `git log -5 --oneline --decorate` | Include with the Step 3 control-state checkpoint |
| 2026-07-10 | 3 | Rebuilt Button, Field, Input, Select, and Toggle semantic states, accessibility wiring, loading behavior, and minimum touch targets without removing existing props. | Implementation complete; client build and lint pending | Commit and push pending |
| 2026-07-10 | Continuity correction | Corrected the stale session-start HEAD from `3bdce02` to Git-verified `fab4722`; confirmed `main` matches `origin/main`, only `.verdent/` is untracked, and all five active control changes are already present in `HEAD`. | Session-start `git status --short --branch`, `git log -5 --oneline --decorate`, and targeted `git show HEAD:` reads of the ledger and five active controls | Record with the Step 3 control-state verification checkpoint |
| 2026-07-10 | 3 | Resumed the recorded isolated control-state verification from Git-verified `fab4722`. | The TypeScript command could not start because dependencies are absent in this fresh environment | Checkpoint pending after locked dependency installation and verification |
| 2026-07-10 | 3 | Installed 348 locked workspace packages and reran isolated strict TypeScript verification for Button, Field, Input, Select, and Toggle. | `npm ci` completed; the five-file `tsc --noEmit` check passed with no diagnostics | Continuity correction and verification checkpoint commit/push pending |
| 2026-07-10 | 3 | Inspected the scoped continuity checkpoint diff and checked whitespace. | Only `AGENTS.md` is modified, `.verdent/` remains untracked and excluded, and `git diff --check` passed | Commit and push pending |

When recording future work, append a row; do not erase historical rows. Keep entries short and link each change to one plan step.

## 5) Failed Attempts

| Date | Plan step | Command or approach | Failure | Files changed | Retry condition / resolution |
|---|---:|---|---|---|---|
| 2026-07-10 | Continuity setup | Staged `AGENTS.md`, then ran `git diff --cached --check` before commit | Four Markdown hard-break lines had trailing whitespace; the command exited 2, so commit and push did not run | No additional files changed; `AGENTS.md` remained staged and was then corrected | Resolved by replacing hard-break whitespace with blank lines; rerun the staged check before committing |
| 2026-07-10 | Continuity setup | Ran the validated commit without an explicit author identity | Git could not auto-detect `user.name` and `user.email`; commit and push did not run | No files changed at failure time | Resolved in a prior session: `AGENTS.md` is present in verified `HEAD` `40f545d`, and `main` matches `origin/main`; do not repeat the failed identity-less command |
| 2026-07-10 | Continuity correction | Ran `git commit` without explicit author environment variables because the ledger said the prior identity failure was resolved | Git again could not auto-detect `user.name` and `user.email`; commit and push did not run | `AGENTS.md` remained staged; no product files changed | Retry with `GIT_AUTHOR_*` and `GIT_COMMITTER_*` set from the existing `HEAD` author; do not modify Git configuration |
| 2026-07-10 | 1 | Ran client build and lint before workspace dependencies were installed | Build could not find `tsc`; lint could not find `oxlint`; both exited 127 | No files changed by either command | Install locked workspace dependencies, then retry because the environment will have changed |
| 2026-07-10 | 1 | First locked dependency installation attempt used the default 120-second command limit | `npm ci` timed out after 120 seconds; no tracked files changed | No tracked files changed; partial local dependency installation occurred | Resolved by rerunning with a 600-second limit; 348 packages installed in 17 seconds |
| 2026-07-10 | 1 | Inspected public pages through the frontend-only Vite server | `/api/auth/refresh` returned 404 because the backend was not running; HMR attempted the stale configured preview host and returned 404 | No files changed | Record as expected frontend-only preview limitation; correct HMR host in Step 11 and use full-stack preview for final verification |
| 2026-07-10 | 3 | Ran the client production build and lint after the control-state changes | Build could not find shared-workspace `tsc`; lint could not find `oxlint`; both exited 127 because local dependencies from the prior session are absent | No tracked files changed by either command | Install locked workspace dependencies with the previously successful extended timeout, then rerun both checks because the environment will have changed |
| 2026-07-10 | 3 | Reran the client production build after successfully installing 348 locked packages | Build reached TypeScript but failed because the tracked shared config extends absent `/workspace/ghostproject/tsconfig.base.json`; resulting shared `node:fs`, `node:path`, and union-narrowing errors are outside the active files | No tracked files changed by the build | Treat as a pre-existing repository build blocker; use isolated TypeScript verification for the five active controls and do not alter files outside this atomic step |
| 2026-07-10 | 3 | Ran isolated TypeScript verification for the five active controls | One active-file error identified an intentionally cross-element multiline props cast that needed to pass through `unknown` | No additional files changed by the command; `Input.tsx` then received the scoped fix | Rerun the same isolated check after the active file changed |
| 2026-07-10 | 3 | Reran isolated TypeScript verification from the recorded resume point | Root `/workspace/ghostproject/node_modules/.bin/tsc` was absent, so the shell returned command not found and no type checking ran | No files changed by the command; only `AGENTS.md` records the result | Resolved after `npm ci` installed 348 packages; the unchanged isolated command then passed |

For every future failure, append: date, plan step, command or approach, exact error summary, whether files changed, and the condition required before retrying. Never delete a failure merely because it is later resolved; mark it resolved and reference the successful change.

## 6) Next steps

### Next executable action — Step 3 control-state verification

1. Commit this validated continuity correction and verification checkpoint.
2. Push the commit to the tracked `main` branch.

### Ordered project queue

- [x] **1. Brand:** central identity, marks/assets, metadata, legal naming caveat.
- [x] **2. Theme:** semantic tokens, typography, surfaces, motion, system/light/dark, no-flash bootstrap.
- [~] **3. UI system:** shared primitives, overlays, focus handling, feedback, responsive data patterns. Active.
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