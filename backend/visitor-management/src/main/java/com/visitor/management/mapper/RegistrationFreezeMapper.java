package com.visitor.management.mapper;

import com.visitor.management.dto.RegistrationFreezeDTO;
import com.visitor.management.entity.RegistrationFreeze;

import java.time.LocalDateTime;

public class RegistrationFreezeMapper {

    public static RegistrationFreeze toEntity(RegistrationFreezeDTO dto){

        return RegistrationFreeze.builder()

                .id(dto.getId())
                .freezeDate(dto.getFreezeDate())
                .reason(dto.getReason())
                .active(dto.getActive())
                .createdDate(LocalDateTime.now())

                .build();

    }

    public static RegistrationFreezeDTO toDTO(RegistrationFreeze entity){

        return RegistrationFreezeDTO.builder()

                .id(entity.getId())
                .freezeDate(entity.getFreezeDate())
                .reason(entity.getReason())
                .active(entity.getActive())

                .build();

    }

}