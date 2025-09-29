CREATE TABLE IF NOT EXISTS tb_produto_loja (
    produto_id BIGINT NOT NULL,
    loja_id BIGINT NOT NULL,
    CONSTRAINT pk_tb_produto_loja PRIMARY KEY (produto_id, loja_id),
    CONSTRAINT fk_tb_produto_loja_tb_produto FOREIGN KEY (produto_id) REFERENCES tb_produto (id),
    CONSTRAINT fk_tb_produto_loja_tb_loja FOREIGN KEY(loja_id) REFERENCES tb_loja (id)
) engine=InnoDB;