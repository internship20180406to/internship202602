// 数値をカンマ区切りでフォーマットする関数
// (moved to bankLoanFormatters.js)

// 返済シミュレーション関数は bankLoanRepayment.js に移動


// 支店UI関連の関数は bankLoanBranchUi.js に移動

// フォーム/バリデーション関連の関数は bankLoanForm.js / bankLoanValidation.js に移動

// 確認画面の申込ボタンの処理
const submitButton = document.getElementById("submitButton");
if (submitButton) {
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        // ダイアログを表示
        const userConfirmed = confirm("ローンを申し込みます。よろしいですか？");

        if (userConfirmed) {
            // OKが押された場合、データを保存してから完了画面へ遷移
            const params = new URLSearchParams();
            params.append('bankName', document.getElementById('bankName').value);
            params.append('branchName', document.getElementById('branchName').value);
            params.append('bankAccountType', document.getElementById('bankAccountType').value);
            params.append('bankAccountNum', document.getElementById('bankAccountNum').value);
            params.append('name', document.getElementById('applicantName').value);
            params.append('loanType', document.getElementById('loanType').value);
            // カンマを除去して数値のみを送信
            params.append('loanAmount', document.getElementById('loanAmount').value.replace(/,/g, ''));
            params.append('annualIncome', document.getElementById('annualIncome').value.replace(/,/g, ''));
            params.append('loanPeriod', document.getElementById('loanPeriod').value);
            params.append('interestRate', document.getElementById('interestRate').value);

            // データを保存
            const savePromise = bankLoanApi ? bankLoanApi.saveBankLoan(params) : fetch('/saveBankLoan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            savePromise
            .then(response => {
                if (!response.ok) {
                    throw new Error('サーバーエラー: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // 保存成功後、完了画面へ遷移
                    window.location.href = '/bankLoanCompletion';
                } else {
                    alert('データの保存に失敗しました。');
                }
            })
            .catch(error => {
                console.error('エラー:', error);
                alert('データの保存中にエラーが発生しました: ' + error.message);
            });
        }
        // キャンセルが押された場合は何もせず、確認画面に留まる
    });
}

const editButton = document.getElementById('editButton');
if (editButton) {
    editButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof window.saveFormDataToSessionStorage === 'function') {
            window.saveFormDataToSessionStorage();
        } else {
            const fallbackData = {
                bankName: readInputValue('bankName'),
                branchName: readInputValue('branchName'),
                bankAccountType: readInputValue('bankAccountType'),
                bankAccountNum: readInputValue('bankAccountNum'),
                name: readInputValue('applicantName'),
                loanType: readInputValue('loanType'),
                loanAmount: readInputValue('loanAmount'),
                annualIncome: readInputValue('annualIncome'),
                loanPeriod: readInputValue('loanPeriod')
            };
            sessionStorage.setItem('bankLoanFormData', JSON.stringify(fallbackData));
        }
        window.location.href = '/bankLoan';
    });
}

function readInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function toNumber(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const normalized = String(value).replace(/,/g, '').trim();
    const num = Number(normalized);
    return Number.isNaN(num) ? null : num;
}

function renderScreeningResult(result) {
    const statusEl = document.getElementById('screeningStatus');
    const scoreEl = document.getElementById('screeningScore');
    const reasonsEl = document.getElementById('screeningReasons');

    if (!statusEl || !scoreEl || !reasonsEl) {
        return;
    }

    const decisionRaw = (result && (result.decision || result.result || result.judgement)) || '要確認';
    const decision = String(decisionRaw).trim();
    const score = result && (result.score || result.screeningScore || result.riskScore);
    const reasons = result && (result.reasons || result.reason || result.explanations || []);

    statusEl.textContent = decision;
    statusEl.classList.remove('pass', 'review');
    if (decision === '通過') {
        statusEl.classList.add('pass');
    } else {
        statusEl.classList.add('review');
    }

    scoreEl.textContent = score !== undefined && score !== null ? score : '-';

    reasonsEl.innerHTML = '';
    const reasonList = Array.isArray(reasons) ? reasons : [reasons];
    if (reasonList.length === 0 || !reasonList[0]) {
        const li = document.createElement('li');
        li.textContent = '根拠の詳細がありません。';
        reasonsEl.appendChild(li);
        return;
    }

    reasonList.forEach(function(item) {
        if (!item) {
            return;
        }
        const li = document.createElement('li');
        if (typeof item === 'object') {
            const label = item.label ? String(item.label) : '';
            const detail = item.detail ? String(item.detail) : '';
            const direction = item.direction ? String(item.direction) : '';
            const mark = document.createElement('span');
            mark.classList.add('screening-reason-mark');
            if (direction === 'positive') {
                mark.textContent = '◎';
            } else if (direction === 'negative') {
                mark.textContent = '×';
            } else {
                mark.textContent = '・';
            }
            li.appendChild(mark);
            if (label && detail) {
                li.appendChild(document.createTextNode(label + '・・・' + detail));
            } else if (label) {
                li.appendChild(document.createTextNode(label));
            } else if (detail) {
                li.appendChild(document.createTextNode(detail));
            } else {
                li.appendChild(document.createTextNode(JSON.stringify(item)));
            }
        } else {
            li.textContent = String(item);
        }
        reasonsEl.appendChild(li);
    });
}

function renderScreeningError(message) {
    const statusEl = document.getElementById('screeningStatus');
    const scoreEl = document.getElementById('screeningScore');
    const reasonsEl = document.getElementById('screeningReasons');

    if (statusEl) {
        statusEl.textContent = '取得失敗';
        statusEl.classList.remove('pass');
        statusEl.classList.add('review');
    }
    if (scoreEl) {
        scoreEl.textContent = '-';
    }
    if (reasonsEl) {
        reasonsEl.innerHTML = '';
        const li = document.createElement('li');
        li.textContent = message || '審査結果を取得できませんでした。';
        reasonsEl.appendChild(li);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const section = document.getElementById('screeningSection');
    if (!section || !window.bankLoanApi || typeof window.bankLoanApi.fetchScreeningResult !== 'function') {
        return;
    }

    const container = document.querySelector('.container');
    const baseUrl = container ? container.getAttribute('data-screening-api-base') : '';

    const payload = {
        bankName: readInputValue('bankName'),
        branchName: readInputValue('branchName'),
        bankAccountType: readInputValue('bankAccountType'),
        bankAccountNum: readInputValue('bankAccountNum'),
        name: readInputValue('applicantName'),
        loanType: readInputValue('loanType'),
        loanAmount: toNumber(readInputValue('loanAmount')),
        annualIncome: toNumber(readInputValue('annualIncome')),
        loanPeriod: toNumber(readInputValue('loanPeriod')),
        interestRate: toNumber(readInputValue('interestRate'))
    };

    window.bankLoanApi.fetchScreeningResult(payload, { baseUrl: baseUrl })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('サーバーエラー: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            renderScreeningResult(data || {});
        })
        .catch(function(error) {
            console.error('審査結果取得エラー:', error);
            renderScreeningError('審査結果の取得に失敗しました。');
        });
});

// 金利表示用のフォーマットヘルパー
// (moved to bankLoanFormatters.js)
