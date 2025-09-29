CREATE TABLE IF NOT EXISTS tb_produto (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255),
    descricao VARCHAR(255),
    valor FLOAT(53),
    categoria_id BIGINT NOT NULL,
    CONSTRAINT pk_tb_produto PRIMARY KEY (id),
    CONSTRAINT fk_tb_produto_tb_cdategoria FOREIGN KEY (categoria_id) REFERENCES tb_categoria(id)
) ENGINE=InnoDB;
