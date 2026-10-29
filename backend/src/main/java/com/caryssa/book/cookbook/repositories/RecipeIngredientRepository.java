package com.caryssa.book.cookbook.repositories;

import com.caryssa.book.cookbook.entities.RecipeIngredient;
import org.springframework.data.repository.CrudRepository;

public interface RecipeIngredientRepository extends CrudRepository<RecipeIngredient, Integer> {
    boolean existsByUnit_Id(Integer unitId);
}
