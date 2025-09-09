const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = 'rate-limiter-flexible';

// Rate Limiting für Referral-APIs (pro IP)
const referralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Max 100 Requests pro IP im Fenster
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Zu viele Anfragen, bitte später erneut versuchen.' },
  skip: (req) => process.env.NODE_ENV === 'test', // In Tests deaktivieren
});

// Spezieller Limiter für Einladungen (weniger Requests erlaubt)
const inviteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  max: 50, // Max 50 Einladungen pro Stunde
  standardHeaders: true,
  message: { message: 'Zu viele Einladungen, bitte später erneut versuchen.' },
});

// Prüft, ob eine E-Mail eine gültige Domain hat (keine Temp-Mails)
const validateEmailDomain = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const disposableDomains = [
    'tempmail', 'mailinator', 'guerrillamail', '10minutemail', 'yopmail',
    'dispostable', 'maildrop', 'getnada', 'temp-mail', 'throwawaymail',
    'fakeinbox', 'tempmail', 'trashmail', 'mailnesia', 'mailsac',
    'mailtemp', 'mailcatch', 'tempr', 'tempmail', 'mailinator'
  ];

  const domain = email.split('@')[1]?.toLowerCase() || '';
  return !disposableDomains.some(d => domain.includes(d));
};

// Prüft auf Self-Referral (User versucht sich selbst einzuladen)
const preventSelfReferral = (req, res, next) => {
  const { email } = req.body;
  const userEmail = req.user?.email;
  
  if (email && userEmail && email.toLowerCase() === userEmail.toLowerCase()) {
    return res.status(400).json({ 
      message: 'Self-Referral ist nicht erlaubt.' 
    });
  }
  next();
};

module.exports = {
  referralLimiter,
  inviteLimiter,
  validateEmailDomain,
  preventSelfReferral,
};
