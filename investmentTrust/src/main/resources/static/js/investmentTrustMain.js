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

        // リストを閉じてヘッダーに選択内容を表示
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
        updateChart('');
        accountHistoryRows.forEach(r => r.classList.remove('selected'));
        if (accountHistoryToggle) {
            accountHistoryToggle.classList.remove('open', 'has-selection');
            accountHistoryList.style.display = 'none';
            accountHistorySelectedInfo.innerHTML = '';
        }
    }, 0);
});

// ファンド情報の動的表示
const fundNameSelect = document.getElementById('fundName');
const fundInfoCard = document.getElementById('fundInfoCard');
const fundBasePrice = document.getElementById('fundBasePrice');
const fundChangeRate = document.getElementById('fundChangeRate');
const fundNetAssets = document.getElementById('fundNetAssets');
const fundFee = document.getElementById('fundFee');
const stockChartContainer = document.getElementById('stockChartContainer');
const stockChartCanvas = document.getElementById('stockChart');
let stockChart = null;

function showFundInfo(fund) {
    const info = fundInfoMap[fund];
    if (info) {
        fundBasePrice.textContent = info.basePrice + '円';
        fundChangeRate.textContent = info.changeRate + '%';
        const rate = parseFloat(info.changeRate);
        fundChangeRate.style.color = rate >= 0 ? '#00B53C' : '#dc2626';
        fundNetAssets.textContent = info.netAssets + '億円';
        fundFee.textContent = info.fee + '%';
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
        if (stockChart) {
            stockChart.destroy();
            stockChart = null;
        }
        return;
    }
    stockChartContainer.style.display = 'block';
    if (stockChart) {
        stockChart.destroy();
    }
    stockChart = new Chart(stockChartCanvas, {
        type: 'line',
        data: {
            labels: chartData.dates,
            datasets: [{
                label: fund + ' 株価推移',
                data: chartData.prices.map(Number),
                borderColor: '#4579FF',
                backgroundColor: 'rgba(69, 121, 255, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return Number(context.raw).toLocaleString() + '円';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { maxTicksLimit: 10 }
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
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

// 値の復元と再計算（初期表示・history.back()両対応）まだ修正できていない
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