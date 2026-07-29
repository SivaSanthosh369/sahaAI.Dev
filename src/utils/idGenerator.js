// utils/idGenerator.js
const pool = require('../config/db');

async function generateClientId() {
    const [rows] = await pool.query(
        'SELECT client_id FROM clients ORDER BY client_id DESC LIMIT 1'
    );
    
    let nextNumber = 1;
    if (rows.length > 0) {
        const lastId = rows[0].client_id;
        const numPart = parseInt(lastId.replace('SDC', ''));
        nextNumber = numPart + 1;
    }
    
    return `SDC${String(nextNumber).padStart(4, '0')}`;
}

module.exports = { generateClientId };