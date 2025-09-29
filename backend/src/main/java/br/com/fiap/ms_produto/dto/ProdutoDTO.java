package br.com.fiap.ms_produto.dto;

import br.com.fiap.ms_produto.entities.Loja;
import br.com.fiap.ms_produto.entities.Produto;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter

public class ProdutoDTO {

    private Long id;

    @NotBlank(message = "Nome requerido!")
    @Size(min = 3, max = 100, message = "O nome deve ter de 3 a 100 caracteres")
    private String nome;

    @NotBlank(message = "Descrição requerida!")
    @Size(min = 10, message = "A descrição deve ter no mínimo 10 caracteres")
    private String descricao;

    @NotNull(message = "Valor requerido")
    @Positive(message = "O preço deve ser um valor positivo maior que zero")
    private Double valor;

    @NotNull(message = "Categoria requerido")
    private CategoriaDTO categoria;

    //    @NotEmpty(message = "Loja requerido")
    private Set<LojaDTO> lojas = new HashSet<>();

    public ProdutoDTO(Produto entity) {
        id = entity.getId();
        nome = entity.getNome();
        descricao = entity.getDescricao();
        valor = entity.getValor();

        categoria = new CategoriaDTO(entity.getCategoria());

        for(Loja loja : entity.getLojas()){
            LojaDTO lojaDTO = new LojaDTO(loja);
            lojas.add(lojaDTO);
        }
    }
}
