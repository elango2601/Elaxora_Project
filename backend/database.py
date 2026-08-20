from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        self.client = AsyncIOMotorClient(settings.MONGO_URI)
        self.db = self.client[settings.DATABASE_NAME]
        print(f"Connected to MongoDB database: {settings.DATABASE_NAME}")

    def close(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

def serialize_doc(doc) -> dict:
    if not doc:
        return {}
    new_doc = {}
    for k, v in doc.items():
        if k == "_id":
            new_doc["id"] = str(v)
        else:
            new_doc[k] = v
    return new_doc

def serialize_docs(docs) -> list:
    return [serialize_doc(doc) for doc in docs]

db = Database()

