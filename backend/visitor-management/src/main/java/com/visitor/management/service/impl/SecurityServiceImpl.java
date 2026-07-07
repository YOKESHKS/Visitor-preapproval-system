package com.visitor.management.service.impl;

import com.visitor.management.dto.CheckInOutDTO;
import com.visitor.management.dto.VisitorDTO;
import com.visitor.management.entity.Visitor;
import com.visitor.management.enums.VisitorStatus;
import com.visitor.management.exception.ResourceNotFoundException;
import com.visitor.management.mapper.VisitorMapper;
import com.visitor.management.repository.VisitorRepository;
import com.visitor.management.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SecurityServiceImpl implements SecurityService {

    private final VisitorRepository repository;

    @Override
    public VisitorDTO approveVisitorRequest(String visitId) {
        Visitor visitor = repository.findByVisitId(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Profile Not Found"));

        // Only allow approval if the request is currently in REGISTERED state
        if (visitor.getStatus() == VisitorStatus.REGISTERED) {
            visitor.setStatus(VisitorStatus.APPROVED);
            repository.save(visitor);
        }

        return VisitorMapper.toDTO(visitor);
    }

    @Override
    public List<VisitorDTO> getTodayVisitors() {
        return repository.findByVisitDate(LocalDate.now())
                .stream()
                .map(VisitorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VisitorDTO> getVisitorsInside() {
        // Correctly keeps active tracker restricted exclusively to checked-in users
        return repository.findByStatus(VisitorStatus.CHECKED_IN)
                .stream()
                .map(VisitorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CheckInOutDTO checkIn(String visitId) {
        Visitor visitor = repository.findByVisitId(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Not Found"));

        // Enforce that a visitor must be APPROVED before checking in
        if (visitor.getStatus() != VisitorStatus.APPROVED) {
            throw new IllegalStateException("Visitor entry pass must be APPROVED by security prior to check-in.");
        }

        visitor.setStatus(VisitorStatus.CHECKED_IN);
        visitor.setCheckInTime(LocalDateTime.now());
        repository.save(visitor);

        return CheckInOutDTO.builder()
                .visitId(visitor.getVisitId())
                .visitorName(visitor.getVisitorName())
                .governmentId(visitor.getGovernmentId())
                .checkInTime(visitor.getCheckInTime())
                .status(visitor.getStatus().name())
                .build();
    }

    @Override
    public CheckInOutDTO checkOut(String visitId) {
        Visitor visitor = repository.findByVisitId(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Not Found"));

        visitor.setStatus(VisitorStatus.CHECKED_OUT);
        visitor.setCheckOutTime(LocalDateTime.now());
        repository.save(visitor);

        return CheckInOutDTO.builder()
                .visitId(visitor.getVisitId())
                .visitorName(visitor.getVisitorName())
                .governmentId(visitor.getGovernmentId())
                .checkInTime(visitor.getCheckInTime())
                .checkOutTime(visitor.getCheckOutTime())
                .status(visitor.getStatus().name())
                .build();
    }
}