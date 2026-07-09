import type { Request, Response } from 'express';
export declare const billingController: {
    getBillingState(req: Request, res: Response): Promise<void>;
    createSubscriptionCheckout(req: Request, res: Response): Promise<void>;
    createTopupCheckout(req: Request, res: Response): Promise<void>;
    completeMockCheckout(req: Request, res: Response): Promise<void>;
    createPortal(req: Request, res: Response): Promise<void>;
    getInvoices(req: Request, res: Response): Promise<void>;
    cancelSubscription(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=billing.controller.d.ts.map