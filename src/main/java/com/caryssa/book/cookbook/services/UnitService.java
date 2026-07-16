package com.caryssa.book.cookbook.services;

import com.caryssa.book.cookbook.dtos.UnitDTO;
import com.caryssa.book.cookbook.entities.Unit;
import com.caryssa.book.cookbook.repositories.UnitRepository;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UnitService {

    private final UnitRepository unitRepository;
    private final ModelMapper modelMapper;

    // Spring reicht die Bean hier automatisch rein

    public UnitService(UnitRepository unitRepository, ModelMapper modelMapper) {
        this.unitRepository = unitRepository;
        this.modelMapper = modelMapper;
    }



    public UnitDTO convertToDto(Unit unit) {
        return modelMapper.map(unit, UnitDTO.class);
    }

    public ResponseEntity<Iterable<Unit>> getAllUnits() {
        try{
           /* Iterable<Unit> units = unitRepository.findAll();
            for(Unit unit : units){
               UnitDTO unitDto = this.convertToDto(unit);

            };*/
            return new ResponseEntity<>(unitRepository.findAll(), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Unit> getUnitById(Integer id) {
        try{
            return new ResponseEntity<>(unitRepository.findById(id).get(), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Unit> createUnit(Unit unit) {
        try{
            return new ResponseEntity<>(unitRepository.save(unit), HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Unit> updateUnit(Unit unit) {
        try{
            return new ResponseEntity<>(unitRepository.save(unit), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Unit> deleteUnit(Integer id) {
        try{
            unitRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
