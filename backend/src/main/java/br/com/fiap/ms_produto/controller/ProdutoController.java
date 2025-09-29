package br.com.fiap.ms_produto.controller;

import br.com.fiap.ms_produto.dto.ProdutoDTO;
import br.com.fiap.ms_produto.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService service;

    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> findAll() {

        List<ProdutoDTO> dto = service.findAll();
        return ResponseEntity.ok(dto);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> findById(@PathVariable Long id) {

        ProdutoDTO dto = service.findById(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<ProdutoDTO> insert(@Valid @RequestBody ProdutoDTO dto) {

        dto = service.insert(dto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody ProdutoDTO dto) {

        dto = service.update(id, dto);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}






