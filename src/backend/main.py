import flask
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from utils.request import create_user, get_password

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    # password = data.get('password') # Password will be used later

    # For now, just print the data
    print(f"Received registration data: {firstName}, {lastName}, {email}")

    # You would typically save the user to a database here
    # from utils.request import create_user
    # result = create_user(email, f"{firstName} {lastName}", password)
    
    return jsonify({"message": "User registered successfully"}), 201

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

@app.route('/get_password/<email>', methods=['GET'])
def get_password_route(email):
    return get_password(email)


if __name__ == '__main__':
    app.run(debug=True, port=5000)