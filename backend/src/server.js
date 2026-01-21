import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import visitsRoutes from "./routes/visits.js";
import geocodingRoutes from "./routes/geocode.js";
import adminRoutes from "./routes/admin.js";
import logger from "./utils/logger.js";
import { requestLogger } from "./middlewares/requestLogger.js";

const app = express();

app.use(
    cors({
        origin: "http://127.0.0.1:5500",
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/visits", visitsRoutes);
app.use("/geocode", geocodingRoutes);
app.use("/admin", adminRoutes);

app.use((err, req, res, next) => {
    logger.error("Unhandled error:", {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body
    });

    res.status(500).json({ error: "Internal server error" });
});

process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Promise Rejection:", { reason });
});

process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", {
        error: error.message,
        stack: error.stack
    });
    process.exit(1);
});

app.listen(process.env.PORT, () => {
    console.log(`Backend running on http://localhost:${process.env.PORT}`);
});
