CREATE DATABASE IF NOT EXISTS gamehub;

USE gamehub;

CREATE TABLE IF NOT EXISTS jogos (

    id INT AUTO_INCREMENT PRIMARY KEY,

    thegamesdb_id INT NULL UNIQUE,

    nome VARCHAR(255) NOT NULL,

    genero VARCHAR(100) NOT NULL,

    ano INT NOT NULL,

    publisher VARCHAR(255) NOT NULL,

    desenvolvedora VARCHAR(255) NOT NULL,

    capa TEXT,

    avaliacao INT NOT NULL

);