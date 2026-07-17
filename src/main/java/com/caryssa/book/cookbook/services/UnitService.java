package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.dtos.UnitDTO;
import com.caryssa.book.cookbook.dtos.UnitRequest;
import com.caryssa.book.cookbook.entities.Unit;
import com.caryssa.book.cookbook.exceptions.ConflictException;
import com.caryssa.book.cookbook.exceptions.ResourceNotFoundException;
import com.caryssa.book.cookbook.repositories.RecipeIngredientRepository;
import com.caryssa.book.cookbook.repositories.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UnitService {
    private final UnitRepository unitRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;

    public UnitService(UnitRepository unitRepository, RecipeIngredientRepository recipeIngredientRepository) {
        this.unitRepository = unitRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
    }

    public List<UnitDTO> getAllUnits() {
        List<UnitDTO> result = new ArrayList<>();
        for (Unit unit : unitRepository.findAll()) {
            result.add(toDto(unit));
        }
        return result;
    }

    public UnitDTO getUnitById(Integer id) {
        return toDto(findByIdOrThrow(id));
    }

    public UnitDTO createUnit(UnitRequest request) {
        Unit unit = new Unit();
        applyRequest(unit, request);
        return toDto(unitRepository.save(unit));
    }

    public UnitDTO updateUnit(Integer id, UnitRequest request) {
        Unit unit = findByIdOrThrow(id);
        requireNotInUse(id, "geändert");
        applyRequest(unit, request);
        return toDto(unitRepository.save(unit));
    }

    public void deleteUnit(Integer id) {
        findByIdOrThrow(id);
        requireNotInUse(id, "gelöscht");
        unitRepository.deleteById(id);
    }

    private void requireNotInUse(Integer unitId, String action) {
        if (recipeIngredientRepository.existsByUnit_Id(unitId)) {
            throw new ConflictException("Diese Maßeinheit wird verwendet und kann nicht " + action + " werden.");
        }
    }

    private Unit findByIdOrThrow(Integer id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maßeinheit mit id " + id + " wurde nicht gefunden."));
    }

    private void applyRequest(Unit unit, UnitRequest request) {
        unit.setName(request.getName());
        unit.setNameShort(request.getNameShort());
    }

    private UnitDTO toDto(Unit unit) {
        return new UnitDTO(
                unit.getId(),
                unit.getName(),
                unit.getNameShort(),
                recipeIngredientRepository.existsByUnit_Id(unit.getId())
        );
    }
}
