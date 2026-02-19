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
    updateSidebarAccount();
    updateSidebarHistory();
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
const calcUnits = document.getElementById('calcUnits');
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
    const basePrice = Number(String(info.basePrice).replace(/,/g, ''));
    const feeRate = parseFloat(info.fee);
    const units = Math.floor(money / basePrice * 10000);
    const feeAmount = Math.floor(money * feeRate / 100);
    const actual = money + feeAmount;

    calcMoney.textContent = money.toLocaleString() + '円';
    calcUnits.textContent = units.toLocaleString() + '口';
    calcFeeRate.textContent = feeRate + '%';
    calcFeeAmount.textContent = '+' + feeAmount.toLocaleString() + '円';
    calcActual.textContent = actual.toLocaleString() + '円';
    feeCalcCard.style.display = 'block';
    updateSidebarSim(actual);
}

// サイドバー
const sidebarBank = document.getElementById('sidebarBank');
const sidebarName = document.getElementById('sidebarName');
const sidebarBalance = document.getElementById('sidebarBalance');
const sidebarSimCard = document.getElementById('sidebarSimCard');
const sidebarTotal = document.getElementById('sidebarTotal');
const sidebarAfterBalance = document.getElementById('sidebarAfterBalance');
const sidebarChartCard = document.getElementById('sidebarChartCard');
let assetPieChart = null;

function updateSidebarAccount() {
    const bank = bankNameSelect.value;
    const name = nameInput.value;
    const num = parseInt(bankAccountNumInput.value);

    sidebarBank.textContent = bank || '-';
    sidebarName.textContent = name || '購入者名';

    if (bankAccountNumInput.value.length === 7 && !isNaN(num)) {
        const balance = balanceMap[num];
        if (balance !== undefined) {
            sidebarBalance.textContent = Number(balance).toLocaleString() + '円';
            sidebarBalance.style.color = '';
        } else {
            sidebarBalance.textContent = '口座が見つかりません';
            sidebarBalance.style.color = '#dc2626';
        }
    } else {
        sidebarBalance.textContent = '-';
        sidebarBalance.style.color = '';
    }
}

function updateSidebarSim(total) {
    const num = parseInt(bankAccountNumInput.value);
    const balance = balanceMap[num];
    if (balance === undefined) {
        sidebarSimCard.style.display = 'none';
        return;
    }
    const after = balance - total;
    sidebarTotal.textContent = total.toLocaleString() + '円';
    sidebarAfterBalance.textContent = after.toLocaleString() + '円';
    sidebarAfterBalance.style.color = after < 0 ? '#dc2626' : '#16a34a';
    sidebarSimCard.style.display = 'block';
    updateAssetChart(total, after);
}

const FUND_COLORS = ['#4579FF', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#F97316'];
const CASH_COLOR = '#CBD5E1';

function updateAssetChart(currentTotal, remainingCash) {
    if (remainingCash < 0) {
        sidebarChartCard.style.display = 'none';
        return;
    }
    sidebarChartCard.style.display = 'block';

    const num = parseInt(bankAccountNumInput.value);
    const currentFund = fundNameSelect.value;

    // 過去の投資を銘柄別に集計
    const fundTotals = {};
    if (!isNaN(num)) {
        orderHistory
            .filter(o => Number(o.bankAccountNum) === num)
            .forEach(o => {
                fundTotals[o.fundName] = (fundTotals[o.fundName] || 0) + Number(o.money);
            });
    }
    // 今回の投資を加算
    if (currentFund && currentTotal > 0) {
        fundTotals[currentFund] = (fundTotals[currentFund] || 0) + currentTotal;
    }

    const fundNames = Object.keys(fundTotals);
    const fundAmounts = Object.values(fundTotals);
    const totalInvested = fundAmounts.reduce((a, b) => a + b, 0);
    const grandTotal = totalInvested + remainingCash;

    const labels = [...fundNames, '現金残高'];
    const data = [...fundAmounts, remainingCash];
    const bgColors = [...fundNames.map((_, i) => FUND_COLORS[i % FUND_COLORS.length]), CASH_COLOR];

    // 比率バー更新
    const investPct = ((totalInvested / grandTotal) * 100).toFixed(1);
    const cashPct = ((remainingCash / grandTotal) * 100).toFixed(1);
    document.getElementById('assetInvestPct').textContent = '投資 ' + investPct + '%';
    document.getElementById('assetCashPct').textContent = '現金 ' + cashPct + '%';
    const bar = document.getElementById('assetRatioBar');
    bar.innerHTML = fundNames.map((name, i) => {
        const pct = ((fundTotals[name] / grandTotal) * 100).toFixed(1);
        return `<div style="width:${pct}%;background:${FUND_COLORS[i % FUND_COLORS.length]};height:100%"></div>`;
    }).join('') + `<div style="width:${cashPct}%;background:${CASH_COLOR};height:100%"></div>`;

    // 内訳リスト更新
    const breakdown = document.getElementById('assetBreakdown');
    breakdown.innerHTML = [...fundNames.map((name, i) => {
        const pct = ((fundTotals[name] / grandTotal) * 100).toFixed(1);
        return `<div class="asset-breakdown-row">
            <span class="asset-dot" style="background:${FUND_COLORS[i % FUND_COLORS.length]}"></span>
            <span class="asset-breakdown-name">${name}</span>
            <span class="asset-breakdown-right">
                <span class="asset-breakdown-pct">${pct}%</span>
                <span class="asset-breakdown-amt">${fundTotals[name].toLocaleString()}円</span>
            </span>
        </div>`;
    }), `<div class="asset-breakdown-row">
        <span class="asset-dot" style="background:${CASH_COLOR}"></span>
        <span class="asset-breakdown-name">現金残高</span>
        <span class="asset-breakdown-right">
            <span class="asset-breakdown-pct">${cashPct}%</span>
            <span class="asset-breakdown-amt">${remainingCash.toLocaleString()}円</span>
        </span>
    </div>`].join('');

    // グラフ更新
    if (assetPieChart) {
        assetPieChart.data.labels = labels;
        assetPieChart.data.datasets[0].data = data;
        assetPieChart.data.datasets[0].backgroundColor = bgColors;
        assetPieChart.update();
        return;
    }

    const ctx = document.getElementById('assetPieChart').getContext('2d');
    assetPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: bgColors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((context.raw / total) * 100).toFixed(1);
                            return context.label + ': ' + Number(context.raw).toLocaleString() + '円 (' + pct + '%)';
                        }
                    }
                }
            }
        }
    });
}

function updateSidebarHistory() {
    const num = parseInt(bankAccountNumInput.value);
    const historyCard = document.getElementById('sidebarHistoryCard');
    const historyList = document.getElementById('sidebarHistoryList');

    if (isNaN(num) || bankAccountNumInput.value.length !== 7) {
        historyCard.style.display = 'none';
        return;
    }

    const filtered = orderHistory
        .filter(o => Number(o.bankAccountNum) === num)
        .slice(0, 5);

    if (filtered.length === 0) {
        historyCard.style.display = 'none';
        return;
    }

    historyList.innerHTML = filtered.map(o => {
        const date = new Date(o.orderDateTime).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
        return `<div class="sidebar-history-row">
            <span class="sidebar-history-fund">${o.fundName}</span>
            <span class="sidebar-history-meta">
                <span class="sidebar-history-amount">${Number(o.money).toLocaleString()}円</span>
                <span class="sidebar-history-date">${date}</span>
            </span>
        </div>`;
    }).join('');

    historyCard.style.display = 'block';
}

bankNameSelect.addEventListener('change', updateSidebarAccount);
bankAccountNumInput.addEventListener('input', function() {
    updateSidebarAccount();
    updateSidebarHistory();
    updateFeeCalc();
});
nameInput.addEventListener('input', updateSidebarAccount);

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

// 詳しくモード
let detailMode = false;
const detailModeToggle = document.getElementById('detailModeToggle');
const detailRows = document.querySelectorAll('[data-detail]');

detailModeToggle.addEventListener('change', function () {
    detailMode = this.checked;
    detailRows.forEach(el => { el.style.display = detailMode ? '' : 'none'; });
    const fund = document.getElementById('fundName').value;
    if (fund) {
        showFundInfo(fund);
        updateChart(fund);
    }
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

        // ラベル切り替え
        document.getElementById('labelChangeRateMonth').textContent = detailMode ? 'トータルリターン(1M)' : '騰落率(1ヶ月)';
        document.getElementById('labelFee').textContent = detailMode ? '信託報酬率(税込)' : '手数料';

        // 詳しくモード専用のダミー値
        if (detailMode) {
            const seed = Math.abs(parseFloat(info.changeRate)) || 1;
            document.getElementById('fundSharpe').textContent = (0.8 + seed * 0.12).toFixed(2);
            document.getElementById('fundStddev').textContent = (11.5 + seed * 0.6).toFixed(1) + '%';
            document.getElementById('fundBeta').textContent = (0.82 + seed * 0.025).toFixed(2);
            document.getElementById('fundMaxDD').textContent = '-' + (14.5 + seed * 0.9).toFixed(1) + '%';
        }

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

    const calendarDaysPerMonth = 30;
    const pointCount = currentPeriod * calendarDaysPerMonth;
    const dates = chartData.dates.slice(-pointCount);
    const prices = chartData.prices.slice(-pointCount).map(Number);

    chartControls.style.display = 'flex';
    stockChartContainer.style.display = 'block';
    if (stockChart) {
        stockChart.destroy();
    }

    // 移動平均線の計算
    function calcMA(period) {
        return prices.map(function(_, i) {
            if (i < period - 1) return { x: new Date(dates[i]).getTime(), y: null };
            const sum = prices.slice(i - period + 1, i + 1).reduce(function(a, b) { return a + b; }, 0);
            return { x: new Date(dates[i]).getTime(), y: Math.round(sum / period * 10) / 10 };
        });
    }

    // 終値からOHLCを擬似生成（日付は "yyyy-MM-dd" 形式）
    const ohlcData = dates.map(function(date, i) {
        const c = prices[i];
        const prev = i > 0 ? prices[i - 1] : c;
        const o = prev + (Math.random() - 0.5) * prev * 0.004;
        const range = Math.abs(c - o) + c * 0.002;
        const h = Math.max(o, c) + Math.random() * range * 0.8;
        const l = Math.min(o, c) - Math.random() * range * 0.8;
        return {
            x: new Date(date).getTime(),
            o: Math.round(o * 10) / 10,
            h: Math.round(h * 10) / 10,
            l: Math.round(l * 10) / 10,
            c: c
        };
    });

    const datasets = [{
        label: fund,
        data: ohlcData,
        color: { up: '#00B53C', down: '#dc2626', unchanged: '#888888' }
    }];

    if (detailMode) {
        datasets.push({
            type: 'line',
            label: 'MA25',
            data: calcMA(25),
            borderColor: '#F59E0B',
            borderWidth: 1.5,
            pointRadius: 0,
            spanGaps: true,
            fill: false,
            yAxisID: 'y'
        });
        datasets.push({
            type: 'line',
            label: 'MA75',
            data: calcMA(75),
            borderColor: '#8B5CF6',
            borderWidth: 1.5,
            pointRadius: 0,
            spanGaps: true,
            fill: false,
            yAxisID: 'y'
        });
    }

    stockChart = new Chart(stockChartCanvas, {
        type: 'candlestick',
        data: { datasets },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: detailMode,
                    labels: { font: { size: 11 }, boxWidth: 20 }
                },
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
                    position: 'left',
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

// ニュースティッカー
(function initTicker() {
    const items = [];

    Object.entries(fundInfoMap).forEach(function([name, info]) {
        const rate = parseFloat(info.changeRate);
        if (rate >= 2) {
            items.push({ text: '📈 ' + name + '  前日比 +' + rate + '%  急騰中', color: '#16a34a' });
        } else if (rate <= -2) {
            items.push({ text: '📉 ' + name + '  前日比 ' + rate + '%  急落中', color: '#dc2626' });
        } else if (rate > 0) {
            items.push({ text: '▲ ' + name + '  前日比 +' + rate + '%', color: '#15803d' });
        } else {
            items.push({ text: '▼ ' + name + '  前日比 ' + rate + '%', color: '#b91c1c' });
        }
    });

    const dummyNews = [
        { text: '📰 日経平均株価  前日比 +0.62%  続伸', color: '#16a34a' },
        { text: '🌐 米FRB 政策金利据え置きを発表', color: '#374151' },
        { text: '💴 円相場  1ドル＝148円台  小幅上昇', color: '#374151' },
        { text: '🏦 国内投資信託  今月の資金流入  過去最高水準に', color: '#4579FF' },
        { text: '📊 新興国株式ファンド  今週の平均騰落率 +1.8%', color: '#15803d' },
    ];

    const allItems = [...items, ...dummyNews];
    const sep = '<span class="ticker-sep">  ｜  </span>';
    const html = allItems.map(function(item) {
        return '<span class="ticker-item" style="color:' + item.color + '">' + item.text + '</span>' + sep;
    }).join('');

    const el = document.getElementById('tickerContent');
    el.innerHTML = html + html;

    // コンテンツ幅に合わせてアニメーション速度を調整（約80px/秒）
    const duration = (el.scrollWidth / 2) / 40;
    el.style.animationDuration = duration + 's';
})();

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        restoreState();
    }
});