/* global bankBranchMap, selectedBranch, fundInfoMap, fundChartDataMap, Chart */

// 支店名の連動
const bankNameSelect = document.getElementById('bankName');
const branchNameSelect = document.getElementById('branchName');

function updateBranches() {
    const bank = bankNameSelect.value;
    branchNameSelect.innerHTML = '';
    if (!bank) {
        branchNameSelect.innerHTML = '<option value="">-- 金融機関を先に選択してください --</option>';
        return;
    }
    branchNameSelect.innerHTML = '<option value="">-- 選択してください --</option>';
    const branches = bankBranchMap[bank] || [];
    branches.forEach(function (branch) {
        const option = document.createElement('option');
        option.value = branch;
        option.text = branch;
        if (branch === selectedBranch) {
            option.selected = true;
        }
        branchNameSelect.appendChild(option);
    });
}

bankNameSelect.addEventListener('change', function () {
    updateBranches();
});

updateBranches();

// 口座履歴選択
const accountHistoryRows = document.querySelectorAll('.account-history-row');
const bankAccountTypeSelect = document.querySelector('select[name="bankAccountType"]');
const bankAccountNumInput = document.querySelector('input[name="bankAccountNum"]');
const nameInput = document.querySelector('input[name="name"]');

function applyAccountHistory(row) {
    const bank = row.getAttribute('data-bank');
    const branch = row.getAttribute('data-branch');
    const type = row.getAttribute('data-type');
    const num = row.getAttribute('data-num');
    const name = row.getAttribute('data-name');

    bankNameSelect.value = bank;
    updateBranches();
    branchNameSelect.value = branch;
    bankAccountTypeSelect.value = type;
    bankAccountNumInput.value = num;
    nameInput.value = name;
}

const accountHistoryToggle = document.getElementById('accountHistoryToggle');
const accountHistoryList = document.getElementById('accountHistoryList');
const accountHistorySelectedInfo = document.getElementById('accountHistorySelectedInfo');

if (accountHistoryToggle) {
    accountHistoryToggle.addEventListener('click', function() {
        const isOpen = this.classList.toggle('open');
        accountHistoryList.style.display = isOpen ? 'block' : 'none';
    });
}

accountHistoryRows.forEach(function(row) {
    row.addEventListener('click', function() {
        accountHistoryRows.forEach(r => r.classList.remove('selected'));
        this.classList.add('selected');
        applyAccountHistory(this);

        accountHistoryToggle.classList.remove('open');
        accountHistoryToggle.classList.add('has-selection');
        accountHistoryList.style.display = 'none';
        accountHistorySelectedInfo.innerHTML = '';
        this.querySelectorAll('span').forEach(function(span) {
            const s = document.createElement('span');
            s.textContent = span.textContent;
            accountHistorySelectedInfo.appendChild(s);
        });
    });
});

const moneyDisplay = document.getElementById('moneyDisplay');
const moneyHidden = document.getElementById('moneyHidden');

// 計算ロジック
const feeCalcCard = document.getElementById('feeCalcCard');
const calcMoney = document.getElementById('calcMoney');
const calcFeeRate = document.getElementById('calcFeeRate');
const calcFeeAmount = document.getElementById('calcFeeAmount');
const calcActual = document.getElementById('calcActual');

function updateFeeCalc() {
    const raw = moneyHidden.value;
    const fund = fundNameSelect.value;
    const info = fundInfoMap[fund];
    if (!raw || !info) {
        feeCalcCard.style.display = 'none';
        return;
    }
    const money = Number(raw);
    const feeRate = parseFloat(info.fee);
    const feeAmount = Math.floor(money * feeRate / 100);
    const actual = money - feeAmount;

    calcMoney.textContent = money.toLocaleString() + '円';
    calcFeeRate.textContent = feeRate + '%';
    calcFeeAmount.textContent = '-' + feeAmount.toLocaleString() + '円';
    calcActual.textContent = actual.toLocaleString() + '円';
    feeCalcCard.style.display = 'block';
}

moneyDisplay.addEventListener('input', function () {
    const raw = this.value.replace(/[^0-9]/g, '');
    moneyHidden.value = raw;
    if (raw) {
        this.value = Number(raw).toLocaleString();
    } else {
        this.value = '';
    }
    updateFeeCalc();
});

document.querySelector('input[type="reset"]').addEventListener('click', function () {
    setTimeout(function () {
        moneyDisplay.value = '';
        moneyHidden.value = '';
        bankNameSelect.value = '';
        updateBranches();
        fundNameSelect.value = '';
        fundInfoCard.style.display = 'none';
        feeCalcCard.style.display = 'none';
        chartControls.style.display = 'none';
        updateChart('');
        accountHistoryRows.forEach(r => r.classList.remove('selected'));
        if (accountHistoryToggle) {
            accountHistoryToggle.classList.remove('open', 'has-selection');
            accountHistoryList.style.display = 'none';
            accountHistorySelectedInfo.innerHTML = '';
        }
        chartPeriodBtns.forEach(b => b.classList.remove('active'));
        chartPeriodBtns[0].classList.add('active');
        currentPeriod = 6;
    }, 0);
});

// ファンド情報の動的表示
const fundNameSelect = document.getElementById('fundName');
const fundInfoCard = document.getElementById('fundInfoCard');
const stockChartContainer = document.getElementById('stockChartContainer');
const stockChartCanvas = document.getElementById('stockChart');
const chartControls = document.getElementById('chartControls');
const chartPeriodBtns = document.querySelectorAll('.chart-period-btn');
let stockChart = null;
let currentPeriod = 6;

chartPeriodBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        chartPeriodBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentPeriod = parseInt(this.getAttribute('data-period'));
        updateChart(fundNameSelect.value);
    });
});

function showFundInfo(fund) {
    const info = fundInfoMap[fund];
    if (info) {
        const basePrice = Number(String(info.basePrice).replace(/,/g, ''));
        const changeRate = parseFloat(info.changeRate);
        const prevClose = Math.round(basePrice / (1 + changeRate / 100));

        document.getElementById('fundBasePrice').textContent = basePrice.toLocaleString();

        const changeRateEl = document.getElementById('fundChangeRate');
        changeRateEl.textContent = (changeRate >= 0 ? '+' : '') + changeRate + '%';
        changeRateEl.className = 'fund-change-badge ' + (changeRate >= 0 ? 'positive' : 'negative');

        document.getElementById('fundPrevClose').textContent = prevClose.toLocaleString() + '円';
        document.getElementById('fundNetAssets').textContent = Number(String(info.netAssets).replace(/,/g, '')).toLocaleString() + '億円';
        document.getElementById('fundChangeRateMonth').textContent = (changeRate >= 0 ? '+' : '') + changeRate + '%';
        document.getElementById('fundFee').textContent = info.fee + '%';

        fundInfoCard.style.display = 'block';
    } else {
        fundInfoCard.style.display = 'none';
    }
    updateFeeCalc();
}

function updateChart(fund) {
    const chartData = fundChartDataMap[fund];
    if (!chartData) {
        stockChartContainer.style.display = 'none';
        chartControls.style.display = 'none';
        if (stockChart) {
            stockChart.destroy();
            stockChart = null;
        }
        return;
    }

    const tradingDaysPerMonth = 21;
    const pointCount = currentPeriod * tradingDaysPerMonth;
    const dates = chartData.dates.slice(-pointCount);
    const prices = chartData.prices.slice(-pointCount).map(Number);

    chartControls.style.display = 'flex';
    stockChartContainer.style.display = 'block';
    if (stockChart) {
        stockChart.destroy();
    }

    // 終値からOHLCを擬似生成（"MM/dd" → "YYYY-MM-dd" に年を補完）
    const currentYear = new Date().getFullYear();
    const ohlcData = dates.map(function(date, i) {
        const c = prices[i];
        const prev = i > 0 ? prices[i - 1] : c;
        const o = prev + (Math.random() - 0.5) * prev * 0.004;
        const range = Math.abs(c - o) + c * 0.002;
        const h = Math.max(o, c) + Math.random() * range * 0.8;
        const l = Math.min(o, c) - Math.random() * range * 0.8;
        return {
            x: new Date(currentYear + '-' + date.replace('/', '-')).getTime(),
            o: Math.round(o * 10) / 10,
            h: Math.round(h * 10) / 10,
            l: Math.round(l * 10) / 10,
            c: c
        };
    });

    stockChart = new Chart(stockChartCanvas, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: fund,
                data: ohlcData,
                color: {
                    up: '#00B53C',
                    down: '#dc2626',
                    unchanged: '#888888'
                }
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            const d = context.raw;
                            return [
                                '始値: ' + d.o.toLocaleString() + '円',
                                '高値: ' + d.h.toLocaleString() + '円',
                                '安値: ' + d.l.toLocaleString() + '円',
                                '終値: ' + d.c.toLocaleString() + '円'
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'timeseries',
                    time: { unit: 'month' },
                    ticks: { maxTicksLimit: 8, font: { size: 11 }, color: '#888' },
                    grid: { display: false, drawBorder: false }
                },
                y: {
                    position: 'right',
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        },
                        font: { size: 11 },
                        color: '#888'
                    },
                    grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false }
                }
            }
        }
    });
}

fundNameSelect.addEventListener('change', function () {
    const fund = this.value;
    showFundInfo(fund);
    updateChart(fund);
});

// 値の復元と再計算（初期表示・history.back()両対応）
function restoreState() {
    const fund = fundNameSelect.value;
    showFundInfo(fund);
    updateChart(fund);

    const rawMoney = moneyDisplay.value.replace(/[^0-9]/g, '');
    if (rawMoney) {
        moneyHidden.value = rawMoney;
    }
    updateFeeCalc();
}

restoreState();

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        restoreState();
    }
});