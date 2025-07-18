import express from "express";
import {
    register,
    login,
    logout,
    addUser,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", authenticateUser, logout);
router.post("/add", authenticateUser, addUser);

export default router;
