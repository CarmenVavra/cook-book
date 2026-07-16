package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.dtos.CountryDTO;
import com.caryssa.book.cookbook.dtos.CountryRequest;
import com.caryssa.book.cookbook.entities.Country;
import com.caryssa.book.cookbook.exceptions.ResourceNotFoundException;
import com.caryssa.book.cookbook.repositories.CountryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CountryService {
    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<CountryDTO> getAllCountries() {
        List<CountryDTO> result = new ArrayList<>();
        for (Country country : countryRepository.findAll()) {
            result.add(toDto(country));
        }
        return result;
    }

    public CountryDTO getCountryById(Integer id) {
        return toDto(findByIdOrThrow(id));
    }

    public CountryDTO createCountry(CountryRequest request) {
        Country country = new Country();
        applyRequest(country, request);
        return toDto(countryRepository.save(country));
    }

    public CountryDTO updateCountry(Integer id, CountryRequest request) {
        Country country = findByIdOrThrow(id);
        applyRequest(country, request);
        return toDto(countryRepository.save(country));
    }

    public void deleteCountry(Integer id) {
        findByIdOrThrow(id);
        countryRepository.deleteById(id);
    }

    private Country findByIdOrThrow(Integer id) {
        return countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land mit id " + id + " wurde nicht gefunden."));
    }

    private void applyRequest(Country country, CountryRequest request) {
        country.setName(request.getName());
        country.setNameShort(request.getNameShort());
        country.setAdjective(request.getAdjective());
    }

    private CountryDTO toDto(Country country) {
        return new CountryDTO(country.getId(), country.getName(), country.getNameShort(), country.getAdjective());
    }
}
