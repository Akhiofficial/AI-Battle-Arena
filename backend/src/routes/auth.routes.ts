import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { identifyUser } from "../middlewares/identify.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", identifyUser, getMe);

export default router;
