-- 1. On supprime la base existante pour effacer les erreurs passées
DROP DATABASE IF EXISTS db;

-- 2. On recrée la base
CREATE DATABASE db;
USE db;

-- 3. Table USER
CREATE TABLE user(
    email VARCHAR(100) PRIMARY KEY, -- J'ai mis 100 car 30 est trop court pour certains emails
    name VARCHAR(100),
    password VARCHAR(255) -- 255 est recommandé pour les hash bcrypt
);

-- 4. Table EVENT
CREATE TABLE event(
    id INT AUTO_INCREMENT PRIMARY KEY, -- C'est ça qui corrige l'erreur 1364 !
    title VARCHAR(100), -- Renommé 'title' pour matcher votre Python
    description TEXT,   -- TEXT est mieux que varchar(255) pour des descriptions longues
    date DATETIME
);

-- 5. Table DE LIAISON
CREATE TABLE SportiveEvents(
    email_user VARCHAR(100),
    id_event INT, -- CORRIGÉ : Doit être INT (pas DOUBLE) pour matcher event.id
    
    CONSTRAINT fk_user 
        FOREIGN KEY (email_user) 
        REFERENCES user(email)
        ON DELETE CASCADE, -- Si on supprime un user, ça supprime ses inscriptions
        
    CONSTRAINT fk_event 
        FOREIGN KEY (id_event) 
        REFERENCES event(id)
        ON DELETE CASCADE, -- Si on supprime un event, ça supprime les inscriptions
        
    PRIMARY KEY (email_user, id_event)
);