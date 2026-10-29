package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.dtos.CategoryRefDTO;
import com.caryssa.book.cookbook.dtos.IngredientRefDTO;
import com.caryssa.book.cookbook.dtos.RecipeDetailDTO;
import com.caryssa.book.cookbook.dtos.RecipeIngredientRequest;
import com.caryssa.book.cookbook.dtos.RecipeRequest;
import com.caryssa.book.cookbook.dtos.RecipeSummaryDTO;
import com.caryssa.book.cookbook.entities.Category;
import com.caryssa.book.cookbook.entities.Country;
import com.caryssa.book.cookbook.entities.Ingredient;
import com.caryssa.book.cookbook.entities.Recipe;
import com.caryssa.book.cookbook.entities.RecipeIngredient;
import com.caryssa.book.cookbook.entities.Type;
import com.caryssa.book.cookbook.entities.Unit;
import com.caryssa.book.cookbook.exceptions.BadRequestException;
import com.caryssa.book.cookbook.exceptions.ForbiddenException;
import com.caryssa.book.cookbook.exceptions.ResourceNotFoundException;
import com.caryssa.book.cookbook.repositories.CategoryRepository;
import com.caryssa.book.cookbook.repositories.CountryRepository;
import com.caryssa.book.cookbook.repositories.IngredientRepository;
import com.caryssa.book.cookbook.repositories.RecipeRepository;
import com.caryssa.book.cookbook.repositories.TypeRepository;
import com.caryssa.book.cookbook.repositories.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final CountryRepository countryRepository;
    private final TypeRepository typeRepository;
    private final CategoryRepository categoryRepository;
    private final IngredientRepository ingredientRepository;
    private final UnitRepository unitRepository;

    public RecipeService(RecipeRepository recipeRepository, CountryRepository countryRepository,
                          TypeRepository typeRepository, CategoryRepository categoryRepository,
                          IngredientRepository ingredientRepository, UnitRepository unitRepository) {
        this.recipeRepository = recipeRepository;
        this.countryRepository = countryRepository;
        this.typeRepository = typeRepository;
        this.categoryRepository = categoryRepository;
        this.ingredientRepository = ingredientRepository;
        this.unitRepository = unitRepository;
    }

    public List<RecipeSummaryDTO> getAllRecipes(Integer typeId, Integer categoryId) {
        Iterable<Recipe> recipes;
        if (typeId != null && categoryId != null) {
            recipes = recipeRepository.findByTypeIdAndCategories_Id(typeId, categoryId);
        } else if (typeId != null) {
            recipes = recipeRepository.findByTypeId(typeId);
        } else if (categoryId != null) {
            recipes = recipeRepository.findByCategories_Id(categoryId);
        } else {
            recipes = recipeRepository.findAll();
        }

        List<RecipeSummaryDTO> result = new ArrayList<>();
        for (Recipe recipe : recipes) {
            result.add(toSummaryDto(recipe));
        }
        return result;
    }

    public RecipeDetailDTO getRecipeById(Integer id) {
        return toDetailDto(findByIdOrThrow(id));
    }

    public RecipeDetailDTO createRecipe(RecipeRequest request, String ownerSub) {
        Recipe recipe = new Recipe();
        recipe.setOwnerSub(ownerSub);
        applyRequest(recipe, request);
        return toDetailDto(recipeRepository.save(recipe));
    }

    public RecipeDetailDTO updateRecipe(Integer id, RecipeRequest request, String ownerSub) {
        Recipe recipe = findByIdOrThrow(id);
        requireOwner(recipe, ownerSub);
        applyRequest(recipe, request);
        return toDetailDto(recipeRepository.save(recipe));
    }

    public void deleteRecipe(Integer id, String ownerSub) {
        Recipe recipe = findByIdOrThrow(id);
        requireOwner(recipe, ownerSub);
        recipeRepository.deleteById(id);
    }

    private void requireOwner(Recipe recipe, String ownerSub) {
        if (!ownerSub.equals(recipe.getOwnerSub())) {
            throw new ForbiddenException("Du kannst nur deine eigenen Rezepte bearbeiten oder löschen.");
        }
    }

    private Recipe findByIdOrThrow(Integer id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rezept mit id " + id + " wurde nicht gefunden."));
    }

    private void applyRequest(Recipe recipe, RecipeRequest request) {
        recipe.setTitle(request.getTitle());
        recipe.setText(request.getText());

        if (request.getCountryId() != null) {
            Country country = countryRepository.findById(request.getCountryId())
                    .orElseThrow(() -> new BadRequestException(
                            "countryId " + request.getCountryId() + " verweist auf kein existierendes Land."));
            recipe.setCountry(country);
        } else {
            recipe.setCountry(null);
        }

        if (request.getTypeId() != null) {
            Type type = typeRepository.findById(request.getTypeId())
                    .orElseThrow(() -> new BadRequestException(
                            "typeId " + request.getTypeId() + " verweist auf keinen existierenden Typ."));
            recipe.setType(type);
        } else {
            recipe.setType(null);
        }

        Set<Category> categories = new HashSet<>();
        if (request.getCategoryIds() != null) {
            for (Integer categoryId : request.getCategoryIds()) {
                categories.add(categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new BadRequestException(
                                "categoryId " + categoryId + " verweist auf keine existierende Kategorie.")));
            }
        }
        recipe.setCategories(categories);

        List<RecipeIngredient> recipeIngredients = recipe.getRecipeIngredients();
        if (recipeIngredients == null) {
            recipeIngredients = new ArrayList<>();
            recipe.setRecipeIngredients(recipeIngredients);
        }
        recipeIngredients.clear();
        if (request.getIngredients() != null) {
            for (RecipeIngredientRequest ingredientRequest : request.getIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(ingredientRequest.getIngredientId())
                        .orElseThrow(() -> new BadRequestException(
                                "ingredientId " + ingredientRequest.getIngredientId() + " verweist auf keine existierende Zutat."));
                RecipeIngredient link = new RecipeIngredient();
                link.setRecipe(recipe);
                link.setIngredient(ingredient);
                if (ingredientRequest.getUnitId() != null) {
                    Unit unit = unitRepository.findById(ingredientRequest.getUnitId())
                            .orElseThrow(() -> new BadRequestException(
                                    "unitId " + ingredientRequest.getUnitId() + " verweist auf keine existierende Einheit."));
                    link.setUnit(unit);
                } else {
                    link.setUnit(null);
                }
                link.setAmount(ingredientRequest.getAmount());
                recipeIngredients.add(link);
            }
        }
    }

    private RecipeSummaryDTO toSummaryDto(Recipe recipe) {
        List<CategoryRefDTO> categoryRefs = new ArrayList<>();
        if (recipe.getCategories() != null) {
            for (Category category : recipe.getCategories()) {
                categoryRefs.add(new CategoryRefDTO(category.getId(), category.getName()));
            }
        }

        Country country = recipe.getCountry();
        Type type = recipe.getType();

        return new RecipeSummaryDTO(
                recipe.getId(),
                recipe.getTitle(),
                country != null ? country.getId() : null,
                country != null ? country.getName() : null,
                type != null ? type.getId() : null,
                type != null ? type.getName() : null,
                categoryRefs,
                recipe.getOwnerSub()
        );
    }

    private RecipeDetailDTO toDetailDto(Recipe recipe) {
        RecipeSummaryDTO summary = toSummaryDto(recipe);

        List<IngredientRefDTO> ingredientRefs = new ArrayList<>();
        if (recipe.getRecipeIngredients() != null) {
            for (RecipeIngredient link : recipe.getRecipeIngredients()) {
                Ingredient ingredient = link.getIngredient();
                Unit unit = link.getUnit();
                ingredientRefs.add(new IngredientRefDTO(
                        ingredient.getId(),
                        ingredient.getName(),
                        unit != null ? unit.getId() : null,
                        unit != null ? unit.getName() : null,
                        unit != null ? unit.getNameShort() : null,
                        link.getAmount()
                ));
            }
        }

        return new RecipeDetailDTO(
                summary.getId(),
                summary.getTitle(),
                recipe.getText(),
                summary.getCountryId(),
                summary.getCountryName(),
                summary.getTypeId(),
                summary.getTypeName(),
                summary.getCategories(),
                ingredientRefs,
                summary.getOwnerSub()
        );
    }
}
