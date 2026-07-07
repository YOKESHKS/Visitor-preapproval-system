package com.visitor.management.dto;

import com.visitor.management.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {

    private Long id;

    private String employeeId;

    private String employeeName;

    private String email;

    private String mobileNumber;

    private String password;

    private String department;

    private Role role;

    private Boolean active;

}