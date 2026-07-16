package com.caryssa.book.cookbook.controllers;

import com.caryssa.book.cookbook.dtos.RecipeDetailDTO;
import com.caryssa.book.cookbook.dtos.RecipeRequest;
import com.caryssa.book.cookbook.dtos.RecipeSummaryDTO;
import com.caryssa.book.cookbook.services.RecipeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/recipe/all")
    public List<RecipeSummaryDTO> getAllRecipe(
            @RequestParam(required = false) Integer typeId,
            @RequestParam(required = false) Integer categoryId) {
        return recipeService.getAllRecipes(typeId, categoryId);
    }

    @GetMapping("/recipe")
    public RecipeDetailDTO getRecipeById(@RequestParam Integer id) {
        return recipeService.getRecipeById(id);
    }

    @PostMapping("/recipe")
    @ResponseStatus(HttpStatus.CREATED)
    public RecipeDetailDTO createRecipe(@Valid @RequestBody RecipeRequest request) {
        return recipeService.createRecipe(request);
    }

    @PutMapping("/recipe")
    public RecipeDetailDTO updateRecipe(@RequestParam Integer id, @Valid @RequestBody RecipeRequest request) {
        return recipeService.updateRecipe(id, request);
    }

    @DeleteMapping("/recipe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecipe(@RequestParam Integer id) {
        recipeService.deleteRecipe(id);
    }
}
