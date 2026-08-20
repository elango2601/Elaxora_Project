from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from database import db
from routes import auth, projects, enquiries, quotes, orders, referrals, analytics, student_auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB database on startup
    db.connect()
    yield
    # Close database connection on shutdown
    db.close()

app = FastAPI(
    title="Elaxora Solutions API Server",
    description="FastAPI Backend for Elaxora Solutions platform.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS settings to connect Next.js and FastAPI locally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(enquiries.router, prefix="/api")
app.include_router(quotes.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(referrals.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(student_auth.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Elaxora Solutions REST API",
        "version": "1.0.0"
    }
