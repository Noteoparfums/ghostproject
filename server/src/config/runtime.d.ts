export declare const runtime: {
    isProd: boolean;
    isStaging: boolean;
    isDev: boolean;
    devSurfacesEnabled: boolean;
    mailer: {
        provider: string;
    };
    ai: {
        provider: "groq" | "mock" | "openai" | "anthropic";
        model: string | undefined;
    };
    payment: {
        provider: string;
    };
};
//# sourceMappingURL=runtime.d.ts.map