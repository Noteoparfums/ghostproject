# Briefloom

Briefloom is the working public identity for this direct-response copy intelligence product. It weaves one clear campaign brief into coordinated copy assets.

The operational monorepo and package identifiers remain `ghostwriter-os` and `@ghostwriter/shared`. API paths, database identifiers, analytics contracts, environment variables, and deployment topology are intentionally unchanged.

> Briefloom has passed only a lightweight exact-name screen. Trademark, domain, company-name, jurisdiction, and legal counsel review are required before public launch.

## Groq AI

The generation pipeline supports Groq's OpenAI-compatible API. Keep the API key
in the deployment environment and never commit it to source control.

Required runtime variables:

```text
AI_PROVIDER=groq
GROQ_API_KEY=<secret>
AI_MODEL=llama-3.3-70b-versatile
AI_FALLBACK_MODELS=openai/gpt-oss-120b,llama-3.1-8b-instant
```

The primary model is optimized for high-quality multilingual direct-response
copy. If it is unavailable or rate-limited, requests automatically fall back to
GPT-OSS 120B and then Llama 3.1 8B Instant.

## Deploy to Vercel

The repository is configured to deploy from its root as one Vercel project:

- Vite builds the frontend into `client/dist`.
- `/api/*` is routed to the Express application as one Vercel Function.
- All other non-file routes fall back to the React SPA.

Import the repository in Vercel and leave the Root Directory set to the
repository root. The build command and output directory are defined in
`vercel.json`.

Configure these Production environment variables before deploying:

```text
DATABASE_URL=postgresql://...
JWT_SECRET=<at-least-32-random-characters>
NODE_ENV=production
APP_URL=https://your-production-domain.example
```

`DATABASE_URL` must point to a PostgreSQL database that Vercel Functions can
reach. Run `npm run migrate` against that database before serving production
traffic.

For Groq generation, also configure:

```text
AI_PROVIDER=groq
GROQ_API_KEY=<secret>
AI_MODEL=llama-3.3-70b-versatile
AI_FALLBACK_MODELS=openai/gpt-oss-120b,llama-3.1-8b-instant
```

If `APP_URL` is omitted on a preview deployment, the application uses Vercel's
automatically supplied `VERCEL_URL`. Email delivery still requires a production
mail provider integration; without one, email actions are logged and skipped.

