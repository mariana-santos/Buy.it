package br.com.fiap.buy.it.service;

import br.com.fiap.buy.it.dto.TipoContatoDTO;
import br.com.fiap.buy.it.model.TipoContato;
import br.com.fiap.buy.it.repository.TipoContatoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TipoContatoService {

    @Autowired
    private TipoContatoRepository tipoContatoRepository;

    public Page<TipoContatoDTO> listAll(Pageable pageRequest) {
        return tipoContatoRepository.findAll(pageRequest).map(this::convertToDto);
    }

    public TipoContatoDTO findById(Long id) {
        TipoContato entity = findEntityById(id);
        return convertToDto(entity);
    }

    public TipoContatoDTO create(TipoContatoDTO newData) {
        TipoContato entity = convertToEntity(newData);
        TipoContato savedEntity = tipoContatoRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public TipoContatoDTO update(Long id, TipoContatoDTO updatedData) {
        findEntityById(id);
        updatedData.setId(id);
        TipoContato updatedEntity = convertToEntity(updatedData);    
        TipoContato savedEntity = tipoContatoRepository.save(updatedEntity);
        return convertToDto(savedEntity);
    }
    

    public void delete(Long id) {
        TipoContato entity = findEntityById(id);
        tipoContatoRepository.delete(entity);
    }

    public TipoContato findEntityById(Long id) {
        return tipoContatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(" + getClass().getSimpleName() + ") - TipoContato não encontrado(a) por ID: " + id));
    }

    private TipoContatoDTO convertToDto(TipoContato entity) {
        TipoContatoDTO dto = new TipoContatoDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        return dto;
    }

    private TipoContato convertToEntity(TipoContatoDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - TipoContatoDTO não pode ser nulo.");
        }
        TipoContato entity;
        if (dto.getId() != null) {
            entity = findEntityById(dto.getId());
        } else {
            entity = new TipoContato();
        }
        entity.setNome(dto.getNome());
        return entity;
    }
}