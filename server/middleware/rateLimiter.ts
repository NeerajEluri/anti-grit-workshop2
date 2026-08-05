import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 30, // max 30 AI calls per hour per IP
  message: { error: 'Rate limit exceeded for AI operations. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
