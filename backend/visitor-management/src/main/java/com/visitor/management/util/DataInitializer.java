package com.visitor.management.util;

import com.visitor.management.entity.Employee;
import com.visitor.management.enums.Role;
import com.visitor.management.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (!employeeRepository.existsByEmployeeId("EMP1001")) {

            Employee employee = Employee.builder()
                    .employeeId("EMP1001")
                    .employeeName("Yokesh")
                    .email("employee@company.com")
                    .mobileNumber("9876543210")
                    .department("IT")
                    .password(passwordEncoder.encode("employee123"))
                    .role(Role.EMPLOYEE)
                    .active(true)
                    .createdDate(LocalDateTime.now())
                    .build();

            employeeRepository.save(employee);

        }

        if (!employeeRepository.existsByEmployeeId("SEC1001")) {

            Employee security = Employee.builder()
                    .employeeId("SEC1001")
                    .employeeName("Security")
                    .email("security@company.com")
                    .mobileNumber("9999999999")
                    .department("Security")
                    .password(passwordEncoder.encode("security123"))
                    .role(Role.SECURITY)
                    .active(true)
                    .createdDate(LocalDateTime.now())
                    .build();

            employeeRepository.save(security);

        }

    }

}