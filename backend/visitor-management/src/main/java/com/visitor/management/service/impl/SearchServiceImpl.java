package com.visitor.management.service.impl;

import com.visitor.management.dto.VisitorDTO;
import com.visitor.management.entity.Visitor;
import com.visitor.management.exception.ResourceNotFoundException;
import com.visitor.management.mapper.VisitorMapper;
import com.visitor.management.repository.VisitorRepository;
import com.visitor.management.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final VisitorRepository repository;

    @Override
    public VisitorDTO searchByVisitId(String visitId) {

        Visitor visitor = repository.findByVisitId(visitId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Visitor Not Found"));

        return VisitorMapper.toDTO(visitor);

    }

    @Override
    public List<VisitorDTO> getActiveVisitors() {

        return repository.findByActiveTrue()

                .stream()

                .map(VisitorMapper::toDTO)

                .collect(Collectors.toList());

    }

    @Override
    public List<VisitorDTO> getCancelledVisitors() {

        return repository.findByCancelledFalse()

                .stream()

                .filter(v -> Boolean.TRUE.equals(v.getCancelled()))

                .map(VisitorMapper::toDTO)

                .collect(Collectors.toList());

    }

}