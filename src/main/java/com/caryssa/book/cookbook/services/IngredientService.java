package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.dtos.IngredientDTO;
import com.caryssa.book.cookbook.dtos.IngredientRequest;
import com.caryssa.book.cookbook.entities.Ingredient;
import com.caryssa.book.cookbook.entities.Unit;
import com.caryssa.book.cookbook.exceptions.BadRequestException;
import com.caryssa.book.cookbook.exceptions.ResourceNotFoundException;
import com.caryssa.book.cookbook.repositories.IngredientRepository;
import com.caryssa.book.cookbook.repositories.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final UnitRepository unitRepository;

    public IngredientService(IngredientRepository ingredientRepository, UnitRepository unitRepository) {
        this.ingredientRepository = ingredientRepository;
        this.unitRepository = unitRepository;
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

        if (request.getUnitId() != null) {
            Unit unit = unitRepository.findById(request.getUnitId())
                    .orElseThrow(() -> new BadRequestException(
                            "unitId " + request.getUnitId() + " verweist auf keine existierende Einheit."));
            ingredient.setUnit(unit);
        } else {
            ingredient.setUnit(null);
        }
    }

    private IngredientDTO toDto(Ingredient ingredient) {
        Unit unit = ingredient.getUnit();
        return new IngredientDTO(
                ingredient.getId(),
                ingredient.getName(),
                unit != null ? unit.getId() : null,
                unit != null ? unit.getName() : null
        );
    }
}
