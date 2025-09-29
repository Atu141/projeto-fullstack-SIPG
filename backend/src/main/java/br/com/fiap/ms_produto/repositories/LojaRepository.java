package br.com.fiap.ms_produto.repositories;

import br.com.fiap.ms_produto.entities.Loja;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LojaRepository extends JpaRepository<Loja, Long> {
}
