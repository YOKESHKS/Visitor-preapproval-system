package com.visitor.management.service.impl;

import com.visitor.management.dto.RegistrationFreezeDTO;
import com.visitor.management.entity.RegistrationFreeze;
import com.visitor.management.exception.ResourceNotFoundException;
import com.visitor.management.mapper.RegistrationFreezeMapper;
import com.visitor.management.repository.RegistrationFreezeRepository;
import com.visitor.management.service.RegistrationFreezeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationFreezeServiceImpl implements RegistrationFreezeService {

    private final RegistrationFreezeRepository repository;

    @Override
    public RegistrationFreezeDTO freezeDate(RegistrationFreezeDTO dto) {

        RegistrationFreeze freeze = RegistrationFreezeMapper.toEntity(dto);

        freeze.setActive(true);

        return RegistrationFreezeMapper.toDTO(repository.save(freeze));

    }

    @Override
    public RegistrationFreezeDTO unFreeze(Long id) {

        RegistrationFreeze freeze = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freeze Date Not Found"));

        freeze.setActive(false);

        return RegistrationFreezeMapper.toDTO(repository.save(freeze));

    }

    @Override
    public RegistrationFreezeDTO getFreeze(LocalDate date) {

        return RegistrationFreezeMapper.toDTO(

                repository.findByFreezeDate(date)

                        .orElseThrow(() -> new ResourceNotFoundException("Freeze Date Not Found"))

        );

    }

    @Override
    public List<RegistrationFreezeDTO> getAllFreezeDates() {

        return repository.findAll()

                .stream()

                .map(RegistrationFreezeMapper::toDTO)

                .collect(Collectors.toList());

    }

    @Override
    public boolean isDateFrozen(LocalDate date) {

        return repository.findByFreezeDate(date)

                .map(RegistrationFreeze::getActive)

                .orElse(false);

    }

}