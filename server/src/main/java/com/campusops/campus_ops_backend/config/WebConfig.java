package com.campusops.campus_ops_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") //CORS mapping for all endpoints
                .allowedOrigins("http://localhost:5173") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // allowed HTTP methods
                .allowedHeaders("*") // allow all http headers
                .allowCredentials(true) // allow to send Cookies / Authorization headers 
                .maxAge(3600); // Preflight request cache time
    }
}
