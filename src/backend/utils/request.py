import mysql.connector
from mysql.connector import Error
from os import environ as env
from flask import jsonify
from crypto.library.hash import _calculate_sha256

def get_users():
    connection = None
    cursor = None
    
    try:
        # 1. Établir la connexion
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )

        if connection.is_connected():
            print("Connexion réussie à MySQL")

            # 2. Créer un curseur (c'est l'objet qui exécute les ordres)
            cursor = connection.cursor(dictionary=True) # dictionary=True pour avoir des résultats {colonne: valeur}

            # 3. Écrire la requête SQL
            query = "SELECT * FROM user"
            
            # 4. Exécuter la requête
            cursor.execute(query)

            # 5. Récupérer les résultats
            records = cursor.fetchall() # ou fetchone() pour un seul résultat

            print(f"Nombre d'utilisateurs trouvés : {cursor.rowcount}")
            
            for row in records:
                print(f"User: {row['name']} - Email: {row['email']}")

    except Error as e:
        print(f"Erreur lors de la connexion : {e}")

    finally:
        # 6. Toujours fermer la connexion (Même s'il y a une erreur)
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connexion MySQL fermée")

def create_user(email, name, password):
    connection = None
    cursor = None
    
    try:
        # 1. Établir la connexion
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )

        if connection.is_connected():
            print("Connexion réussie à MySQL")

            # 2. Créer un curseur
            cursor = connection.cursor()

            # 3. Écrire la requête SQL
            query = "INSERT INTO user (email, name, password) VALUES (%s, %s, %s)"
            values = (email, name, password) #_calculate_sha256(password.encode('utf-8')))
            
            # 4. Exécuter la requête
            cursor.execute(query, values)

            # 5. Valider les changements
            connection.commit()

            return f"Utilisateur {name} créé avec succès."

    except Error as e:
        return "Erreur lors de la connexion : {e}"

    finally:
        # 6. Toujours fermer la connexion
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connexion MySQL fermée")

def delete_user(email):
    connection = None
    cursor = None
    
    try:
        # 1. Établir la connexion
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )

        if connection.is_connected():
            print("Connexion réussie à MySQL")

            # 2. Créer un curseur
            cursor = connection.cursor()

            # 3. Écrire la requête SQL
            query = "DELETE FROM user WHERE email = %s"
            values = (email,)
            
            # 4. Exécuter la requête
            cursor.execute(query, values)

            # 5. Valider les changements
            connection.commit()

            return f"Utilisateur avec ID {email} supprimé avec succès."

    except Error as e:
        return f"Erreur lors de la connexion : {e}"

    finally:
        # 6. Toujours fermer la connexion
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connexion MySQL fermée")

def get_password(email):
    connection = None
    cursor = None

    try:
        # 1. Établir la connexion
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )

        if connection.is_connected():
            print("Connexion réussie à MySQL")

            # 2. Créer un curseur
            cursor = connection.cursor(dictionary=True)

            # 3. Écrire la requête SQL
            query = "SELECT password FROM user WHERE email = %s"
            values = (email,)

            # 4. Exécuter la requête
            cursor.execute(query, values)

            # 5. Récupérer le mot de passe
            result = cursor.fetchone()

            if result:
                return result['password']
            else:
                print(f"Aucun utilisateur trouvé avec l'email {email}")
                return None

    except Error as e:
        print(f"Erreur lors de la connexion : {e}")

    finally:
        # 6. Toujours fermer la connexion
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
    get_users()

def create_event(email, title, description, date):
    connection = None
    cursor = None

    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )

        if connection.is_connected():
            print("Connexion réussie à MySQL")
            cursor = connection.cursor()

            # --- PARTIE 1 : Insérer l'événement ---
            query = "INSERT INTO event (title, description, date) VALUES (%s, %s, %s)"
            values = (title, description, date)
            
            cursor.execute(query, values)

            # --- MAGIE ICI : Récupérer l'ID généré ---
            new_event_id = cursor.lastrowid
            print(f"L'ID généré pour cet événement est : {new_event_id}")
            
            # --- PARTIE 2 : Lier à l'utilisateur ---
            query2 = "INSERT INTO SportiveEvents (email_user, id_event) VALUES (%s, %s)"
            values2 = (email, new_event_id)

            cursor.execute(query2, values2)

            # --- VALIDATION ---
            connection.commit()
            print("Tout a été enregistré avec succès !")
            return jsonify({'id': new_event_id})

    except Error as e:
        if connection:
            connection.rollback()
        return jsonify({"error": f"Erreur lors de l'opération : {e}"}, 500)

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def get_events(email):
    connection = None
    cursor = None

    try:
        # 1. Établir la connexion
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )

        if connection.is_connected():
            print("Connexion réussie à MySQL")

            # 2. Créer un curseur
            cursor = connection.cursor(dictionary=True)

            # 3. Écrire la requête SQL
            query = "SELECT event.* FROM event JOIN SportiveEvents ON event.id = SportiveEvents.id_event WHERE SportiveEvents.email_user = %s"
            values = (email,)

            # 4. Exécuter la requête
            cursor.execute(query, values)

            # 5. Récupérer les résultats
            events = cursor.fetchall()
            print(f"Événements récupérés de la base de données : {events}")

            formatted_events = []
            for event in events:
                formatted_events.append({
                    "id": event['id'],
                    "title": event['title'],
                    "description": event['description'],
                    "date": str(event['date'])
                })
            print(f"Événements pour {email} : {formatted_events}")
            return jsonify(formatted_events)

    except Error as e:
        return jsonify({"error": f"Erreur lors de la connexion : {e}"}, 500)

    finally:
        # 6. Toujours fermer la connexion
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
    
    return jsonify([])

def delete_event(email, id_event):
    connection = None
    cursor = None
    
    try:
        # 1. Établir la connexion
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )

        if connection.is_connected():
            print("Connexion réussie à MySQL")

            # 2. Créer un curseur
            cursor = connection.cursor()

            # 3. Écrire les requêtes SQL (dans le bon ordre)
            
            # D'abord, on supprime la liaison dans la table SportiveEvents
            query_sportive_events = "DELETE FROM SportiveEvents WHERE email_user = %s AND id_event = %s"
            values_sportive_events = (email, id_event)
            
            # Ensuite, on supprime l'événement lui-même de la table event
            query_event = "DELETE FROM event WHERE id = %s"
            values_event = (id_event,)

            # 4. Exécuter les requêtes
            cursor.execute(query_sportive_events, values_sportive_events)
            cursor.execute(query_event, values_event)
            
            # 5. Valider les changements
            connection.commit()

            print(f"Événement avec ID {id_event} pour l'utilisateur {email} supprimé avec succès.")
            return f"Événement avec ID {id_event} pour l'utilisateur {email} supprimé avec succès."

    except Error as e:
        if connection:
            connection.rollback()
        return f"Erreur lors de la suppression : {e}"

    finally:
        # 6. Toujours fermer la connexion
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connexion MySQL fermée")    

def get_user(email):
    connection = None
    cursor = None
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            query = "SELECT name, email FROM user WHERE email = %s"
            cursor.execute(query, (email,))
            return cursor.fetchone()
    except Error as e:
        print(f"Erreur: {e}")
        return None
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def update_user(current_email, updates):
    if not updates:
        return "Aucune modification détectée."
    
    connection = None
    cursor = None
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='db',
            user='root',
            password=env.get('DB_PASSWORD', 'root'),
            port=3306
        )
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Construction dynamique de la requête SET
            set_clause = ", ".join([f"{k} = %s" for k in updates.keys()])
            values = list(updates.values())
            values.append(current_email) # Pour le WHERE email = %s
            
            query = f"UPDATE user SET {set_clause} WHERE email = %s"
            cursor.execute(query, tuple(values))
            
            connection.commit()
            return "Profil mis à jour avec succès."
    except Error as e:
        print(f"Erreur lors de la mise à jour : {e}")
        return f"Erreur lors de la mise à jour : {e}"
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connexion MySQL fermée")


# if __name__ == "__main__":
    # Exemple d'utilisation
# create_user('aasaqsa@gmail.com', 'ihadi', '1234')
    # get_users()
    # get_password('aasaqsa@gmail.com')
    # delete_user('aasaqsa@gmail.com')
    # delete_event('ihadife@hotmail.com', 2)  # Exemple d'appel à delete_event
# create_event('ihadife@hotmail.com', 'Test Event', 'Description of the test event', '2025-10-15')
