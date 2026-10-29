package com.caryssa.book.cookbook.dtos;

public class CountryDTO {
    private Integer id;
    private String name;
    private String nameShort;
    private String adjective;

    public CountryDTO() {
    }

    public CountryDTO(Integer id, String name, String nameShort, String adjective) {
        this.id = id;
        this.name = name;
        this.nameShort = nameShort;
        this.adjective = adjective;
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

    public String getAdjective() {
        return adjective;
    }

    public void setAdjective(String adjective) {
        this.adjective = adjective;
    }
}
