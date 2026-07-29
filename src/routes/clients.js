const router = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { generateClientId } = require('../utils/idGenerator');

// GET all clients
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clients');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single client
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Client not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new client (admin form)
router.post('/', async (req, res) => {
    const { name, business_type, date_of_joining, developer_id, email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required for login' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const clientId = await generateClientId();
        
        await connection.query(
            'INSERT INTO clients (client_id, name, business_type, date_of_joining, developer_id) VALUES (?, ?, ?, ?, ?)',
            [clientId, name, business_type, date_of_joining, developer_id || null]
        );
        
        await connection.query(
            'INSERT INTO client_login (client_id, email, password_hash) VALUES (?, ?, ?)',
            [clientId, email, hashedPassword]
        );
        
        await connection.commit();
        
        res.status(201).json({ 
            client_id: clientId,
            name,
            email,
            message: 'Client created with login credentials'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// PUT update client
router.put('/:id', async (req, res) => {
    const { name, business_type, date_of_joining, developer_id } = req.body;
    try {
        await pool.query(
            'UPDATE clients SET name = ?, business_type = ?, date_of_joining = ?, developer_id = ? WHERE client_id = ?',
            [name, business_type, date_of_joining, developer_id || null, req.params.id]
        );
        res.json({ client_id: req.params.id, name, business_type, date_of_joining, developer_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE client
router.delete('/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.query('DELETE FROM client_login WHERE client_id = ?', [req.params.id]);
        await connection.query('DELETE FROM inquiries WHERE client_id = ?', [req.params.id]);
        await connection.query('DELETE FROM clients WHERE client_id = ?', [req.params.id]);
        
        await connection.commit();
        res.status(204).send();
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

module.exports = router;