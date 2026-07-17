package com.caryssa.book.cookbook.controllers;

import com.caryssa.book.cookbook.dtos.IngredientDTO;
import com.caryssa.book.cookbook.dtos.IngredientRequest;
import com.caryssa.book.cookbook.services.IngredientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class IngredientController {
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("/ingredient/all")
    public List<IngredientDTO> getAllIngredient() {
        return ingredientService.getAllIngredients();
    }

    @GetMapping("/ingredient")
    public IngredientDTO getIngredientById(@RequestParam Integer id) {
        return ingredientService.getIngredientById(id);
    }

    @PostMapping("/ingredient")
    @ResponseStatus(HttpStatus.CREATED)
    public IngredientDTO createIngredient(@Valid @RequestBody IngredientRequest request) {
        return ingredientService.createIngredient(request);
    }

    @PutMapping("/ingredient")
    public IngredientDTO updateIngredient(@RequestParam Integer id, @Valid @RequestBody IngredientRequest request) {
        return ingredientService.updateIngredient(id, request);
    }

    @DeleteMapping("/ingredient")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIngredient(@RequestParam Integer id) {
        ingredientService.deleteIngredient(id);
    }
}
