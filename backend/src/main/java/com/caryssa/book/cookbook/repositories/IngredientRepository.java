package com.caryssa.book.cookbook.repositories;

import com.caryssa.book.cookbook.entities.Ingredient;
import org.springframework.data.repository.CrudRepository;

public interface IngredientRepository extends CrudRepository<Ingredient, Integer> {
}
