package com.caryssa.book.cookbook.dtos;

import jakarta.validation.constraints.NotBlank;

public class IngredientRequest {
    @NotBlank(message = "Name darf nicht leer sein")
    private String name;

    private Integer unitId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getUnitId() {
        return unitId;
    }

    public void setUnitId(Integer unitId) {
        this.unitId = unitId;
    }
}
