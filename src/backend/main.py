import flask
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from utils.request import create_user, get_password, get_events, create_event, delete_event as delete_event_from_db

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    if not all([firstName, lastName, email, password]):
        return jsonify({"message": "All fields are required"}), 400

    # Save the user to the database
    result = create_user(email, f"{firstName} {lastName}", password)
    
    # It's good practice to check the result from the create_user function
    if "success" in result.lower():
        return jsonify({"message": "User registered successfully"}), 201
    else:
        # Assuming create_user returns an error message string
        return jsonify({"message": result}), 500

@app.route('/create_account', methods=['POST']) # <-- Notez le POST
def create_account_route():
    # On récupère les données envoyées dans le corps (body)
    data = request.get_json() 
    
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    # Ici, appel à votre fonction qui HACHE le mot de passe (vu précédemment)
    # result = create_user(email, name, password)
    result = create_user(email, name, password)
    return jsonify({"message": f"{result}"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    stored_password = get_password(email)

    if stored_password and stored_password == password:
        # In a real application, you would return a JWT token here.
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/get_password/<email>', methods=['GET'])
def get_password_route(email):
    return get_password(email)

@app.route('/events', methods=['GET'])
def get_events_route():
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email is required"}), 400
    return get_events(email)

@app.route('/events', methods=['POST'])
def add_event():
    data = request.json
    # React envoie { title, description, date }
    return create_event(
        data.get('email'),
        data.get('title'),
        data.get('description'),
        data.get('date')
    )

@app.route('/events/<int:id_event>', methods=['DELETE'])
def delete_event_route(id_event):
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email is required"}), 400
    
    result = delete_event_from_db(email, id_event)

    # Assuming delete_event_from_db returns a string that includes "succès" on success
    if "succès" in result:
        return jsonify({"message": result}), 200
    else:
        return jsonify({"message": result}), 500
   
if __name__ == '__main__':
    app.run(debug=True, port=5000)