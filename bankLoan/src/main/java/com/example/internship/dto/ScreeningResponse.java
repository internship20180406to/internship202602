package com.example.internship.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ScreeningResponse {
    private String result;
    private BigDecimal score;
    private BigDecimal threshold;
    private String modelVersion;
    private List<ScreeningReason> reasons;
    private boolean fallback;

    public ScreeningResponse() {
    }

    public static ScreeningResponse fallback(String message) {
        ScreeningResponse response = new ScreeningResponse();
        response.setResult("要確認");
        response.setScore(BigDecimal.ZERO);
        response.setThreshold(BigDecimal.ONE);
        response.setModelVersion("unavailable");
        List<ScreeningReason> reasonList = new ArrayList<>();
        reasonList.add(new ScreeningReason("システム", "negative", message));
        response.setReasons(reasonList);
        response.setFallback(true);
        return response;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public BigDecimal getThreshold() {
        return threshold;
    }

    public void setThreshold(BigDecimal threshold) {
        this.threshold = threshold;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public List<ScreeningReason> getReasons() {
        return reasons;
    }

    public void setReasons(List<ScreeningReason> reasons) {
        this.reasons = reasons;
    }

    public boolean isFallback() {
        return fallback;
    }

    public void setFallback(boolean fallback) {
        this.fallback = fallback;
    }
}

