package com.campusops.campus_ops_backend.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class TicketSchemaMigration {

    @Bean
    ApplicationRunner migrateTicketResourceLocationColumn(JdbcTemplate jdbcTemplate) {
        return args -> {
            jdbcTemplate.execute("""
                    ALTER TABLE public.tickets
                    ADD COLUMN IF NOT EXISTS resource_location VARCHAR(255)
                    """);

            jdbcTemplate.execute("""
                    UPDATE public.tickets
                    SET resource_location = CASE
                        WHEN description IS NOT NULL AND POSITION('Resource/Location:' IN description) > 0
                            THEN NULLIF(BTRIM(SUBSTRING(description FROM 'Resource/Location:\\s*(.*)$')), '')
                        ELSE NULL
                    END
                    WHERE resource_location IS NULL OR BTRIM(resource_location) = ''
                    """);

            jdbcTemplate.execute("""
                    UPDATE public.tickets
                    SET resource_location = 'Unspecified'
                    WHERE resource_location IS NULL OR BTRIM(resource_location) = ''
                    """);

            jdbcTemplate.execute("""
                    ALTER TABLE public.tickets
                    ALTER COLUMN resource_location SET NOT NULL
                    """);
        };
    }
}
