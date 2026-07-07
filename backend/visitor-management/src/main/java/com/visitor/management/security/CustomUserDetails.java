package com.visitor.management.security;

import com.visitor.management.entity.Employee;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Employee employee;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return Collections.singletonList(

                new SimpleGrantedAuthority(

                        employee.getRole().name()

                )

        );

    }

    @Override
    public String getPassword() {

        return employee.getPassword();

    }

    @Override
    public String getUsername() {

        return employee.getEmployeeId();

    }

    @Override
    public boolean isAccountNonExpired() {

        return true;

    }

    @Override
    public boolean isAccountNonLocked() {

        return true;

    }

    @Override
    public boolean isCredentialsNonExpired() {

        return true;

    }

    @Override
    public boolean isEnabled() {

        return employee.getActive();

    }

}