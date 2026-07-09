import { describe, it, expect } from 'vitest';
import { parseEnv } from '../src/env.js';
import { formatCents, parseToCents } from '../src/money.js';
import { isValidEuVatId } from '../src/vat.js';
import { isLegalSubscriptionTransition } from '../src/types.js';
import { FUNNEL_ASSET_MATRIX } from '../src/constants/funnels.js';
import { signupSchema } from '../src/schemas/auth.js';

describe('Shared Library Suite', () => {
  describe('Environment Parser', () => {
    it('fails missing variables with structured descriptions', () => {
      const result = parseEnv({});
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.includes('DATABASE_URL'))).toBe(true);
      }
    });

    it('successfully parses valid environment variables', () => {
      const result = parseEnv({
        DATABASE_URL: 'mysql://root:root@127.0.0.1:3306/ghostwriter_dev',
        JWT_SECRET: 'super-secret-key-at-least-32-chars-long',
      });
      expect(result.ok).toBe(true);
    });

    it('accepts Groq when an API key is configured', () => {
      const result = parseEnv({
        DATABASE_URL: 'mysql://root:root@127.0.0.1:3306/ghostwriter_dev',
        AI_PROVIDER: 'groq',
        GROQ_API_KEY: 'test-groq-key',
      });
      expect(result.ok).toBe(true);
    });

    it('rejects Groq without an API key', () => {
      const result = parseEnv({
        DATABASE_URL: 'mysql://root:root@127.0.0.1:3306/ghostwriter_dev',
        AI_PROVIDER: 'groq',
      });
      expect(result.ok).toBe(false);
    });
  });

  describe('Money utilities', () => {
    it('correctly formats integer cents to localized currency format', () => {
      expect(formatCents(4900)).toBe('$49.00');
      expect(formatCents(0)).toBe('$0.00');
    });

    it('correctly parses decimals to integer cents with proper rounding', () => {
      expect(parseToCents('49.00')).toBe(4900);
      expect(parseToCents(49.00)).toBe(4900);
      expect(parseToCents('49.004')).toBe(4900);
      expect(parseToCents('49.006')).toBe(4901);
    });
  });

  describe('EU VAT utilities', () => {
    it('accurately verifies formatted EU VAT IDs', () => {
      expect(isValidEuVatId('DE123456789', 'DE')).toBe(true);
      expect(isValidEuVatId('de 123.456.789', 'DE')).toBe(true); // normalize spaces/dots
      expect(isValidEuVatId('FRXX123456789', 'FR')).toBe(true);
      expect(isValidEuVatId('INVALID_VAT')).toBe(false);
    });
  });

  describe('Billing State Machine', () => {
    it('allows legal status transitions', () => {
      expect(isLegalSubscriptionTransition('trialing', 'active')).toBe(true);
      expect(isLegalSubscriptionTransition('active', 'past_due')).toBe(true);
      expect(isLegalSubscriptionTransition('past_due', 'active')).toBe(true);
    });

    it('rejects illegal transitions', () => {
      expect(isLegalSubscriptionTransition('expired', 'active')).toBe(false);
      expect(isLegalSubscriptionTransition('cancelled', 'expired')).toBe(false);
    });
  });

  describe('Funnel-Asset Matrix', () => {
    it('defines expected deliverables for funnel types', () => {
      expect(FUNNEL_ASSET_MATRIX.vsl).toContain('vsl_script');
      expect(FUNNEL_ASSET_MATRIX.vsl).toContain('ad_hooks');
      expect(FUNNEL_ASSET_MATRIX.ecom_pdp).toContain('product_description');
    });
  });

  describe('Zod validation schemas', () => {
    it('verifies valid signup data', () => {
      const signupData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        tos: true,
      };
      const parseResult = signupSchema.safeParse(signupData);
      expect(parseResult.success).toBe(true);
    });

    it('flags weak password constraints', () => {
      const weakSignup = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
        tos: true,
      };
      const parseResult = signupSchema.safeParse(weakSignup);
      expect(parseResult.success).toBe(false);
    });
  });
});
