package com.serviciorequisicion.servicio_requisicion.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/graphql") // Ruta específica para GraphQL
                .allowedOrigins("http://localhost:5173") // Permitir el frontend en localhost:5173
                .allowedMethods("GET", "POST") // Métodos HTTP permitidos
                .allowedHeaders("*") // Permitir todas las cabeceras
                .allowCredentials(true); // Permitir envío de credenciales (si es necesario)
    }
}
