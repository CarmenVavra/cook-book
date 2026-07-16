package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.entities.Ingredient;
import com.caryssa.book.cookbook.repositories.IngredientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class IngredientService {
    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public ResponseEntity<Iterable<Ingredient>> getAllIngredients() {
        try{
            return new ResponseEntity<>(ingredientRepository.findAll(), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Ingredient> getIngredientById(Integer id) {
        try{
            return new ResponseEntity<>(ingredientRepository.findById(id).get(), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Ingredient> createIngredient(Ingredient ingredient) {
        try{
            return new ResponseEntity<>(ingredientRepository.save(ingredient), HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Ingredient> updateIngredient(Ingredient ingredient) {
        try{
            return new ResponseEntity<>(ingredientRepository.save(ingredient), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Ingredient> deleteIngredient(Integer id) {
        try{
            ingredientRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
