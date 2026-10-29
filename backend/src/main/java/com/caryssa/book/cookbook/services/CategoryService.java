package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.dtos.CategoryDTO;
import com.caryssa.book.cookbook.dtos.CategoryRequest;
import com.caryssa.book.cookbook.entities.Category;
import com.caryssa.book.cookbook.exceptions.BadRequestException;
import com.caryssa.book.cookbook.exceptions.ConflictException;
import com.caryssa.book.cookbook.exceptions.ResourceNotFoundException;
import com.caryssa.book.cookbook.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        List<CategoryDTO> result = new ArrayList<>();
        for (Category category : categoryRepository.findAll()) {
            result.add(toDto(category));
        }
        return result;
    }

    public CategoryDTO getCategoryById(Integer id) {
        return toDto(findByIdOrThrow(id));
    }

    public CategoryDTO createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setParent(resolveParent(request.getParentId(), null));
        return toDto(categoryRepository.save(category));
    }

    public CategoryDTO updateCategory(Integer id, CategoryRequest request) {
        Category category = findByIdOrThrow(id);
        category.setName(request.getName());
        category.setParent(resolveParent(request.getParentId(), id));
        return toDto(categoryRepository.save(category));
    }

    public void deleteCategory(Integer id) {
        findByIdOrThrow(id);
        if (categoryRepository.countByParentId(id) > 0) {
            throw new ConflictException("Kategorie kann nicht gelöscht werden, solange sie Unterkategorien besitzt.");
        }
        categoryRepository.deleteById(id);
    }

    private Category findByIdOrThrow(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategorie mit id " + id + " wurde nicht gefunden."));
    }

    private Category resolveParent(Integer parentId, Integer ownId) {
        if (parentId == null) {
            return null;
        }
        if (ownId != null && parentId.equals(ownId)) {
            throw new BadRequestException("Eine Kategorie kann nicht ihr eigener Parent sein.");
        }

        Category parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new BadRequestException("parentId " + parentId + " verweist auf keine existierende Kategorie."));

        if (ownId != null) {
            Category ancestor = parent;
            while (ancestor != null) {
                if (ancestor.getId() == ownId) {
                    throw new BadRequestException("Zirkuläre Kategorie-Hierarchie ist nicht erlaubt.");
                }
                ancestor = ancestor.getParent();
            }
        }
        return parent;
    }

    private CategoryDTO toDto(Category category) {
        Category parent = category.getParent();
        Integer parentId = parent != null ? parent.getId() : null;
        String parentName = parent != null ? parent.getName() : null;
        int childCount = (int) categoryRepository.countByParentId(category.getId());
        return new CategoryDTO(category.getId(), category.getName(), parentId, parentName, childCount);
    }
}
