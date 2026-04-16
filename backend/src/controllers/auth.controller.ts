import type { Request, Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: "30d",
    });
};

const setTokenCookie = (res: Response, token: string) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExists) {
            res.status(400).json({ error: "User already exists with this email or username" });
            return;
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        const token = generateToken((user._id as any).toString());
        setTokenCookie(res, token);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const token = generateToken((user._id as any).toString());
        setTokenCookie(res, token);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    // req.user will be populated by the identify middleware
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
};
