package com.yourgroup.campus.exception;

public class UnauthorizedBookingAccessException extends RuntimeException {

    public UnauthorizedBookingAccessException(String message) {
        super(message);
    }
}
