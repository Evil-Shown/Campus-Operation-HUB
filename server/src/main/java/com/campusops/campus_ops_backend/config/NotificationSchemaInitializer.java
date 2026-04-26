package com.campusops.campus_ops_backend.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationSchemaInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            // Use a minimal Postgres-friendly DDL so notifications are available in local/dev
            // even when migrations are not being applied.
            jdbcTemplate.execute("""
                    CREATE TABLE IF NOT EXISTS public.notifications (
                        id BIGSERIAL PRIMARY KEY,
                        user_id BIGINT NOT NULL REFERENCES public.users(id),
                        type VARCHAR(255) NOT NULL,
                        message TEXT NOT NULL,
                        is_read BOOLEAN NOT NULL DEFAULT FALSE,
                        created_at TIMESTAMP NOT NULL DEFAULT NOW()
                    )
                    """);

            jdbcTemplate.execute("""
                    CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at
                    ON public.notifications (user_id, created_at DESC)
                    """);
        } catch (Exception ex) {
            log.warn("Skipping notifications schema initialization", ex);
        }
    }
}
