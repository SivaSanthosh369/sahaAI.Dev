from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pymysql

app = FastAPI(title="sahaAI Dev API Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection details
def get_db_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",              
        password="root",   
        database="sahaai_db",      
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )

# 1. API Endpoint for 'admins' table
@app.get("/api/admins")
def get_admins():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM admins")
            return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# 2. API Endpoint for 'category' table
@app.get("/api/category")
def get_category():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM category")
            return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# 3. API Endpoint for 'clients' table
@app.get("/api/clients")
def get_clients():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM clients")
            return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# 4. API Endpoint for 'developers' table
@app.get("/api/developers")
def get_developers():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM developers")
            return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()