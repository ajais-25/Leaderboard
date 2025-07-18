import express from "express";
import {
    register,
    login,
    logout,
    addUser,
    getAllUsers,
    getClaimHistory,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", authenticateUser, logout);
router.post("/add", authenticateUser, addUser);
router.get("/all", authenticateUser, getAllUsers);
router.get("/history", authenticateUser, getClaimHistory);

export default router;
