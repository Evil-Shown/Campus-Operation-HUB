package com.campusops.campus_ops_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.campusops.campus_ops_backend", "com.yourgroup.campus" })
@EntityScan(basePackages = { "com.campusops.campus_ops_backend.model", "com.yourgroup.campus.model" })
@EnableJpaRepositories(basePackages = { "com.campusops.campus_ops_backend.repository", "com.yourgroup.campus.repository" })
public class CampusOpsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampusOpsBackendApplication.class, args);
	}

}
