package com.caryssa.book.cookbook.repositories;

import com.caryssa.book.cookbook.entities.Category;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CategoryRepository extends CrudRepository<Category, Integer> {
    List<Category> findByParentId(Integer parentId);

    long countByParentId(Integer parentId);
}
