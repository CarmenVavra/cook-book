package com.caryssa.book.cookbook.dtos;

public class IngredientDTO {
    private Integer id;
    private String name;
    private Integer unitId;
    private String unitName;

    public IngredientDTO() {
    }

    public IngredientDTO(Integer id, String name, Integer unitId, String unitName) {
        this.id = id;
        this.name = name;
        this.unitId = unitId;
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

    public Integer getUnitId() {
        return unitId;
    }

    public void setUnitId(Integer unitId) {
        this.unitId = unitId;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }
}
