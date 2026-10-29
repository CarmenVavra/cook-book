package com.caryssa.book.cookbook.controllers;

import com.caryssa.book.cookbook.dtos.TypeDTO;
import com.caryssa.book.cookbook.dtos.TypeRequest;
import com.caryssa.book.cookbook.services.TypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TypeController {
    private final TypeService typeService;

    public TypeController(TypeService typeService) {
        this.typeService = typeService;
    }

    @GetMapping("/type/all")
    public List<TypeDTO> getAllType() {
        return typeService.getAllTypes();
    }

    @GetMapping("/type")
    public TypeDTO getTypeById(@RequestParam Integer id) {
        return typeService.getTypeById(id);
    }

    @PostMapping("/type")
    @ResponseStatus(HttpStatus.CREATED)
    public TypeDTO createType(@Valid @RequestBody TypeRequest request) {
        return typeService.createType(request);
    }

    @PutMapping("/type")
    public TypeDTO updateType(@RequestParam Integer id, @Valid @RequestBody TypeRequest request) {
        return typeService.updateType(id, request);
    }

    @DeleteMapping("/type")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteType(@RequestParam Integer id) {
        typeService.deleteType(id);
    }
}
