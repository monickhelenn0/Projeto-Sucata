from flask import Flask
from routes.compras import compras_bp
from routes.saidas import saidas_bp
from routes.exclusoes import exclusoes_bp
from routes.notas import notas_bp
from database import init_db

app = Flask(__name__)

# Inicializar o banco de dados
init_db()

# Registrar Blueprints (rotas)
app.register_blueprint(compras_bp, url_prefix="/api/compras")
app.register_blueprint(saidas_bp, url_prefix="/api/saidas")
app.register_blueprint(exclusoes_bp, url_prefix="/api/exclusoes")
app.register_blueprint(notas_bp, url_prefix="/api/notas")

if __name__ == "__main__":
    app.run(debug=True)
