import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    marketing_opt_in: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    marketing_opt_in?: boolean | undefined;
    avatar_url?: string | null | undefined;
}, {
    name?: string | undefined;
    marketing_opt_in?: boolean | undefined;
    avatar_url?: string | null | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export declare const changePasswordSchema: z.ZodObject<{
    current_password: z.ZodString;
    new_password: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>;
}, "strip", z.ZodTypeAny, {
    current_password: string;
    new_password: string;
}, {
    current_password: string;
    new_password: string;
}>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export declare const notificationPreferenceSchema: z.ZodObject<{
    type: z.ZodString;
    email_enabled: z.ZodBoolean;
    inapp_enabled: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: string;
    email_enabled: boolean;
    inapp_enabled: boolean;
}, {
    type: string;
    email_enabled: boolean;
    inapp_enabled: boolean;
}>;
export declare const updateNotificationPreferencesSchema: z.ZodObject<{
    preferences: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        email_enabled: z.ZodBoolean;
        inapp_enabled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type: string;
        email_enabled: boolean;
        inapp_enabled: boolean;
    }, {
        type: string;
        email_enabled: boolean;
        inapp_enabled: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    preferences: {
        type: string;
        email_enabled: boolean;
        inapp_enabled: boolean;
    }[];
}, {
    preferences: {
        type: string;
        email_enabled: boolean;
        inapp_enabled: boolean;
    }[];
}>;
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;
export declare const createApiKeySchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export declare const deleteAccountSchema: z.ZodObject<{
    password: z.ZodString;
    confirm: z.ZodLiteral<"DELETE">;
}, "strip", z.ZodTypeAny, {
    password: string;
    confirm: "DELETE";
}, {
    password: string;
    confirm: "DELETE";
}>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
//# sourceMappingURL=account.d.ts.map