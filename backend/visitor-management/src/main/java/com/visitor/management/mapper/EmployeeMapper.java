package com.visitor.management.mapper;

import com.visitor.management.dto.EmployeeDTO;
import com.visitor.management.entity.Employee;

public class EmployeeMapper {

    public static Employee toEntity(EmployeeDTO dto) {

        return Employee.builder()
                .id(dto.getId())
                .employeeId(dto.getEmployeeId())
                .employeeName(dto.getEmployeeName())
                .email(dto.getEmail())
                .mobileNumber(dto.getMobileNumber())
                .password(dto.getPassword())
                .department(dto.getDepartment())
                .role(dto.getRole())
                .active(dto.getActive())
                .build();
    }

    public static EmployeeDTO toDTO(Employee employee) {

        return EmployeeDTO.builder()
                .id(employee.getId())
                .employeeId(employee.getEmployeeId())
                .employeeName(employee.getEmployeeName())
                .email(employee.getEmail())
                .mobileNumber(employee.getMobileNumber())
                .password(employee.getPassword())
                .department(employee.getDepartment())
                .role(employee.getRole())
                .active(employee.getActive())
                .build();
    }
}