// 数値をカンマ区切りでフォーマットする関数
function formatNumberWithComma(num) {
    if (num === null || num === undefined || num === '') return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// フォームデータをセッションストレージに保存
function saveFormDataToSessionStorage() {
    const bankName = document.querySelector('[name="bankName"]');
    const bankAccountType = document.querySelector('[name="bankAccountType"]');
    const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
    const name = document.querySelector('[name="name"]');
    const loanAmountInput = document.getElementById('loanAmount');
    const annualIncomeInput = document.getElementById('annualIncome');

    const formData = {
        bankName: bankName ? bankName.value : '',
        bankAccountType: bankAccountType ? bankAccountType.value : '',
        bankAccountNum: bankAccountNum ? bankAccountNum.value : '',
        name: name ? name.value : '',
        loanAmount: loanAmountInput ? loanAmountInput.value.replace(/,/g, '') : '',
        annualIncome: annualIncomeInput ? annualIncomeInput.value.replace(/,/g, '') : ''
    };

    sessionStorage.setItem('bankLoanFormData', JSON.stringify(formData));
}

// セッションストレージからフォームデータを復元
function restoreFormDataFromSessionStorage() {
    const savedData = sessionStorage.getItem('bankLoanFormData');

    if (savedData) {
        try {
            const formData = JSON.parse(savedData);

            const bankName = document.querySelector('[name="bankName"]');
            const bankAccountType = document.querySelector('[name="bankAccountType"]');
            const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
            const name = document.querySelector('[name="name"]');
            const loanAmountInput = document.getElementById('loanAmount');
            const annualIncomeInput = document.getElementById('annualIncome');

            if (bankName && formData.bankName) bankName.value = formData.bankName;
            if (bankAccountType && formData.bankAccountType) bankAccountType.value = formData.bankAccountType;
            if (bankAccountNum && formData.bankAccountNum) bankAccountNum.value = formData.bankAccountNum;
            if (name && formData.name) name.value = formData.name;
            if (loanAmountInput && formData.loanAmount) {
                loanAmountInput.value = formatNumberWithComma(formData.loanAmount);
            }
            if (annualIncomeInput && formData.annualIncome) {
                annualIncomeInput.value = formatNumberWithComma(formData.annualIncome);
            }
        } catch (e) {
            console.error('フォームデータの復元に失敗しました:', e);
        }
    }
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
            // リアルタイムで保存
            saveFormDataToSessionStorage();
        });
    }

    if (annualIncomeInput) {
        annualIncomeInput.addEventListener('input', function() {
            // 数値のみを保持（内部値）
            let value = this.value.replace(/,/g, '');
            // フォーマットして表示（表示用）
            this.value = formatNumberWithComma(value);
            // リアルタイムで保存
            saveFormDataToSessionStorage();
        });
    }

    // その他のフィールドの変更も検知
    const bankName = document.querySelector('[name="bankName"]');
    const bankAccountType = document.querySelector('[name="bankAccountType"]');
    const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
    const nameInput = document.querySelector('[name="name"]');

    if (bankName) {
        bankName.addEventListener('change', saveFormDataToSessionStorage);
    }
    if (bankAccountType) {
        bankAccountType.addEventListener('change', saveFormDataToSessionStorage);
    }
    if (bankAccountNum) {
        bankAccountNum.addEventListener('input', saveFormDataToSessionStorage);
    }
    if (nameInput) {
        nameInput.addEventListener('input', saveFormDataToSessionStorage);
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

// フォーム送信時のバリデーション
function validateFormBeforeSubmit(event) {
    const bankName = document.querySelector('[name="bankName"]');
    const bankAccountType = document.querySelector('[name="bankAccountType"]');
    const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
    const name = document.querySelector('[name="name"]');
    const loanAmountInput = document.getElementById('loanAmount');
    const annualIncomeInput = document.getElementById('annualIncome');

    // バリデーション結果格納用
    let errorMessages = [];

    // 各フィールドのバリデーション
    if (!bankName || !bankName.value || bankName.value.trim() === '') {
        errorMessages.push('金融機関名を選択してください');
    }

    if (!bankAccountType || !bankAccountType.value || bankAccountType.value.trim() === '') {
        errorMessages.push('口座種別を選択してください');
    }

    if (!bankAccountNum || !bankAccountNum.value || bankAccountNum.value.trim() === '') {
        errorMessages.push('口座番号を入力してください');
    }

    if (!name || !name.value || name.value.trim() === '') {
        errorMessages.push('申込者名を入力してください');
    }

    if (!loanAmountInput || !loanAmountInput.value || loanAmountInput.value.replace(/,/g, '').trim() === '') {
        errorMessages.push('借入金額を入力してください');
    }

    if (!annualIncomeInput || !annualIncomeInput.value || annualIncomeInput.value.replace(/,/g, '').trim() === '') {
        errorMessages.push('借入年収を入力してください');
    }

    // エラーがある場合は送信を中止してアラート表示
    if (errorMessages.length > 0) {
        event.preventDefault();
        alert('以下の項目を入力してください：\n\n' + errorMessages.join('\n'));
        return false;
    }

    // バリデーション成功時はカンマを削除
    removeCommasBeforeSubmit();
    return true;
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
    // 入力フォーム画面の場合
    if (document.getElementById('loanAmount')) {
        restoreFormDataFromSessionStorage();
        setupNumberFormatting();
    }

    // 確認画面の場合は既存の処理を継続
});
