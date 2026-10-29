package com.caryssa.book.cookbook.repositories;

import com.caryssa.book.cookbook.entities.Country;
import org.springframework.data.repository.CrudRepository;

public interface CountryRepository extends CrudRepository<Country, Integer> {
}
