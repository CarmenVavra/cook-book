package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.dtos.IngredientDTO;
import com.caryssa.book.cookbook.dtos.IngredientRequest;
import com.caryssa.book.cookbook.entities.Ingredient;
import com.caryssa.book.cookbook.exceptions.ResourceNotFoundException;
import com.caryssa.book.cookbook.repositories.IngredientRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class IngredientService {
    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public List<IngredientDTO> getAllIngredients() {
        List<IngredientDTO> result = new ArrayList<>();
        for (Ingredient ingredient : ingredientRepository.findAll()) {
            result.add(toDto(ingredient));
        }
        return result;
    }

    public IngredientDTO getIngredientById(Integer id) {
        return toDto(findByIdOrThrow(id));
    }

    public IngredientDTO createIngredient(IngredientRequest request) {
        Ingredient ingredient = new Ingredient();
        applyRequest(ingredient, request);
        return toDto(ingredientRepository.save(ingredient));
    }

    public IngredientDTO updateIngredient(Integer id, IngredientRequest request) {
        Ingredient ingredient = findByIdOrThrow(id);
        applyRequest(ingredient, request);
        return toDto(ingredientRepository.save(ingredient));
    }

    public void deleteIngredient(Integer id) {
        findByIdOrThrow(id);
        ingredientRepository.deleteById(id);
    }

    private Ingredient findByIdOrThrow(Integer id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zutat mit id " + id + " wurde nicht gefunden."));
    }

    private void applyRequest(Ingredient ingredient, IngredientRequest request) {
        ingredient.setName(request.getName());
    }

    private IngredientDTO toDto(Ingredient ingredient) {
        return new IngredientDTO(ingredient.getId(), ingredient.getName());
    }
}
