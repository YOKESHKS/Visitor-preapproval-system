package com.visitor.management.controller;

import com.visitor.management.dto.LoginRequestDTO;
import com.visitor.management.dto.LoginResponseDTO;
import com.visitor.management.entity.Employee;
import com.visitor.management.repository.EmployeeRepository;
import com.visitor.management.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody Employee employee) {

        // 1. Double check existence
        if (employee.getEmployeeId() != null &&
                employeeRepository.findByEmployeeId(employee.getEmployeeId()).isPresent()) {
            throw new RuntimeException("Employee ID is already registered!");
        }

        // 2. Set structural automated fields
        employee.setActive(true);
        employee.setCreatedDate(java.time.LocalDateTime.now());

        // 3. Fallback checks for missing data from frontend fields
        if (employee.getEmployeeName() == null || employee.getEmployeeName().trim().isEmpty()) {
            employee.setEmployeeName("New Employee"); // Clears the employee_name constraint
        }

        if (employee.getDepartment() == null || employee.getDepartment().trim().isEmpty()) {
            employee.setDepartment("GENERAL");
        }

        // 4. Encrypt the password safely
        if (employee.getPassword() != null && !employee.getPassword().trim().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        } else {
            employee.setPassword(passwordEncoder.encode("Default123!")); // Safeguard if empty
        }

        // 5. Save the clean record
        employeeRepository.save(employee);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Registration Successful! You can now log in.")
                        .data("User created with ID: " + employee.getEmployeeId())
                        .build()
        );
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@RequestBody LoginRequestDTO request) {

        System.out.println("====== LOGIN ATTEMPT ======");
        System.out.println("Received identifier string: " + request.getEmail()); // Updated

        // Pass request.getEmail() directly into the lookup method
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Corporate Email Address"));

        if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        // ... rest of your mapping code remains exactly the sam
        // Build and return your response mapping
        LoginResponseDTO responseData = LoginResponseDTO.builder()
                .id(employee.getId())
                .employeeId(employee.getEmployeeId())
                .employeeName(employee.getEmployeeName())
                .role(employee.getRole())
                .department(employee.getDepartment())
                .build();

        return ResponseEntity.ok(
                ApiResponse.<LoginResponseDTO>builder()
                        .success(true)
                        .message("Login Successful")
                        .data(responseData)
                        .build()
        );
    }
}