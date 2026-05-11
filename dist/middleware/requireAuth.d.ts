import type { Request, Response, NextFunction } from 'express';
export interface AuthPayload {
    id: string;
    email: string;
    name: string;
    age: number;
}
export interface AuthenticatedRequest extends Request {
    user?: AuthPayload;
}
export declare function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=requireAuth.d.ts.map