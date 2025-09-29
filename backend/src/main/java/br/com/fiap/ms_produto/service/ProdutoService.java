package br.com.fiap.ms_produto.service;

import br.com.fiap.ms_produto.dto.LojaDTO;
import br.com.fiap.ms_produto.dto.ProdutoDTO;
import br.com.fiap.ms_produto.entities.Categoria;
import br.com.fiap.ms_produto.entities.Loja;
import br.com.fiap.ms_produto.entities.Produto;
import br.com.fiap.ms_produto.repositories.CategoriaRepository;
import br.com.fiap.ms_produto.repositories.LojaRepository;
import br.com.fiap.ms_produto.repositories.ProdutoRepository;
import br.com.fiap.ms_produto.service.exceptions.DatabaseException;
import br.com.fiap.ms_produto.service.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private LojaRepository lojaRepository;

    @Transactional(readOnly = true)
    public List<ProdutoDTO> findAll() {
        List<Produto> list = repository.findAll();
        return list.stream().map(ProdutoDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public ProdutoDTO findById(Long id) {

        Produto entity = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Recurso não encontrado. Id: " + id)
        );
        return new ProdutoDTO(entity);
    }

    @Transactional
    public ProdutoDTO insert(ProdutoDTO dto) {

        try {
            Produto entity = new Produto();
            // metodo auxiliar para converter DTO para Entity
            toEntity(dto, entity);
            entity = repository.save(entity);
            return new ProdutoDTO(entity);
        } catch (DataIntegrityViolationException ex) {
            throw new DatabaseException("Violação de integridade referencial - Categoria ID: "
                    + dto.getCategoria().getId());
        }
    }

    @Transactional
    public ProdutoDTO update(Long id, ProdutoDTO dto){

        try{
            Produto entity = repository.getReferenceById(id);
            toEntity(dto, entity);
            entity = repository.save(entity);
            return new ProdutoDTO(entity);
        } catch (EntityNotFoundException ex){
            throw new ResourceNotFoundException("Recurso não encontrado. Id: " + id);
        }
    }

    @Transactional
    public void delete(Long id){

        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Recurso não encontrado. Id: " + id);
        }
        repository.deleteById(id);
    }

    private void toEntity(ProdutoDTO dto, Produto entity) {
        entity.setNome(dto.getNome());
        entity.setDescricao(dto.getDescricao());
        entity.setValor(dto.getValor());

        // Objeto completo gerenciado
        Categoria categoria = categoriaRepository.getReferenceById(dto.getCategoria().getId());
        entity.setCategoria(categoria);

        entity.getLojas().clear();

        for(LojaDTO lojaDTO : dto.getLojas()){
            Loja loja = lojaRepository.getReferenceById(lojaDTO.getId());
            entity.getLojas().add(loja);
        }

    }

}
