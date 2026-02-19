package com.example.internship.dto;

public class ScreeningReason {
    private String label;
    private String direction;
    private String detail;

    public ScreeningReason() {
    }

    public ScreeningReason(String label, String direction, String detail) {
        this.label = label;
        this.direction = direction;
        this.detail = detail;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }
}

