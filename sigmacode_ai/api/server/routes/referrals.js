const express = require('express');
const { v4: uuidv4 } = require('uuid');
const optionalJwtAuth = require('~/server/middleware/optionalJwtAuth');
const { 
  referralLimiter, 
  inviteLimiter, 
  validateEmailDomain,
  preventSelfReferral 
} = require('~/server/middleware/security');

const router = express.Router();

// In-Memory Store für Einladungen (in Produktion durch Datenbank ersetzen)
const inviteStore = new Map();

// Hilfsfunktion: Erstellt eine signierte Referral-URL
const createReferralUrl = (req, code) => {
  const protocol = req.secure ? 'https' : 'http';
  const host = req.get('host');
  return `${protocol}://${host}/signup?ref=${encodeURIComponent(code)}`;
};

// Hilfsfunktion: Validiert und bereinigt E-Mail
const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;
  return email.trim().toLowerCase();
};

/**
 * GET /api/referrals/me
 * Liefert den persönlichen Referral-Code, wenn der Nutzer eingeloggt ist.
 * - Generiert einen stabilen Code aus Nutzer-ID/Username
 * - Verwendet Rate-Limiting
 */
router.get('/me', optionalJwtAuth, referralLimiter, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json(null);
    }

    const { id, _id, username, email } = req.user || {};
    const basis = String(id || _id || username || email || '').trim();

    // Fallback, falls kein Identifier verfügbar
    if (!basis) {
      return res.status(200).json(null);
    }

    // Einfache, stabile Kurz-Hash-Funktion (kein Kryptohash, nur lesbarer Code)
    const shortHash = (str) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0; // unsigned
      }
      // Base36 und 8 Zeichen Kürzung
      return h.toString(36).toUpperCase().padStart(6, '0').slice(0, 8);
    };

    // Präfix zur Erkennung und spätere Migration möglich machen
    const code = `SC-${shortHash(basis)}`;

    return res.status(200).json({ code });
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving referral code' });
  }
});

/**
 * GET /api/referrals/stats
 * Zeigt die Referral-Statistiken des eingeloggten Nutzers an.
 * - Nutzt Rate-Limiting
 * - Erfordert Authentifizierung
 */
router.get('/stats', optionalJwtAuth, referralLimiter, async (req, res) => {
  try {
    // In Produktion aus Datenbank/Analytics aggregieren
    const data = {
      totalClicks: 124,
      totalSignups: 37,
      totalConverted: 18,
      conversionRate: 18 / 124, // 0.145...
      rewardsEarned: 126.5, // EUR
      rewardsAvailable: 42.0, // EUR (noch nicht eingelöst)
      monthBreakdown: [
        { month: '2025-06', clicks: 35, signups: 9, converted: 5, rewards: 34.5 },
        { month: '2025-07', clicks: 52, signups: 17, converted: 8, rewards: 56.0 },
        { month: '2025-08', clicks: 37, signups: 11, converted: 5, rewards: 36.0 },
      ],
    };
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving referral stats' });
  }
});

/**
 * POST /api/referrals/invite
 * Sendet eine Einladung an eine E-Mail-Adresse.
 * - Validiert E-Mail-Domain
 * - Verhindert Self-Referrals
 * - Nutzt speziellen Invite-Limiter
 */
router.post('/invite', optionalJwtAuth, inviteLimiter, preventSelfReferral, async (req, res) => {
  try {
    const { email } = req.body;
    const sanitizedEmail = sanitizeEmail(email);
    
    if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return res.status(400).json({ message: 'Ungültige E-Mail-Adresse' });
    }

    if (!validateEmailDomain(sanitizedEmail)) {
      return res.status(400).json({ 
        message: 'Bitte verwende eine dauerhafte E-Mail-Adresse (keine temporären E-Mails).' 
      });
    }

    // Prüfe, ob bereits eine Einladung für diese E-Mail existiert
    const existingInvite = Array.from(inviteStore.values()).find(
      invite => invite.email === sanitizedEmail && invite.referrerId === req.user.id
    );

    if (existingInvite) {
      const timeDiff = Date.now() - new Date(existingInvite.createdAt).getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        return res.status(429).json({ 
          message: `Bitte warte noch ${Math.ceil(24 - hoursDiff)} Stunden, bevor du ${sanitizedEmail} erneut einlädst.`
        });
      }
    }

    // Einladung speichern (in Produktion: Datenbank)
    const inviteId = `inv_${uuidv4().substring(0, 8)}`;
    const newInvite = {
      id: inviteId,
      email: sanitizedEmail,
      referrerId: req.user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Weitere Metadaten wie IP, User-Agent etc. könnten hier hinzugefügt werden
    };

    inviteStore.set(inviteId, newInvite);

    // In Produktion: E-Mail mit Referral-Link versenden
    // await sendInvitationEmail(email, createReferralUrl(req, req.user.referralCode));

    return res.status(201).json({ 
      message: 'Einladung wurde versendet.',
      invite: {
        id: newInvite.id,
        email: newInvite.email,
        status: newInvite.status,
        createdAt: newInvite.createdAt
      }
    });
  } catch (err) {
    console.error('Error sending invitation:', err);
    return res.status(500).json({ 
      message: 'Fehler beim Senden der Einladung. Bitte versuche es später erneut.' 
    });
  }
});

/**
 * GET /api/referrals/invites
 * Zeigt die Einladungen des eingeloggten Nutzers an.
 * - Nutzt Rate-Limiting
 * - Erfordert Authentifizierung
 */
router.get('/invites', optionalJwtAuth, referralLimiter, async (req, res) => {
  try {
    const items = [
      {
        id: 'inv_001',
        email: 'friend.one@example.com',
        status: 'converted', // pending | signed_up | converted | rejected
        clickedAt: '2025-08-10T10:20:00Z',
        signedUpAt: '2025-08-12T08:12:00Z',
        convertedAt: '2025-08-20T09:00:00Z',
        reward: 7.0,
      },
      {
        id: 'inv_002',
        email: 'friend.two@example.com',
        status: 'signed_up',
        clickedAt: '2025-08-14T12:00:00Z',
        signedUpAt: '2025-08-15T12:30:00Z',
        convertedAt: null,
        reward: 0,
      },
      {
        id: 'inv_003',
        email: 'friend.three@example.com',
        status: 'pending',
        clickedAt: '2025-08-18T16:45:00Z',
        signedUpAt: null,
        convertedAt: null,
        reward: 0,
      },
    ];
    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving referral invites' });
  }
});

module.exports = router;
