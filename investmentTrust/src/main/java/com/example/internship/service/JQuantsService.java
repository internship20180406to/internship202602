package com.example.internship.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class JQuantsService {

    private static final Logger log = LoggerFactory.getLogger(JQuantsService.class);

    private final Map<String, Map<String, String>> fundInfoMap = new LinkedHashMap<>();
    private final Map<String, Map<String, List<String>>> fundChartDataMap = new LinkedHashMap<>();

    private static final List<String> FUND_NAMES = List.of(
            "トヨタ自動車", "ソニーグループ", "任天堂", "ソフトバンクグループ"
    );

    @PostConstruct
    public void init() {
        loadDummyData();
        generateChartData();
        log.info("ダミーデータをロードしました: {}銘柄", fundInfoMap.size());
    }

    private void loadDummyData() {
        Map<String, String> toyota = new LinkedHashMap<>();
        toyota.put("basePrice", "2,850");
        toyota.put("changeRate", "+1.25");
        toyota.put("netAssets", "458.3");
        toyota.put("fee", "1.10");
        fundInfoMap.put("トヨタ自動車", toyota);

        Map<String, String> sony = new LinkedHashMap<>();
        sony.put("basePrice", "3,200");
        sony.put("changeRate", "-0.85");
        sony.put("netAssets", "312.7");
        sony.put("fee", "1.65");
        fundInfoMap.put("ソニーグループ", sony);

        Map<String, String> nintendo = new LinkedHashMap<>();
        nintendo.put("basePrice", "8,750");
        nintendo.put("changeRate", "+2.10");
        nintendo.put("netAssets", "187.5");
        nintendo.put("fee", "0.55");
        fundInfoMap.put("任天堂", nintendo);

        Map<String, String> softbank = new LinkedHashMap<>();
        softbank.put("basePrice", "9,500");
        softbank.put("changeRate", "-1.50");
        softbank.put("netAssets", "625.0");
        softbank.put("fee", "1.98");
        fundInfoMap.put("ソフトバンクグループ", softbank);
    }

    private void generateChartData() {
        fundChartDataMap.clear();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM/dd");
        Random rand = new Random(42);

        for (Map.Entry<String, Map<String, String>> entry : fundInfoMap.entrySet()) {
            String name = entry.getKey();
            String basePriceStr = entry.getValue().get("basePrice").replace(",", "");
            double basePrice = Double.parseDouble(basePriceStr);

            List<String> dates = new ArrayList<>();
            List<String> prices = new ArrayList<>();
            LocalDate today = LocalDate.now();

            double price = basePrice * 0.95;
            for (int i = 29; i >= 0; i--) {
                LocalDate date = today.minusDays(i);
                dates.add(date.format(fmt));
                price = price * (1 + (rand.nextDouble() * 0.04 - 0.02));
                prices.add(String.valueOf(Math.round(price)));
            }

            Map<String, List<String>> chartData = new LinkedHashMap<>();
            chartData.put("dates", dates);
            chartData.put("prices", prices);
            fundChartDataMap.put(name, chartData);
        }
    }

    public Map<String, Map<String, String>> getFundInfoMap() {
        return fundInfoMap;
    }

    public Map<String, Map<String, List<String>>> getFundChartDataMap() {
        return fundChartDataMap;
    }

    public List<String> getFundNameOptions() {
        return FUND_NAMES;
    }
}
