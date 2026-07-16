package com.caryssa.book.cookbook.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CountryRequest {
    @NotBlank(message = "Name darf nicht leer sein")
    private String name;

    @Size(max = 3, message = "Kürzel darf höchstens 3 Zeichen lang sein")
    private String nameShort;

    private String adjective;

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
