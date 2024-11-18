from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

# Configuração inicial
app = Flask(__name__)

# Configuração do banco de dados (substitua pela sua string de conexão do Render)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:blNKCLQozUrdPggJvN939Q5GmyJTVLOw@dpg-cstnc0tumphs73frgosg-a/sucata_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar banco de dados
db = SQLAlchemy(app)

# Modelo de exemplo (opcional)
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

# Rotas
@app.route('/')
def home():
    return jsonify({"message": "API funcionando!"})

@app.route('/items')
def get_items():
    items = Item.query.all()
    return jsonify([{"id": item.id, "name": item.name} for item in items])

# Inicializar o banco (somente na primeira execução)
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
