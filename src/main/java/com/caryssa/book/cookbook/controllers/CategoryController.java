package com.caryssa.book.cookbook.controllers;

import com.caryssa.book.cookbook.dtos.CategoryDTO;
import com.caryssa.book.cookbook.dtos.CategoryRequest;
import com.caryssa.book.cookbook.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/category/all")
    public List<CategoryDTO> getAllCategory() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/category")
    public CategoryDTO getCategoryById(@RequestParam Integer id) {
        return categoryService.getCategoryById(id);
    }

    @PostMapping("/category")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDTO createCategory(@Valid @RequestBody CategoryRequest request) {
        return categoryService.createCategory(request);
    }

    @PutMapping("/category")
    public CategoryDTO updateCategory(@RequestParam Integer id, @Valid @RequestBody CategoryRequest request) {
        return categoryService.updateCategory(id, request);
    }

    @DeleteMapping("/category")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@RequestParam Integer id) {
        categoryService.deleteCategory(id);
    }
}
