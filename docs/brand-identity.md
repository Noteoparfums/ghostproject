# Briefloom working identity

Briefloom is the working public identity for the product currently operated by the internal `ghostwriter-os` monorepo.

> **Launch review required:** Briefloom has passed only a lightweight exact-name screen. Trademark, domain, company-name, jurisdiction, and legal counsel review are required before public launch.

## Naming matrix

| Dimension | Assessment | Rationale |
| --- | --- | --- |
| Memorability | Strong | A compact compound word with a clear visual metaphor. |
| Category fit | Strong | “Brief” anchors the product in campaign inputs; “loom” suggests coordinated outputs. |
| Pronunciation | Clear | Pronounced “brief-loom,” with familiar English words and no ambiguous stress. |
| Visual potential | Strong | Intersecting editorial threads naturally support a proprietary woven-line mark and motion system. |
| Collision risk | Unconfirmed | Only a lightweight exact-name screen has been completed; professional clearance remains outstanding. |

## Positioning

**Category:** Direct-response copy intelligence

**Positioning line:** Weave one clear brief into a coordinated campaign.

Briefloom helps direct-response teams turn campaign context, audience insight, and brand voice into a coherent body of generated copy.

## Mark system

The mark uses three editorial threads. Terracotta represents the originating brief, evergreen represents durable brand context, and ochre represents the connective campaign strategy. Their paths cross and continue outward, expressing coordinated assets rather than isolated generation.

Approved variants live in `client/public/brand/`:

- `briefloom-primary.svg`
- `briefloom-compact.svg`
- `briefloom-monochrome.svg`
- `briefloom-favicon.svg`
- `briefloom-social-preview.svg`
- `briefloom-hero-fallback.svg`

React surfaces use `BrandMark` and `BrandLockup` from `client/src/components/brand/`. The mark may be decorative when accompanied by the wordmark. Standalone marks must expose the Briefloom accessible name.

## Source of truth

Public naming, positioning, navigation, metadata, support language, availability language, and legal-review notices are defined in `client/src/config/brand.ts`.

## Operational naming boundary

Briefloom is a presentation identity. The following operational identifiers intentionally remain unchanged:

- Root package name `ghostwriter-os`.
- Shared package name `@ghostwriter/shared`.
- API paths and request/response schemas.
- Database tables, columns, migrations, seeds, and identifiers.
- Analytics event names, payload contracts, and storage keys.
- Environment variables and deployment topology.

Changing the public identity must not trigger package renames, database migrations, API changes, or analytics contract changes.