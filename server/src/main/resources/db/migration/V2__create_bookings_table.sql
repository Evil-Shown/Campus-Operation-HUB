CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose VARCHAR(500) NULL,
    attendees INT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reject_reason VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_bookings_resource FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE INDEX idx_bookings_resource_start_end
    ON bookings (resource_id, start_time, end_time);
