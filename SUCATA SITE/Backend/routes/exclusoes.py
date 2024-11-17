from flask import Blueprint, request, jsonify
from database.models import get_collection

exclusoes_bp = Blueprint("exclusoes", __name__)
exclusoes_collection = get_collection("exclusoes")

@exclusoes_bp.route("/", methods=["GET"])
def listar_exclusoes():
    exclusoes = list(exclusoes_collection.find())
    for exclusao in exclusoes:
        exclusao["_id"] = str(exclusao["_id"])
    return jsonify(exclusoes)
