import { Router } from "express";
import { startBattle, getBattles } from "../controllers/battle.controller.js";
import { identifyUser, protect } from "../middlewares/identify.middleware.js";

const router = Router();

router.use(identifyUser);

router.post("/battle", protect, startBattle);
router.get("/battles", protect, getBattles);

export default router;
