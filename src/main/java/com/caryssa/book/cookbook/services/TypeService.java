package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.dtos.TypeDTO;
import com.caryssa.book.cookbook.dtos.TypeRequest;
import com.caryssa.book.cookbook.entities.Type;
import com.caryssa.book.cookbook.exceptions.ConflictException;
import com.caryssa.book.cookbook.exceptions.ResourceNotFoundException;
import com.caryssa.book.cookbook.repositories.TypeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TypeService {

    private final TypeRepository typeRepository;

    public TypeService(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    public List<TypeDTO> getAllTypes() {
        List<TypeDTO> result = new ArrayList<>();
        for (Type type : typeRepository.findAll()) {
            result.add(toDto(type));
        }
        return result;
    }

    public TypeDTO getTypeById(Integer id) {
        return toDto(findByIdOrThrow(id));
    }

    public TypeDTO createType(TypeRequest request) {
        assertNameAvailable(request.getName(), null);
        Type type = new Type();
        type.setName(request.getName());
        return toDto(typeRepository.save(type));
    }

    public TypeDTO updateType(Integer id, TypeRequest request) {
        Type type = findByIdOrThrow(id);
        assertNameAvailable(request.getName(), id);
        type.setName(request.getName());
        return toDto(typeRepository.save(type));
    }

    public void deleteType(Integer id) {
        findByIdOrThrow(id);
        typeRepository.deleteById(id);
    }

    private Type findByIdOrThrow(Integer id) {
        return typeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Typ mit id " + id + " wurde nicht gefunden."));
    }

    private void assertNameAvailable(String name, Integer ownId) {
        Optional<Type> existing = typeRepository.findByName(name);
        if (existing.isPresent() && (ownId == null || existing.get().getId() != ownId)) {
            throw new ConflictException("Ein Typ mit dem Namen '" + name + "' existiert bereits.");
        }
    }

    private TypeDTO toDto(Type type) {
        return new TypeDTO(type.getId(), type.getName());
    }
}
