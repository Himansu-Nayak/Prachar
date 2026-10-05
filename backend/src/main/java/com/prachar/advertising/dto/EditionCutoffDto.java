package com.prachar.advertising.dto;

import java.time.LocalDate;
import java.util.List;

public class EditionCutoffDto {
    private String currentTargetEdition;
    private LocalDate cutoffDate;
    private boolean cutoffPassed;
    private String nextAvailableEdition;
    private String message;
    private List<String> threeEditionSchedule;

    public EditionCutoffDto() {}

    public EditionCutoffDto(String currentTargetEdition, LocalDate cutoffDate, boolean cutoffPassed,
                            String nextAvailableEdition, String message, List<String> threeEditionSchedule) {
        this.currentTargetEdition = currentTargetEdition;
        this.cutoffDate = cutoffDate;
        this.cutoffPassed = cutoffPassed;
        this.nextAvailableEdition = nextAvailableEdition;
        this.message = message;
        this.threeEditionSchedule = threeEditionSchedule;
    }

    public String getCurrentTargetEdition() {
        return currentTargetEdition;
    }

    public void setCurrentTargetEdition(String currentTargetEdition) {
        this.currentTargetEdition = currentTargetEdition;
    }

    public LocalDate getCutoffDate() {
        return cutoffDate;
    }

    public void setCutoffDate(LocalDate cutoffDate) {
        this.cutoffDate = cutoffDate;
    }

    public boolean isCutoffPassed() {
        return cutoffPassed;
    }

    public void setCutoffPassed(boolean cutoffPassed) {
        this.cutoffPassed = cutoffPassed;
    }

    public String getNextAvailableEdition() {
        return nextAvailableEdition;
    }

    public void setNextAvailableEdition(String nextAvailableEdition) {
        this.nextAvailableEdition = nextAvailableEdition;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getThreeEditionSchedule() {
        return threeEditionSchedule;
    }

    public void setThreeEditionSchedule(List<String> threeEditionSchedule) {
        this.threeEditionSchedule = threeEditionSchedule;
    }
}
