package com.caryssa.book.cookbook.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean // Spring verwaltet das Rückgabeobjekt nun als Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
