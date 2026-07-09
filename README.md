# Ghostwriter OS

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

