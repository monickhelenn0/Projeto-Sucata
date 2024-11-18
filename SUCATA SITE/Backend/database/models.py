from Backend.app import db

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    
from sqlalchemy import Column, Integer, String
from database.config import Base

class Sucata(Base):
    __tablename__ = "sucatas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    descricao = Column(String)
    quantidade = Column(Integer)
