package com.caryssa.book.cookbook.repositories;

import com.caryssa.book.cookbook.entities.Recipe;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RecipeRepository extends CrudRepository<Recipe, Integer> {
    List<Recipe> findByTypeId(Integer typeId);

    List<Recipe> findByCategories_Id(Integer categoryId);

    List<Recipe> findByTypeIdAndCategories_Id(Integer typeId, Integer categoryId);
}
