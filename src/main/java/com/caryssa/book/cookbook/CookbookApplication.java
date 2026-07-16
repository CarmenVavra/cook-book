package com.caryssa.book.cookbook;

import com.caryssa.book.cookbook.dtos.UnitDTO;
import com.caryssa.book.cookbook.entities.Unit;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import javax.naming.Name;

@SpringBootApplication
public class CookbookApplication {

	public static void main(String[] args) {

		SpringApplication.run(CookbookApplication.class, args);
		//mapAutomatically();
		//mapExplicitly();
	}
/*
	static void mapAutomatically() {
		Unit unit = createUnit();
		ModelMapper modelMapper = new ModelMapper();
		UnitDTO unitDTO = modelMapper.map(unit, UnitDTO.class);
		assertUnitsEqual(unit, unitDTO);
	}
*/
	/**
	 * This example demonstrates how ModelMapper can be used to explicitly map properties from an
	 * Unit to UnitDTO.
	 */
/*	static void mapExplicitly() {
		Unit unit = createUnit();
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.addMappings(new PropertyMap<Unit, UnitDTO>() {
			@Override
			protected void configure() {
				map().setBillingStreet(source.getBillingAddress().getStreet());
				map(source.billingAddress.getCity(), destination.billingCity);
			}
		});

		UnitDTO unitDTO = modelMapper.map(unit, UnitDTO.class);
		assertUnitsEqual(unit, unitDTO);
	}
*/
/*	static Unit createUnit() {
		Unit unit = new Unit();
		return new Unit(unit);
	}

	static void assertUnitsEqual(Unit unit, UnitDTO unitDTO) {
		assert(unitDTO.getUnitName(), unit.getName());
		assertEquals();
		assertEquals(unitDTO.getUnitNameShort(), unit.getNameShort());
	}
*/
}
