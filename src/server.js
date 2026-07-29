const app = require('./app');
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`sahaAI API running on http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
});