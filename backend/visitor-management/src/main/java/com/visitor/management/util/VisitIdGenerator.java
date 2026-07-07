package com.visitor.management.util;

import org.springframework.stereotype.Component;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class VisitIdGenerator {

    private final AtomicInteger counter = new AtomicInteger(1);

    public String generateVisitId() {

        String date = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String number = new DecimalFormat("0000")
                .format(counter.getAndIncrement());

        return "VIS-" + date + "-" + number;

    }

}