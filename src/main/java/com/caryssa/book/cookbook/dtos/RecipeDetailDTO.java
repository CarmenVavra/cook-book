package com.caryssa.book.cookbook.dtos;

import java.util.List;

public class RecipeDetailDTO {
    private Integer id;
    private String title;
    private String text;
    private String countryName;
    private Integer typeId;
    private String typeName;
    private List<CategoryRefDTO> categories;
    private List<IngredientRefDTO> ingredients;
    private String ownerSub;

    public RecipeDetailDTO() {
    }

    public RecipeDetailDTO(Integer id, String title, String text, String countryName, Integer typeId,
                            String typeName, List<CategoryRefDTO> categories, List<IngredientRefDTO> ingredients,
                            String ownerSub) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.countryName = countryName;
        this.typeId = typeId;
        this.typeName = typeName;
        this.categories = categories;
        this.ingredients = ingredients;
        this.ownerSub = ownerSub;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public List<CategoryRefDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryRefDTO> categories) {
        this.categories = categories;
    }

    public List<IngredientRefDTO> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<IngredientRefDTO> ingredients) {
        this.ingredients = ingredients;
    }

    public String getOwnerSub() {
        return ownerSub;
    }

    public void setOwnerSub(String ownerSub) {
        this.ownerSub = ownerSub;
    }
}
