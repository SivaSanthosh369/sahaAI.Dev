const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const app = express();

// Security headers with Helmet
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    "https://cdn.tailwindcss.com"
                ],
                scriptSrcAttr: ["'self'", "'unsafe-inline'"],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com"
                ],
                styleSrcAttr: ["'self'", "'unsafe-inline'"],
                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com",
                    "data:"
                ],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: [
                    "'self'",
                    "https:",
                    "http://localhost:*",
                    "ws://localhost:*"
                ]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);

app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'sahaai-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // set true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static views (HTML files) and root assets (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '..', 'views')));
app.use(express.static(path.join(__dirname, '..')));

app.use('/api/clients', require('./routes/clients'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/auth', require('./routes/auth'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = app;