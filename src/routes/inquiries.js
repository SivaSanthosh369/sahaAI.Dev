const router = require('express').Router();
const pool = require('../config/db');

// GET all inquiries (admin only - no session check)
router.get('/all', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT i.*, c.name as client_name 
            FROM inquiries i 
            JOIN clients c ON i.client_id = c.client_id 
            ORDER BY i.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET inquiries for logged-in client
router.get('/', async (req, res) => {
    if (!req.session.client) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    
    const client_id = req.session.client.client_id;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM inquiries WHERE client_id = ? ORDER BY created_at DESC',
            [client_id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new inquiry (from main page form)
router.post('/', async (req, res) => {
    if (!req.session.client) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    
    const client_id = req.session.client.client_id;
    const { first_name, last_name, email, mobile, service_type } = req.body;
    
    if (!first_name || !last_name || !mobile || !service_type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const [result] = await pool.query(
            `INSERT INTO inquiries 
            (client_id, first_name, last_name, email, mobile, service_type) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [client_id, first_name, last_name, email || null, mobile, service_type]
        );
        res.status(201).json({ 
            inquiry_id: result.insertId, 
            message: 'Inquiry submitted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update inquiry status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'contacted', 'converted', 'lost'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    
    try {
        await pool.query('UPDATE inquiries SET status = ? WHERE inquiry_id = ?', [status, req.params.id]);
        res.json({ inquiry_id: req.params.id, status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;