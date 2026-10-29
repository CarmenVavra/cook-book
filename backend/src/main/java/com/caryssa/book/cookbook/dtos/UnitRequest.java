package com.caryssa.book.cookbook.dtos;

import jakarta.validation.constraints.NotBlank;

public class UnitRequest {
    @NotBlank(message = "Name darf nicht leer sein")
    private String name;

    private String nameShort;

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
}
