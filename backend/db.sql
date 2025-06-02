CREATE DATABASE estacionamento;
USE estacionamento;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    placa VARCHAR(255),
    cor VARCHAR(255),
    modelo VARCHAR(255)
);

CREATE TABLE vagas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT,
    bloco VARCHAR(1),
    preferencial BOOLEAN,
    disponivel BOOLEAN DEFAULT TRUE
);

CREATE TABLE vagas_ocupadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vaga_id INT,
    user_id INT,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vaga_id) REFERENCES vagas(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- Inserir vagas do Bloco A
INSERT INTO vagas (numero, bloco, preferencial) VALUES
(1, 'A', 1),  -- Vaga 1, Bloco A, Preferencial
(2, 'A', 1),  -- Vaga 2, Bloco A, Preferencial
(3, 'A', 0),  -- Vaga 3, Bloco A
(4, 'A', 0),  -- Vaga 4, Bloco A
(5, 'A', 0),  -- Vaga 5, Bloco A
(6, 'A', 0),  -- Vaga 6, Bloco A
(7, 'A', 0),  -- Vaga 7, Bloco A
(8, 'A', 0),  -- Vaga 8, Bloco A
(9, 'A', 0),  -- Vaga 9, Bloco A

-- Inserir vagas do Bloco B
INSERT INTO vagas (numero, bloco, preferencial) VALUES
(1, 'B', 1),  -- Vaga 1, Bloco B, Preferencial
(2, 'B', 1),  -- Vaga 2, Bloco B, Preferencial
(3, 'B', 0),  -- Vaga 3, Bloco B
(4, 'B', 0),  -- Vaga 4, Bloco B
(5, 'B', 0),  -- Vaga 5, Bloco B
(6, 'B', 0),  -- Vaga 6, Bloco B
(7, 'B', 0),  -- Vaga 7, Bloco B
(8, 'B', 0),  -- Vaga 8, Bloco B
(9, 'B', 0),  -- Vaga 9, Bloco B