package com.caryssa.book.cookbook.dtos;

public class UnitDTO {
    private Integer id;
    private String name;
    private String nameShort;
    private boolean inUse;

    public UnitDTO() {
    }

    public UnitDTO(Integer id, String name, String nameShort, boolean inUse) {
        this.id = id;
        this.name = name;
        this.nameShort = nameShort;
        this.inUse = inUse;
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

    public String getNameShort() {
        return nameShort;
    }

    public void setNameShort(String nameShort) {
        this.nameShort = nameShort;
    }

    public boolean isInUse() {
        return inUse;
    }

    public void setInUse(boolean inUse) {
        this.inUse = inUse;
    }
}
