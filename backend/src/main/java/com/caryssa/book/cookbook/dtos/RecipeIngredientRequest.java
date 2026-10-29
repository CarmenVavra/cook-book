package com.caryssa.book.cookbook.dtos;

import jakarta.validation.constraints.NotNull;

public class RecipeIngredientRequest {
    @NotNull(message = "ingredientId darf nicht leer sein")
    private Integer ingredientId;

    private Integer unitId;

    private Double amount;

    public Integer getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(Integer ingredientId) {
        this.ingredientId = ingredientId;
    }

    public Integer getUnitId() {
        return unitId;
    }

    public void setUnitId(Integer unitId) {
        this.unitId = unitId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
