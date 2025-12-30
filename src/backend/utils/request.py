import mysql.connector
from mysql.connector import Error
from os import environ as env

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
            values = (email, name, password)
            
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
                print(f"Mot de passe pour {email} : {result['password']}")
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

if __name__ == "__main__":
    # Exemple d'utilisation
    create_user('aasaqsa@gmail.com', 'ihadi', '1234')
    get_users()
    get_password('aasaqsa@gmail.com')
    delete_user('aasaqsa@gmail.com')