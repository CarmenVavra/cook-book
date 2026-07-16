package com.caryssa.book.cookbook.controllers;

import com.caryssa.book.cookbook.dtos.CountryDTO;
import com.caryssa.book.cookbook.dtos.CountryRequest;
import com.caryssa.book.cookbook.services.CountryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CountryController {
    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping("/country/all")
    public List<CountryDTO> getAllCountry() {
        return countryService.getAllCountries();
    }

    @GetMapping("/country")
    public CountryDTO getCountryById(@RequestParam Integer id) {
        return countryService.getCountryById(id);
    }

    @PostMapping("/country")
    @ResponseStatus(HttpStatus.CREATED)
    public CountryDTO createCountry(@Valid @RequestBody CountryRequest request) {
        return countryService.createCountry(request);
    }

    @PutMapping("/country")
    public CountryDTO updateCountry(@RequestParam Integer id, @Valid @RequestBody CountryRequest request) {
        return countryService.updateCountry(id, request);
    }

    @DeleteMapping("/country")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCountry(@RequestParam Integer id) {
        countryService.deleteCountry(id);
    }
}
