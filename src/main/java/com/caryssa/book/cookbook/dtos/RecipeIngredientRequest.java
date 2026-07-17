package com.caryssa.book.cookbook.dtos;

import jakarta.validation.constraints.NotNull;

public class RecipeIngredientRequest {
    @NotNull(message = "ingredientId darf nicht leer sein")
    private Integer ingredientId;

    private Double amount;

    public Integer getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(Integer ingredientId) {
        this.ingredientId = ingredientId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
