package com.caryssa.book.cookbook.controllers;

import com.caryssa.book.cookbook.entities.Unit;
import com.caryssa.book.cookbook.services.UnitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping("/unit/all")
    public ResponseEntity<Iterable<Unit>> getAllUnit(){
        return unitService.getAllUnits();
    }

    @GetMapping("/unit")
    public ResponseEntity<Unit> getUnitById(@RequestParam Integer id){
        return unitService.getUnitById(id);
    }

    @PostMapping("/unit")
    public ResponseEntity<Unit> createUnit(@RequestBody Unit unit){
        return unitService.createUnit(unit);
    }

    @PutMapping("/unit")
    public ResponseEntity<Unit> updateUnit(@RequestBody Unit unit){
        return unitService.updateUnit(unit);
    }

    @DeleteMapping("/unit")
    public ResponseEntity<Unit> deleteUnit(@RequestParam Integer id){
        return unitService.deleteUnit(id);
    }
}
