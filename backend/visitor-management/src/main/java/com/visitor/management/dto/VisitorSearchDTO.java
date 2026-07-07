package com.visitor.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorSearchDTO {

    private String visitId;

    private String visitorName;

    private String companyName;

    private String governmentId;

    private String mobileNumber;

}