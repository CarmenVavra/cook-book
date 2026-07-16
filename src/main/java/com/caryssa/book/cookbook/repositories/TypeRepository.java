package com.caryssa.book.cookbook.repositories;

import com.caryssa.book.cookbook.entities.Type;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TypeRepository extends CrudRepository<Type, Integer> {
    Optional<Type> findByName(String name);
}
