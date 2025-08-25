    
    
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

    -- Criação da tabela `notificacoes`
    CREATE TABLE notificacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        tipo ENUM('chamado', 'apontamento', 'status', 'sistema') NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        mensagem TEXT NOT NULL,
        dados_adicional JSON,
        lida BOOLEAN DEFAULT FALSE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    -- Criação da tabela `pool_tecnico`
    CREATE TABLE pool_tecnico (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_pool INT,
        id_tecnico INT,
        FOREIGN KEY (id_pool) REFERENCES pool(id),
        FOREIGN KEY (id_tecnico) REFERENCES usuarios(id)
    );

    -- Índices adicionais para otimização
    CREATE INDEX idx_usuarios_email ON usuarios(email);
    CREATE INDEX idx_chamados_status ON chamados(status);
    CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);
    CREATE INDEX idx_notificacoes_usuario_lida ON notificacoes(usuario_id, lida);
    CREATE INDEX idx_notificacoes_tipo ON notificacoes(tipo);

    -- Inserir dados de exemplo
    INSERT INTO usuarios (nome, senha, email, funcao, status) VALUES
    ('Admin Principal', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@senai.com', 'admin', 'ativo'),
    ('João Silva', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'joao@senai.com', 'tecnico', 'ativo'),
    ('Maria Santos', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'maria@senai.com', 'tecnico', 'ativo'),
    ('Pedro Alves', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pedro@senai.com', 'usuario_comum', 'ativo'),
    ('Ana Costa', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ana@senai.com', 'usuario_comum', 'ativo');

    -- Inserir pools de exemplo
    INSERT INTO pool (titulo, descricao, status, created_by, updated_by) VALUES
    ('externo', 'Problemas relacionados a equipamentos externos', 'ativo', 1, 1),
    ('manutencao', 'Reparos em equipamentos e infraestrutura', 'ativo', 1, 1),
    ('apoio_tecnico', 'Suporte técnico especializado', 'ativo', 1, 1),
    ('limpeza', 'Solicitações relacionadas à limpeza', 'ativo', 1, 1);

    -- Inserir chamados de exemplo
    INSERT INTO chamados (titulo, descricao, tipo_id, tecnico_id, usuario_id, status) VALUES
    ('Computador não liga', 'O PC do laboratório 3 não está ligando.', 2, 2, 4, 'pendente'),
    ('Cadeira quebrada', 'Cadeira da sala 204 está quebrada.', 2, 3, 5, 'em andamento'),
    ('Sala suja', 'Sala 105 precisa de limpeza urgente.', 4, 2, 4, 'pendente'),
    ('Projetor não funciona', 'Projetor da sala 301 não liga.', 2, 3, 5, 'concluido');

    -- Inserir apontamentos de exemplo
    INSERT INTO apontamentos (chamado_id, tecnico_id, descricao, comeco, fim) VALUES
    (2, 3, 'Iniciando análise da cadeira quebrada', NOW(), NULL),
    (4, 3, 'Projetor verificado e problema resolvido', NOW() - INTERVAL 2 HOUR, NOW());

    -- Inserir notificações de exemplo
    INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, dados_adicional, lida) VALUES
    (1, 'chamado', 'Novo chamado criado', 'Chamado #123 - Problema com impressora', '{"chamado_id": 123, "status": "pendente"}', FALSE),
    (2, 'chamado', 'Status alterado', 'Chamado #120 - Status alterado para em andamento', '{"chamado_id": 120, "status": "em andamento"}', FALSE),
    (3, 'chamado', 'Status alterado', 'Chamado #120 - Status alterado para em andamento', '{"chamado_id": 120, "status": "em andamento"}', FALSE),
    (1, 'apontamento', 'Novo apontamento', 'Técnico João Silva finalizou chamado #118', '{"apontamento_id": 1, "tecnico_id": 2}', FALSE),
    (4, 'status', 'Chamado atualizado', 'Seu chamado #125 foi iniciado pelo técnico', '{"chamado_id": 125, "status": "em andamento"}', FALSE),
    (5, 'status', 'Chamado concluído', 'Seu chamado #122 foi finalizado com sucesso', '{"chamado_id": 122, "status": "concluido"}', TRUE);