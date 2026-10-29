package com.caryssa.book.cookbook.dtos;

import java.util.List;

public class RecipeSummaryDTO {
    private Integer id;
    private String title;
    private Integer countryId;
    private String countryName;
    private Integer typeId;
    private String typeName;
    private List<CategoryRefDTO> categories;
    private String ownerSub;

    public RecipeSummaryDTO() {
    }

    public RecipeSummaryDTO(Integer id, String title, Integer countryId, String countryName, Integer typeId,
                             String typeName, List<CategoryRefDTO> categories, String ownerSub) {
        this.id = id;
        this.title = title;
        this.countryId = countryId;
        this.countryName = countryName;
        this.typeId = typeId;
        this.typeName = typeName;
        this.categories = categories;
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

    public Integer getCountryId() {
        return countryId;
    }

    public void setCountryId(Integer countryId) {
        this.countryId = countryId;
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

    public String getOwnerSub() {
        return ownerSub;
    }

    public void setOwnerSub(String ownerSub) {
        this.ownerSub = ownerSub;
    }
}
