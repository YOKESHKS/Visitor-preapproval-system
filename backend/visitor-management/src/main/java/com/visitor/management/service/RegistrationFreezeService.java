package com.visitor.management.service;

import com.visitor.management.dto.RegistrationFreezeDTO;

import java.time.LocalDate;
import java.util.List;

public interface RegistrationFreezeService {

    RegistrationFreezeDTO freezeDate(RegistrationFreezeDTO dto);

    RegistrationFreezeDTO unFreeze(Long id);

    RegistrationFreezeDTO getFreeze(LocalDate date);

    List<RegistrationFreezeDTO> getAllFreezeDates();

    boolean isDateFrozen(LocalDate date);

}