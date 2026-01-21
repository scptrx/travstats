import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    logger.info(`→ ${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get("user-agent"),
        userId: req.user?.id
    });

    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - start;

        logger.info(`← ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`, {
            duration,
            statusCode: res.statusCode
        });

        if (res.statusCode >= 400) {
            logger.error(`Error ${res.statusCode}: ${req.method} ${req.url}`, {
                statusCode: res.statusCode,
                body: req.body,
                error: data
            });
        }
        originalSend.call(this, data);
    };
    next();
};
