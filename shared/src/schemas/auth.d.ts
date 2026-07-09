import { z } from 'zod';
/** Password policy mirrored on the client meter (length/case/number/symbol). */
export declare const passwordSchema: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>;
export declare const emailSchema: z.ZodString;
export declare const signupSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>;
    marketing_opt_in: z.ZodDefault<z.ZodBoolean>;
    tos: z.ZodLiteral<true>;
    utm: z.ZodOptional<z.ZodObject<{
        source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        campaign: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        term: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        content?: string | null | undefined;
        source?: string | null | undefined;
        medium?: string | null | undefined;
        campaign?: string | null | undefined;
        term?: string | null | undefined;
    }, {
        content?: string | null | undefined;
        source?: string | null | undefined;
        medium?: string | null | undefined;
        campaign?: string | null | undefined;
        term?: string | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    password: string;
    name: string;
    email: string;
    marketing_opt_in: boolean;
    tos: true;
    utm?: {
        content?: string | null | undefined;
        source?: string | null | undefined;
        medium?: string | null | undefined;
        campaign?: string | null | undefined;
        term?: string | null | undefined;
    } | undefined;
}, {
    password: string;
    name: string;
    email: string;
    tos: true;
    utm?: {
        content?: string | null | undefined;
        source?: string | null | undefined;
        medium?: string | null | undefined;
        campaign?: string | null | undefined;
        term?: string | null | undefined;
    } | undefined;
    marketing_opt_in?: boolean | undefined;
}>;
export type SignupInput = z.infer<typeof signupSchema>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    remember: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    remember: boolean;
}, {
    password: string;
    email: string;
    remember?: boolean | undefined;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const verifyEmailSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export declare const resendVerificationSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>;
}, "strip", z.ZodTypeAny, {
    password: string;
    token: string;
}, {
    password: string;
    token: string;
}>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
//# sourceMappingURL=auth.d.ts.map