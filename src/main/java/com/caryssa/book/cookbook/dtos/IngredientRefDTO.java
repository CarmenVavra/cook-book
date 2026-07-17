package com.caryssa.book.cookbook.dtos;

public class IngredientRefDTO {
    private Integer id;
    private String name;
    private Integer unitId;
    private String unitName;
    private String unitNameShort;
    private Double amount;

    public IngredientRefDTO() {
    }

    public IngredientRefDTO(Integer id, String name, Integer unitId, String unitName, String unitNameShort, Double amount) {
        this.id = id;
        this.name = name;
        this.unitId = unitId;
        this.unitName = unitName;
        this.unitNameShort = unitNameShort;
        this.amount = amount;
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

    public String getUnitNameShort() {
        return unitNameShort;
    }

    public void setUnitNameShort(String unitNameShort) {
        this.unitNameShort = unitNameShort;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
