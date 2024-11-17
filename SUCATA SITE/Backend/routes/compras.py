from flask import Blueprint, request, jsonify
from database.models import get_collection

compras_bp = Blueprint("compras", __name__)
compras_collection = get_collection("compras")

@compras_bp.route("/", methods=["GET"])
def listar_compras():
    compras = list(compras_collection.find())
    for compra in compras:
        compra["_id"] = str(compra["_id"])
    return jsonify(compras)

@compras_bp.route("/", methods=["POST"])
def criar_compra():
    dados = request.json
    compras_collection.insert_one(dados)
    return jsonify({"message": "Compra criada com sucesso!"}), 201
