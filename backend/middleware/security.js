const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

const securityMiddleware = (app) => {
    // Set security HTTP headers
    app.use(helmet());

    // Sanitize user input to prevent NoSQL Injection
    app.use(mongoSanitize());

    // Prevent HTTP Parameter Pollution
    app.use(hpp());

    // Rate limiting to prevent brute force
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per window
        message: 'Too many requests from this IP, please try again after 15 minutes'
    });
    app.use(limiter); // Apply to all routes
};

module.exports = securityMiddleware;