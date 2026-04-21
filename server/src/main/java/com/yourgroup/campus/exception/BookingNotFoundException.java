package com.yourgroup.campus.exception;

import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;

public class BookingNotFoundException extends ResourceNotFoundException {

    public BookingNotFoundException(Long id) {
        super("Booking with id " + id + " not found");
    }
}
