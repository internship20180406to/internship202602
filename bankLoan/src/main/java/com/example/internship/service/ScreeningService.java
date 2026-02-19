package com.example.internship.service;

import com.example.internship.dto.ScreeningRequest;
import com.example.internship.dto.ScreeningResponse;
import com.example.internship.entity.BankLoanForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ScreeningService {
    private static final Logger logger = LoggerFactory.getLogger(ScreeningService.class);

    private final RestClient restClient;
    private final String screeningPath;

    public ScreeningService(
            @Value("${screening.api.base-url}") String baseUrl,
            @Value("${screening.api.path:/screening}") String screeningPath) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.screeningPath = screeningPath;
    }

    public ScreeningResponse screen(BankLoanForm form) {
        ScreeningRequest request = ScreeningRequest.from(form);
        try {
            ScreeningResponse response = restClient.post()
                    .uri(screeningPath)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(ScreeningResponse.class);
            if (response == null) {
                return ScreeningResponse.fallback("審査結果を取得できませんでした。");
            }
            return response;
        } catch (Exception e) {
            logger.warn("Screening API call failed: {}", e.getMessage());
            return ScreeningResponse.fallback("外部審査サービスに接続できませんでした。");
        }
    }
}

