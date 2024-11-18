from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.config import SessionLocal
from database.models import Sucata

router = APIRouter()

# Dependência para o banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/sucatas")
def listar_sucatas(db: Session = Depends(get_db)):
    return db.query(Sucata).all()

@router.post("/sucatas")
def criar_sucata(nome: str, descricao: str, quantidade: int, db: Session = Depends(get_db)):
    nova_sucata = Sucata(nome=nome, descricao=descricao, quantidade=quantidade)
    db.add(nova_sucata)
    db.commit()
    db.refresh(nova_sucata)
    return nova_sucata
