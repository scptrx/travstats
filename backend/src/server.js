import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import visitsRouter from "./routes/visits.js";
import geocodingRoutes from "./routes/geocode.js";
import logger from "./utils/logger.js";
import { requestLogger } from "./middlewares/requestLogger.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/visits", visitsRouter);
app.use("/geocode", geocodingRoutes);

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
