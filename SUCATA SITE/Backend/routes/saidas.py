from flask import Blueprint, request, jsonify
from database.models import get_collection

saidas_bp = Blueprint("saidas", __name__)
saidas_collection = get_collection("saidas")

@saidas_bp.route("/", methods=["GET"])
def listar_saidas():
    saidas = list(saidas_collection.find())
    for saida in saidas:
        saida["_id"] = str(saida["_id"])
    return jsonify(saidas)

@saidas_bp.route("/", methods=["POST"])
def criar_saida():
    dados = request.json
    saidas_collection.insert_one(dados)
    return jsonify({"message": "Saída criada com sucesso!"}), 201
