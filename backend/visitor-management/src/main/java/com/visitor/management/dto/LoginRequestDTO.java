package com.visitor.management.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {

    private String email;     // Changed from employeeId to email
    private String password;

}