const router = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Client login
router.post('/login-client', async (req, res) => {
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
                return res.status(500).json({ error: 'Session save failed' });
            }
            res.json({ 
                message: 'Login successful',
                client: req.session.client
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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