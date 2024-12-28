USE if0_37921675_sucata;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL
);

-- Tabela de materiais
CREATE TABLE materiais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela de estoque
CREATE TABLE estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    quantidade INT NOT NULL,
    data_adicionado DATETIME NOT NULL,
    FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE
);

-- Tabela de compras
CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    quantidade INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data DATETIME NOT NULL,
    FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE
);

-- Tabela de saídas
CREATE TABLE saidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funcionario VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    forma_pagamento ENUM('PIX', 'Espécie') NOT NULL,
    data DATETIME NOT NULL
);

-- Tabela de abates
CREATE TABLE abates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    quantidade INT NOT NULL,
    galpao_origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    usuario_logado VARCHAR(100) NOT NULL,
    data DATETIME NOT NULL,
    FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE
);

-- Tabela de exclusões
CREATE TABLE exclusoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('compras', 'saidas') NOT NULL,
    referencia INT NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    usuario_logado VARCHAR(100) NOT NULL,
    data DATETIME NOT NULL
);

-- Inserir usuários padrão
INSERT INTO usuarios (username, password, nome) VALUES
('Varzea', SHA2('varzea01', 256), 'Galpão Varzea'),
('PauAmarelo', SHA2('amarelo01', 256), 'Galpão Pau Amarelo');

-- Inserir materiais padrão
INSERT INTO materiais (nome) VALUES
('bloco'),
('cadeira_branca'),
('catemba'),
('chaparia'),
('chumbo'),
('cobre_descascado'),
('ferro_lataria'),
('ferro_pesado'),
('inox'),
('latinhas'),
('metal'),
('panela'),
('perfil'),
('plastico_misto'),
('pvc'),
('roda'),
('motor_pequeno'),
('motor_grande');
