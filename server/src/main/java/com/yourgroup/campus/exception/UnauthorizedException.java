package com.yourgroup.campus.exception;

import com.campusops.campus_ops_backend.exception.UnauthorizedActionException;

public class UnauthorizedException extends UnauthorizedActionException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
