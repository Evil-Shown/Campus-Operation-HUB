package com.campusops.campus_ops_backend.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
@Profile("!test")
public class LocalDataSourceConfig {

    @Bean
    @Primary
    DataSource localDataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl("jdbc:postgresql://localhost:5432/campus_op_hub");
        dataSource.setUsername("campus_user");
        dataSource.setPassword("campus123");
        dataSource.setDriverClassName("org.postgresql.Driver");
        return dataSource;
    }
}
