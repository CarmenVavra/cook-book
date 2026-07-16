package com.caryssa.book.cookbook.controllers;

import com.caryssa.book.cookbook.entities.Ingredient;
import com.caryssa.book.cookbook.services.IngredientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class IngredientController {
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("/ingredient/all")
    public ResponseEntity<Iterable<Ingredient>> getAllIngredient(){
        return ingredientService.getAllIngredients();
    }

    @GetMapping("/ingredient")
    public ResponseEntity<Ingredient> getIngredientById(@RequestParam Integer id){
        return ingredientService.getIngredientById(id);
    }

    @PostMapping("/ingredient")
    public ResponseEntity<Ingredient> createIngredient(@RequestBody Ingredient ingredient){
        return ingredientService.createIngredient(ingredient);
    }

    @PutMapping("/ingredient")
    public ResponseEntity<Ingredient> updateIngredient(@RequestBody Ingredient ingredient){
        return ingredientService.updateIngredient(ingredient);
    }

    @DeleteMapping("/ingredient")
    public ResponseEntity<Ingredient> deleteIngredient(@RequestParam Integer id){
        return ingredientService.deleteIngredient(id);
    }

}
