package com.caryssa.book.cookbook.controllers;

import com.caryssa.book.cookbook.dtos.UnitDTO;
import com.caryssa.book.cookbook.dtos.UnitRequest;
import com.caryssa.book.cookbook.services.UnitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UnitController {
    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping("/unit/all")
    public List<UnitDTO> getAllUnit() {
        return unitService.getAllUnits();
    }

    @GetMapping("/unit")
    public UnitDTO getUnitById(@RequestParam Integer id) {
        return unitService.getUnitById(id);
    }

    @PostMapping("/unit")
    @ResponseStatus(HttpStatus.CREATED)
    public UnitDTO createUnit(@Valid @RequestBody UnitRequest request) {
        return unitService.createUnit(request);
    }

    @PutMapping("/unit")
    public UnitDTO updateUnit(@RequestParam Integer id, @Valid @RequestBody UnitRequest request) {
        return unitService.updateUnit(id, request);
    }

    @DeleteMapping("/unit")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUnit(@RequestParam Integer id) {
        unitService.deleteUnit(id);
    }
}
