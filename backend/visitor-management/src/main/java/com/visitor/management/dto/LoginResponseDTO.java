package com.visitor.management.dto;

import com.visitor.management.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private Long id;

    private String employeeId;

    private String employeeName;

    private Role role;

    private String department;

}