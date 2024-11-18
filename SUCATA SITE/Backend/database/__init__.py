from database.config import Base, engine
from database.models import Sucata

# Criação das tabelas no banco
def init_db():
    Base.metadata.create_all(bind=engine)
