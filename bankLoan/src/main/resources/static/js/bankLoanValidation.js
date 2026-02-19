// Validation helpers for bank loan UI.
(function(global) {
    const bankLoanState = global.bankLoanState || {
        repaymentAnimationState: { monthly: null, total: null, interest: null },
        allBranches: {},
        flatBranchList: [],
        hasValidationAttempt: false
    };

    function setInputErrorState(element, hasError) {
        if (!element) return;
        if (hasError) {
            element.classList.add('input-error');
        } else {
            element.classList.remove('input-error');
        }
    }

    function clearInputErrorStates() {
        document.querySelectorAll('.input-error').forEach(function(element) {
            element.classList.remove('input-error');
        });
    }

    function updateInputErrorStates() {
        if (!bankLoanState.hasValidationAttempt) return;

        const branchName = document.querySelector('[name="branchName"]');
        const bankAccountType = document.querySelector('[name="bankAccountType"]');
        const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
        const name = document.querySelector('[name="name"]');
        const loanTypeSelect = document.getElementById('loanTypeSelect');
        const loanAmountInput = document.getElementById('loanAmount');
        const annualIncomeInput = document.getElementById('annualIncome');
        const loanPeriodInput = document.getElementById('loanPeriod');

        const branchNameValue = branchName ? branchName.value.trim() : '';
        const branchNameInvalid = !branchNameValue || !bankLoanState.flatBranchList.includes(branchNameValue);

        const bankAccountTypeInvalid = !bankAccountType || !bankAccountType.value || bankAccountType.value.trim() === '';
        const bankAccountNumInvalid = !bankAccountNum || !bankAccountNum.value || bankAccountNum.value.trim() === '';
        const nameInvalid = !name || !name.value || name.value.trim() === '';
        const loanTypeInvalid = !loanTypeSelect || !loanTypeSelect.value || loanTypeSelect.value.trim() === '';

        const loanAmountValue = loanAmountInput ? loanAmountInput.value.replace(/,/g, '').trim() : '';
        const loanAmountInvalid = !loanAmountInput || !loanAmountValue || isNaN(loanAmountValue);

        const annualIncomeValue = annualIncomeInput ? annualIncomeInput.value.replace(/,/g, '').trim() : '';
        const annualIncomeInvalid = !annualIncomeInput || !annualIncomeValue || isNaN(annualIncomeValue);

        const loanPeriodValue = loanPeriodInput ? loanPeriodInput.value.trim() : '';
        const loanPeriodInvalid = !loanPeriodInput || !loanPeriodValue || isNaN(loanPeriodValue) ||
            parseInt(loanPeriodValue) < 1 || parseInt(loanPeriodValue) > 35;

        setInputErrorState(branchName, branchNameInvalid);
        setInputErrorState(bankAccountType, bankAccountTypeInvalid);
        setInputErrorState(bankAccountNum, bankAccountNumInvalid);
        setInputErrorState(name, nameInvalid);
        setInputErrorState(loanTypeSelect, loanTypeInvalid);
        setInputErrorState(loanAmountInput, loanAmountInvalid);
        setInputErrorState(annualIncomeInput, annualIncomeInvalid);
        setInputErrorState(loanPeriodInput, loanPeriodInvalid);
    }

    function updateRequiredMarks() {
        const marks = document.querySelectorAll('.required');
        marks.forEach(function(mark) {
            const targetId = mark.getAttribute('data-required-for');
            if (!targetId) return;

            const target = document.getElementById(targetId);
            if (!target) return;

            const value = (target.value || '').trim();
            mark.style.display = value ? 'none' : 'inline';
        });
        if (bankLoanState.hasValidationAttempt) {
            updateInputErrorStates();
        }
    }

    function attachRequiredMarkListeners() {
        const targets = [
            'branchNameInput',
            'bankAccountTypeSelect',
            'bankAccountNum',
            'applicantName',
            'loanTypeSelect',
            'loanAmount',
            'annualIncome',
            'loanPeriod'
        ];

        targets.forEach(function(id) {
            const el = document.getElementById(id);
            if (!el) return;

            const eventName = el.tagName.toLowerCase() === 'select' ? 'change' : 'input';
            el.addEventListener(eventName, updateRequiredMarks);
        });
    }

    function updateBankAccountNumWarning() {
        const bankAccountNumInput = document.getElementById('bankAccountNum');
        const warning = document.getElementById('bankAccountNumWarning');
        if (!bankAccountNumInput || !warning) {
            return;
        }
        const digits = (bankAccountNumInput.value || '').replace(/\D/g, '');
        if (!digits) {
            warning.style.display = 'none';
            return;
        }
        warning.style.display = digits.length === 7 ? 'none' : 'inline';
    }

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

    function validateFormBeforeSubmit(event) {
        const bankName = document.querySelector('[name="bankName"]');
        const branchName = document.querySelector('[name="branchName"]');
        const bankAccountType = document.querySelector('[name="bankAccountType"]');
        const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
        const name = document.querySelector('[name="name"]');
        const loanTypeSelect = document.getElementById('loanTypeSelect');
        const loanAmountInput = document.getElementById('loanAmount');
        const annualIncomeInput = document.getElementById('annualIncome');
        const loanPeriodInput = document.getElementById('loanPeriod');

        // バリデーション結果格納用
        let errorMessages = [];
        bankLoanState.hasValidationAttempt = true;
        updateInputErrorStates();

        // 各フィールドのバリデーション
        if (!bankName || !bankName.value || bankName.value.trim() === '') {
            errorMessages.push('金融機関名を選択してください');
        }

        if (!branchName || !branchName.value || branchName.value.trim() === '') {
            errorMessages.push('支店名を入力してください');
        } else {
            // 支店名が有効か確認（データに存在するか）
            const branchNameValue = branchName.value.trim();
            if (!bankLoanState.flatBranchList.includes(branchNameValue)) {
                errorMessages.push('入力した支店名が見つかりません。正しい支店名を入力してください。');
            }
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

        if (!loanTypeSelect || !loanTypeSelect.value || loanTypeSelect.value.trim() === '') {
            errorMessages.push('ローンの種類を選択してください');
        }

        if (!loanAmountInput || !loanAmountInput.value || loanAmountInput.value.replace(/,/g, '').trim() === '') {
            errorMessages.push('借入金額を入力してください');
        } else {
            // カンマを除いた値が数値かチェック
            const loanAmountValue = loanAmountInput.value.replace(/,/g, '').trim();
            if (isNaN(loanAmountValue) || loanAmountValue === '') {
                errorMessages.push('借入金額は数値を入力してください');
            }
        }

        if (!annualIncomeInput || !annualIncomeInput.value || annualIncomeInput.value.replace(/,/g, '').trim() === '') {
            errorMessages.push('借入年収を入力してください');
        } else {
            // カンマを除いた値が数値かチェック
            const annualIncomeValue = annualIncomeInput.value.replace(/,/g, '').trim();
            if (isNaN(annualIncomeValue) || annualIncomeValue === '') {
                errorMessages.push('借入年収は数値を入力してください');
            }
        }

        if (!loanPeriodInput || !loanPeriodInput.value || loanPeriodInput.value.trim() === '') {
            errorMessages.push('借入期間を入力してください');
        } else {
            // 借入期間が数値かチェック
            const loanPeriodValue = loanPeriodInput.value.trim();
            if (isNaN(loanPeriodValue) || loanPeriodValue === '') {
                errorMessages.push('借入期間は数値を入力してください');
            } else if (parseInt(loanPeriodValue) < 1 || parseInt(loanPeriodValue) > 35) {
                errorMessages.push('借入期間は1年以上35年以下で入力してください');
            }
        }

        // エラーメッセージ表示用の要素を取得
        const errorMessageContainer = document.getElementById('errorMessageContainer');
        const errorList = document.getElementById('errorList');

        // エラーがある場合は送信を中止して Web上に表示
        if (errorMessages.length > 0) {
            event.preventDefault();

            // エラーリストをクリア
            errorList.innerHTML = '';

            // エラーメッセージをリスト化して表示
            errorMessages.forEach(function(message) {
                const listItem = document.createElement('li');
                listItem.textContent = message;
                errorList.appendChild(listItem);
            });

            // エラーコンテナを表示
            errorMessageContainer.classList.add('show');

            // ページトップにスクロール
            errorMessageContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

            return false;
        }

        // バリデーション成功時はエラーコンテナを非表示
        errorMessageContainer.classList.remove('show');
        updateInputErrorStates();
        // バリデーション成功時はカンマを削除
        removeCommasBeforeSubmit();
        return true;
    }

    global.setInputErrorState = setInputErrorState;
    global.clearInputErrorStates = clearInputErrorStates;
    global.updateInputErrorStates = updateInputErrorStates;
    global.updateRequiredMarks = updateRequiredMarks;
    global.attachRequiredMarkListeners = attachRequiredMarkListeners;
    global.updateBankAccountNumWarning = updateBankAccountNumWarning;
    global.removeCommasBeforeSubmit = removeCommasBeforeSubmit;
    global.validateFormBeforeSubmit = validateFormBeforeSubmit;
})(window);

