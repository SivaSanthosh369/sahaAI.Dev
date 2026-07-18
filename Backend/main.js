const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 8000; // Standard backend port, you can change this

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['*'],
    allowedHeaders: ['*']
}));
app.use(express.json());

// Database configuration
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'sahaai_db',
    port: 3306
};

// Helper function to manage connections (similar to get_db_connection)
async function executeQuery(query) {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute(query);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        if (conn) await conn.end();
    }
}

// 1. API Endpoint for 'admins' table
app.get('/api/admins', async (req, res) => {
    try {
        const data = await executeQuery('SELECT * FROM admins');
        res.json(data);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

// 2. API Endpoint for 'category' table
app.get('/api/category', async (req, res) => {
    try {
        const data = await executeQuery('SELECT * FROM category');
        res.json(data);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

// 3. API Endpoint for 'clients' table
app.get('/api/clients', async (req, res) => {
    try {
        const data = await executeQuery('SELECT * FROM clients');
        res.json(data);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

// 4. API Endpoint for 'developers' table
app.get('/api/developers', async (req, res) => {
    try {
        const data = await executeQuery('SELECT * FROM developers');
        res.json(data);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`sahaAI Dev API Backend running on http://localhost:${PORT}`);
});