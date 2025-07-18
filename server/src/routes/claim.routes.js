import express from "express";
import { claimPoints } from "../controllers/claim.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/claim-points", claimPoints);

export default router;
