const router = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const rateLimit = require('express-rate-limit');

// Brute force protection: limit login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per window
    message: { error: 'Too many login attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Client login
router.post('/login-client', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    try {
        const [rows] = await pool.query(
            `SELECT l.*, c.name, c.client_id 
             FROM client_login l 
             JOIN clients c ON l.client_id = c.client_id 
             WHERE l.email = ?`,
            [email]
        );
        
        if (!rows.length) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const valid = await bcrypt.compare(password, rows[0].password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        req.session.client = {
            client_id: rows[0].client_id,
            name: rows[0].name,
            email: rows[0].email
        };
        
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ 
                message: 'Login successful',
                client: req.session.client
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out' });
    });
});

// Check session
router.get('/session', (req, res) => {
    if (req.session.client) {
        res.json({ loggedIn: true, client: req.session.client });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;