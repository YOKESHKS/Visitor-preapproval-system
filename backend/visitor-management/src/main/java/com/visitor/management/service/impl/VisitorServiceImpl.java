package com.visitor.management.service.impl;

import com.visitor.management.dto.VisitorDTO;
import com.visitor.management.entity.Visitor;
import com.visitor.management.enums.VisitorStatus;
import com.visitor.management.exception.ResourceNotFoundException;
import com.visitor.management.mapper.VisitorMapper;
import com.visitor.management.repository.VisitorRepository;
import com.visitor.management.service.QRCodeService;
import com.visitor.management.service.RegistrationFreezeService;
import com.visitor.management.service.VisitorService;
import com.visitor.management.util.VisitIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitorServiceImpl implements VisitorService {

    private final VisitorRepository repository;
    private final QRCodeService qrCodeService;
    private final RegistrationFreezeService registrationFreezeService;
    private final VisitIdGenerator visitIdGenerator;

    @Override
    public VisitorDTO registerVisitor(VisitorDTO dto) {

        if (registrationFreezeService.isDateFrozen(dto.getVisitDate())) {
            throw new RuntimeException("Visitor registration is closed for selected date.");
        }

        if (repository.existsByGovernmentId(dto.getGovernmentId())) {
            throw new RuntimeException("Government ID already exists.");
        }

        LocalDate today = LocalDate.now();

        if (dto.getVisitDate().isBefore(today)) {
            throw new RuntimeException("Visit date cannot be in the past.");
        }

        if (dto.getVisitDate().isAfter(today.plusDays(2))) {
            throw new RuntimeException("Visitor can be registered only 2 days in advance.");
        }

        if (dto.getExpectedOutTime().isBefore(dto.getExpectedInTime())) {
            throw new RuntimeException("Expected Out Time must be after Expected In Time.");
        }

        Visitor visitor = VisitorMapper.toEntity(dto);

        visitor.setVisitId(visitIdGenerator.generateVisitId());
        visitor.setStatus(VisitorStatus.REGISTERED);
        visitor.setCancelled(false);
        visitor.setActive(true);
        visitor.setCreatedDate(LocalDateTime.now());

        Visitor savedVisitor = repository.save(visitor);

        String qrPath = qrCodeService.generate(savedVisitor.getVisitId());

        savedVisitor.setQrPath(qrPath);

        savedVisitor = repository.save(savedVisitor);

        return VisitorMapper.toDTO(savedVisitor);
    }

    @Override
    public VisitorDTO updateVisitor(Long id, VisitorDTO dto) {

        Visitor visitor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Not Found"));

        if (visitor.getStatus() != VisitorStatus.REGISTERED) {
            throw new RuntimeException("Visitor cannot be modified after Check-In.");
        }

        visitor.setVisitorName(dto.getVisitorName());
        visitor.setCompanyName(dto.getCompanyName());
        visitor.setGovernmentId(dto.getGovernmentId());
        visitor.setMobileNumber(dto.getMobileNumber());
        visitor.setEmail(dto.getEmail());
        visitor.setPurpose(dto.getPurpose());
        visitor.setVisitDate(dto.getVisitDate());
        visitor.setExpectedInTime(dto.getExpectedInTime());
        visitor.setExpectedOutTime(dto.getExpectedOutTime());
        visitor.setNumberOfVisitors(dto.getNumberOfVisitors());
        visitor.setRemarks(dto.getRemarks());

        return VisitorMapper.toDTO(repository.save(visitor));
    }

    @Override
    public VisitorDTO getVisitorById(Long id) {

        Visitor visitor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Not Found"));

        return VisitorMapper.toDTO(visitor);
    }

    @Override
    public VisitorDTO getVisitorByVisitId(String visitId) {

        Visitor visitor = repository.findByVisitId(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Not Found"));

        return VisitorMapper.toDTO(visitor);
    }

    @Override
    public List<VisitorDTO> getAllVisitors() {

        return repository.findAll()
                .stream()
                .map(VisitorMapper::toDTO)
                .collect(Collectors.toList());

    }

    @Override
    public List<VisitorDTO> getVisitorsByEmployee(String employeeId) {

        return repository.findByHostEmployeeId(employeeId)
                .stream()
                .map(VisitorMapper::toDTO)
                .collect(Collectors.toList());

    }

    @Override
    public List<VisitorDTO> getTodayVisitors() {

        return repository.findByVisitDate(LocalDate.now())
                .stream()
                .map(VisitorMapper::toDTO)
                .collect(Collectors.toList());

    }

    @Override
    public VisitorDTO cancelVisitor(Long id) {

        Visitor visitor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Not Found"));

        if (visitor.getStatus() == VisitorStatus.CHECKED_IN) {
            throw new RuntimeException("Checked-In visitor cannot be cancelled.");
        }

        visitor.setCancelled(true);
        visitor.setStatus(VisitorStatus.CANCELLED);

        return VisitorMapper.toDTO(repository.save(visitor));

    }

    @Override
    public VisitorDTO checkInVisitor(String visitId) {

        Visitor visitor = repository.findByVisitId(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Not Found"));

        if (visitor.getStatus() != VisitorStatus.REGISTERED) {
            throw new RuntimeException("Visitor already checked in.");
        }

        visitor.setStatus(VisitorStatus.CHECKED_IN);
        visitor.setCheckInTime(LocalDateTime.now());

        return VisitorMapper.toDTO(repository.save(visitor));

    }

    @Override
    public VisitorDTO checkOutVisitor(String visitId) {

        Visitor visitor = repository.findByVisitId(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor Not Found"));

        if (visitor.getStatus() != VisitorStatus.CHECKED_IN) {
            throw new RuntimeException("Visitor has not checked in.");
        }

        visitor.setStatus(VisitorStatus.CHECKED_OUT);
        visitor.setCheckOutTime(LocalDateTime.now());

        return VisitorMapper.toDTO(repository.save(visitor));

    }

}