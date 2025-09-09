const express = require('express');
const optionalJwtAuth = require('~/server/middleware/optionalJwtAuth');

const router = express.Router();

/**
 * Lightweight endpoint used by the frontend to detect a session/user.
 * - Returns a minimal user shape if authenticated
 * - Returns null if not authenticated
 */
router.get('/', optionalJwtAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json(null);
    }

    // Normalize minimal shape expected by the client hook (useMe)
    const { id, _id, username, name, email } = req.user || {};
    return res.status(200).json({
      id: id || _id || undefined,
      username: username || undefined,
      name: name || undefined,
      email: email || undefined,
    });
  } catch (err) {
    // Fail gracefully with a generic error
    return res.status(500).json({ message: 'Error retrieving user info' });
  }
});

module.exports = router;
