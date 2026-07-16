package com.caryssa.book.cookbook.dtos;

public class CategoryDTO {
    private Integer id;
    private String name;
    private Integer parentId;
    private String parentName;
    private int childCount;

    public CategoryDTO() {
    }

    public CategoryDTO(Integer id, String name, Integer parentId, String parentName, int childCount) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.parentName = parentName;
        this.childCount = childCount;
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

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public int getChildCount() {
        return childCount;
    }

    public void setChildCount(int childCount) {
        this.childCount = childCount;
    }
}
