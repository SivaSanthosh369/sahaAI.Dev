# sahaAI.Dev

A simple frontend and FastAPI backend project.

## Features
- Frontend pages in HTML, CSS, and JavaScript
- FastAPI backend with MySQL integration

## Run locally
1. Start the backend:
   ```bash
   uvicorn Backend.main:app --reload
   ```
2. Open the frontend in your browser:
   ```bash
   index.html
   ```

## Database
A MySQL dump is included as `sahaai_db.sql`.
Import it with:

```bash
mysql -u root -p < sahaai_db.sql
```
