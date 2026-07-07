package com.visitor.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckInOutDTO {

    private String visitId;

    private String visitorName;

    private String governmentId;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private String status;

}