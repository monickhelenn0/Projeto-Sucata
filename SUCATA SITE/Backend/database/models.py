from pymongo import MongoClient
from bson.objectid import ObjectId
import os

# Configuração da conexão com MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/luciene_sucatas")
client = MongoClient(MONGO_URI)
db = client.luciene_sucatas

# Modelos
def get_collection(collection_name):
    return db[collection_name]
