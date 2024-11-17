from flask import Blueprint, request, jsonify
from database.models import get_collection

notas_bp = Blueprint("notas", __name__)
notas_collection = get_collection("notas")

@notas_bp.route("/", methods=["GET"])
def listar_notas():
    notas = list(notas_collection.find())
    for nota in notas:
        nota["_id"] = str(nota["_id"])
    return jsonify(notas)

@notas_bp.route("/", methods=["POST"])
def criar_nota():
    dados = request.json
    notas_collection.insert_one(dados)
    return jsonify({"message": "Nota cadastrada com sucesso!"}), 201
