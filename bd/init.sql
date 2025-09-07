    create database zelo;
    
    use zelo;
    
    -- Criação da tabela `usuarios`
    CREATE TABLE usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        funcao VARCHAR(100) NOT NULL,
        status ENUM('ativo', 'inativo') DEFAULT 'ativo',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- Criação da tabela `pool`
    CREATE TABLE pool (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza') NOT NULL,
        descricao TEXT,
        status ENUM('ativo', 'inativo') DEFAULT 'ativo',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        updated_by INT,
        FOREIGN KEY (created_by) REFERENCES usuarios(id),
        FOREIGN KEY (updated_by) REFERENCES usuarios(id)
    );

    -- Criação da tabela `chamados`
    CREATE TABLE chamados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        tipo_id INT,
        tecnico_id INT,
        usuario_id INT,
        status ENUM('pendente', 'em andamento', 'concluido', 'cancelado') DEFAULT 'pendente',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tipo_id) REFERENCES pool(id),
        FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    -- Criação da tabela `apontamentos`
    CREATE TABLE apontamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chamado_id INT,
        tecnico_id INT,
        descricao TEXT,
        comeco TIMESTAMP NOT NULL,
        fim TIMESTAMP  NULL,
        duracao INT AS (TIMESTAMPDIFF(SECOND, comeco, fim)) STORED, -- Calcula a duração em segundos
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chamado_id) REFERENCES chamados(id),
        FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
    );

    -- Criação da tabela `pool_tecnico`
    CREATE TABLE pool_tecnico (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_pool INT,
        id_tecnico INT,
        FOREIGN KEY (id_pool) REFERENCES pool(id),
        FOREIGN KEY (id_tecnico) REFERENCES usuarios(id)
    );
    
    -- Criação da tabela `chat_messages` para o chat
    CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES usuarios(id) ON DELETE CASCADE
);



-- Tabela para agrupar mensagens entre dois usuários
CREATE TABLE support_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_conversation (user1_id, user2_id),
    FOREIGN KEY (user1_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela para armazenar as mensagens de suporte
CREATE TABLE support_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conversation_id) REFERENCES support_conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


    -- Índices adicionais para otimização
    CREATE INDEX idx_usuarios_email ON usuarios(email);
    CREATE INDEX idx_chamados_status ON chamados(status);
    CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);
	CREATE INDEX idx_chat_chamado_id ON chat_messages(chamado_id);
    CREATE INDEX idx_support_messages_conversation ON support_messages(conversation_id);
CREATE INDEX idx_support_messages_sender ON support_messages(sender_id);

    -- Inserir dados de exemplo
    INSERT INTO usuarios (nome, senha, email, funcao, status) VALUES
    ('Admin Principal', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@senai.com', 'admin', 'ativo');

    -- Inserir pools de exemplo
    INSERT INTO pool (titulo, descricao, status, created_by, updated_by) VALUES
    ('externo', 'Problemas relacionados a equipamentos externos', 'ativo', 1, 1),
    ('manutencao', 'Reparos em equipamentos e infraestrutura', 'ativo', 1, 1),
    ('apoio_tecnico', 'Suporte técnico especializado', 'ativo', 1, 1),
    ('limpeza', 'Solicitações relacionadas à limpeza', 'ativo', 1, 1);



   