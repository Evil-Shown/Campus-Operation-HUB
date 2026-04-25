-- Member 2 - Booking Management
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS booking_date DATE,
    ADD COLUMN IF NOT EXISTS expected_attendees INT,
    ADD COLUMN IF NOT EXISTS admin_review_note VARCHAR(500),
    ADD COLUMN IF NOT EXISTS reviewed_by BIGINT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

UPDATE bookings
SET booking_date = COALESCE(booking_date, CAST(start_time AS DATE)),
    expected_attendees = COALESCE(expected_attendees, attendees),
    updated_at = COALESCE(updated_at, created_at);

ALTER TABLE bookings
    ALTER COLUMN booking_date SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_reviewed_by
        FOREIGN KEY (reviewed_by) REFERENCES users(id);

ALTER TABLE bookings
    DROP COLUMN IF EXISTS attendees,
    DROP COLUMN IF EXISTS reject_reason;

ALTER TABLE bookings
    ALTER COLUMN start_time TYPE TIME USING start_time::time,
    ALTER COLUMN end_time TYPE TIME USING end_time::time;

CREATE INDEX IF NOT EXISTS idx_bookings_resource_date_time
    ON bookings (resource_id, booking_date, start_time, end_time);
