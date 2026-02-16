// 数値をカンマ区切りでフォーマットする関数
function formatNumberWithComma(num) {
    if (num === null || num === undefined || num === '') return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 入力フィールドの数値をリアルタイムでフォーマット
function setupNumberFormatting() {
    const loanAmountInput = document.getElementById('loanAmount');
    const annualIncomeInput = document.getElementById('annualIncome');

    if (loanAmountInput) {
        loanAmountInput.addEventListener('input', function() {
            // 数値のみを保持（内部値）
            let value = this.value.replace(/,/g, '');
            // フォーマットして表示（表示用）
            this.value = formatNumberWithComma(value);
        });
    }

    if (annualIncomeInput) {
        annualIncomeInput.addEventListener('input', function() {
            // 数値のみを保持（内部値）
            let value = this.value.replace(/,/g, '');
            // フォーマットして表示（表示用）
            this.value = formatNumberWithComma(value);
        });
    }
}

// フォーム送信時に入力値からカンマを削除
function removeCommasBeforeSubmit() {
    const loanAmountInput = document.getElementById('loanAmount');
    const annualIncomeInput = document.getElementById('annualIncome');

    if (loanAmountInput) {
        loanAmountInput.value = loanAmountInput.value.replace(/,/g, '');
    }

    if (annualIncomeInput) {
        annualIncomeInput.value = annualIncomeInput.value.replace(/,/g, '');
    }
}

// 確認画面の送信ボタンの処理
const submitButton = document.getElementById("submit");
if (submitButton) {
    submitButton.addEventListener('click', (e) => {
        console.log(confirm("操作を実行します"));
    });
}

// ページ読み込み時にフォーマット機能を初期化
document.addEventListener('DOMContentLoaded', function() {
    setupNumberFormatting();
});
