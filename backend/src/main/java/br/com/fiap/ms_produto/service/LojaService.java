package br.com.fiap.ms_produto.service;

import br.com.fiap.ms_produto.dto.LojaDTO;
import br.com.fiap.ms_produto.repositories.LojaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LojaService {

    @Autowired
    private LojaRepository repository;

    @Transactional(readOnly = true)
    public List<LojaDTO> findAll() {
        return repository.findAll().stream().map(LojaDTO::new).toList();
    }
}
