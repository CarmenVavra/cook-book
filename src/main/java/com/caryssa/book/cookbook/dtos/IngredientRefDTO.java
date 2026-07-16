package com.caryssa.book.cookbook.dtos;

public class IngredientRefDTO {
    private Integer id;
    private String name;
    private String unitName;

    public IngredientRefDTO() {
    }

    public IngredientRefDTO(Integer id, String name, String unitName) {
        this.id = id;
        this.name = name;
        this.unitName = unitName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }
}
