package com.campusops.campus_ops_backend.config;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.sql.DataSource;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseStartupLogger implements ApplicationRunner {

    private final DataSource dataSource;

    @Override
    public void run(ApplicationArguments args) {
        try (Connection connection = dataSource.getConnection();
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery("SELECT 1")) {

            int pingResult = resultSet.next() ? resultSet.getInt(1) : -1;

            log.info("Database connectivity check OK (SELECT 1 = {})", pingResult);
            log.info("Database URL: {}", connection.getMetaData().getURL());
            log.info("Database user: {}", connection.getMetaData().getUserName());
        } catch (Exception ex) {
            log.error("Database connectivity check FAILED at startup", ex);
        }
    }
}
