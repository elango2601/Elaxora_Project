from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8000
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "elaxorasolutions"
    JWT_SECRET: str = "supersecretkeyforelaxorasolutionsadminlogin"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ADMIN_EMAIL: str = "admin@elaxorasolutions.com"
    ADMIN_PASSWORD: str = "ForgeAdmin2026!"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
