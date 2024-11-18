from flask import request

@app.route('/items', methods=['POST'])
def create_item():
    data = request.get_json()  # Recebe os dados enviados no corpo da requisição
    if not data or not 'name' in data:
        return jsonify({"error": "Nome do item é obrigatório"}), 400
    
    new_item = Item(name=data['name'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"id": new_item.id, "name": new_item.name}), 201
