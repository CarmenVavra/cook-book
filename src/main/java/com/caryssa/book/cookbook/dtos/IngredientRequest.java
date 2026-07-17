package com.caryssa.book.cookbook.dtos;

import jakarta.validation.constraints.NotBlank;

public class IngredientRequest {
    @NotBlank(message = "Name darf nicht leer sein")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
