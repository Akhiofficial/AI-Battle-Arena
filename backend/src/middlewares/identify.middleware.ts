import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import type { IUser } from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const identifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = req.cookies.token;

    if (!token) {
        next();
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id).select("-password");
        
        if (user) {
            req.user = user as IUser;
        }
        next();
    } catch (err: any) {
        console.error("Auth middleware error:", err.message);
        next(); // Proceed anyway, routes can check req.user if needed
    }
};

// Strict protector middleware
export const protect = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ error: "Not authorized, please login" });
        return;
    }
    next();
};
