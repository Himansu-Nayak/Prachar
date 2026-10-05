package com.prachar.advertising;

import com.prachar.advertising.dto.EditionCutoffDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class EditionCutoffService {

    public static final int CUTOFF_DAY_OF_MONTH = 18;
    private static final ZoneId ODISHA_ZONE = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter EDITION_FORMATTER = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH);

    public EditionCutoffDto getCurrentCutoffDetails() {
        return evaluateCutoff(LocalDate.now(ODISHA_ZONE));
    }

    public EditionCutoffDto evaluateCutoff(LocalDate referenceDate) {
        if (referenceDate == null) {
            referenceDate = LocalDate.now(ODISHA_ZONE);
        }

        int day = referenceDate.getDayOfMonth();
        boolean cutoffPassed = day > CUTOFF_DAY_OF_MONTH;

        LocalDate targetMonthDate;
        LocalDate cutoffDate;
        String message;

        if (!cutoffPassed) {
            targetMonthDate = referenceDate;
            cutoffDate = LocalDate.of(referenceDate.getYear(), referenceDate.getMonth(), CUTOFF_DAY_OF_MONTH);
            message = String.format("Current cutoff is %d %s. Your advertisement will be published in the upcoming %s edition.",
                    CUTOFF_DAY_OF_MONTH,
                    referenceDate.getMonth().name().substring(0, 1) + referenceDate.getMonth().name().substring(1).toLowerCase(),
                    targetMonthDate.format(EDITION_FORMATTER));
        } else {
            targetMonthDate = referenceDate.plusMonths(1);
            cutoffDate = LocalDate.of(targetMonthDate.getYear(), targetMonthDate.getMonth(), CUTOFF_DAY_OF_MONTH);
            message = String.format("The 18th cutoff for the %s edition has passed. Your advertisement is automatically assigned to the %s edition.",
                    referenceDate.format(EDITION_FORMATTER),
                    targetMonthDate.format(EDITION_FORMATTER));
        }

        String targetEdition = targetMonthDate.format(EDITION_FORMATTER);
        String nextAvailableEdition = targetEdition;

        List<String> threeEditionSchedule = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            threeEditionSchedule.add(targetMonthDate.plusMonths(i).format(EDITION_FORMATTER));
        }

        return new EditionCutoffDto(
                targetEdition,
                cutoffDate,
                cutoffPassed,
                nextAvailableEdition,
                message,
                threeEditionSchedule
        );
    }
}
