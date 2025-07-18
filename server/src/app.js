import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRoutes from "./routes/user.routes.js";
import claimRoutes from "./routes/claim.routes.js";

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/claims", claimRoutes);

export default app;
