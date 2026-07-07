package com.visitor.management.security;

import com.visitor.management.entity.Employee;
import com.visitor.management.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final EmployeeRepository repository;

    @Override
    public UserDetails loadUserByUsername(
            String employeeId)
            throws UsernameNotFoundException {

        Employee employee = repository

                .findByEmployeeId(employeeId)

                .orElseThrow(() ->

                        new UsernameNotFoundException(
                                "Employee Not Found"));

        return new CustomUserDetails(employee);

    }

}