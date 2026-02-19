// Form setup helpers for bank loan UI.
(function(global) {
    function resetSelectToPlaceholder(selectEl) {
        if (!selectEl) return;
        selectEl.selectedIndex = 0;
        selectEl.value = '';
    }

    function resetFormSelections() {
        console.log('resetFormSelections called');

        const branchNameInput = document.getElementById('branchNameInput');
        if (branchNameInput) branchNameInput.value = '';

        const bankAccountNum = document.getElementById('bankAccountNum');
        if (bankAccountNum) bankAccountNum.value = '';

        const applicantName = document.getElementById('applicantName');
        if (applicantName) applicantName.value = '';

        const loanAmount = document.getElementById('loanAmount');
        if (loanAmount) loanAmount.value = '';

        const annualIncome = document.getElementById('annualIncome');
        if (annualIncome) annualIncome.value = '';

        const loanPeriod = document.getElementById('loanPeriod');
        if (loanPeriod) loanPeriod.value = '';

        resetSelectToPlaceholder(document.getElementById('bankAccountTypeSelect'));
        resetSelectToPlaceholder(document.getElementById('loanTypeSelect'));

        const displayInterestRate = document.getElementById('displayInterestRate');
        if (displayInterestRate) displayInterestRate.textContent = '---';

        const bankAccountNumWarning = document.getElementById('bankAccountNumWarning');
        if (bankAccountNumWarning) bankAccountNumWarning.style.display = 'none';

        const branchNameWarning = document.getElementById('branchNameWarning');
        if (branchNameWarning) branchNameWarning.style.display = 'none';

        sessionStorage.removeItem('bankLoanFormData');

        const errorMessageContainer = document.getElementById('errorMessageContainer');
        if (errorMessageContainer) {
            errorMessageContainer.classList.remove('show');
        }

        if (global.bankLoanState) {
            global.bankLoanState.hasValidationAttempt = false;
        }
        if (typeof global.updateRequiredMarks === 'function') {
            global.updateRequiredMarks();
        }
        if (typeof global.clearInputErrorStates === 'function') {
            global.clearInputErrorStates();
        }
        if (typeof global.updateRepaymentSimulation === 'function') {
            global.updateRepaymentSimulation();
        }
    }

    function attachClearButtonHandler() {
        const clearButton = document.getElementById('clearButton');
        if (!clearButton) {
            console.error('clearButton not found');
            return;
        }

        console.log('Attaching clear button handler');
        clearButton.addEventListener('click', function() {
            console.log('Clear button clicked');
            setTimeout(resetFormSelections, 0);
        });
    }

    function initializeSelectFields() {
        console.log('Initializing select fields...');

        const savedData = sessionStorage.getItem('bankLoanFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                if (formData.bankAccountType || formData.loanType) {
                    console.log('Session data has select values, skipping select initialization');
                    return;
                }
            } catch (e) {
                console.error('Error parsing session data:', e);
            }
        }

        const bankAccountTypeSelect = document.getElementById('bankAccountTypeSelect');
        const loanTypeSelect = document.getElementById('loanTypeSelect');

        if (bankAccountTypeSelect) {
            bankAccountTypeSelect.value = '';
            bankAccountTypeSelect.selectedIndex = 0;
            console.log('bankAccountTypeSelect initialized to placeholder, value:', bankAccountTypeSelect.value);
        }

        if (loanTypeSelect) {
            loanTypeSelect.value = '';
            loanTypeSelect.selectedIndex = 0;
            console.log('loanTypeSelect initialized to placeholder, value:', loanTypeSelect.value);
        }
    }

    function setupNumberFormatting() {
        const loanAmountInput = document.getElementById('loanAmount');
        const annualIncomeInput = document.getElementById('annualIncome');
        const loanPeriodInput = document.getElementById('loanPeriod');
        const bankAccountNum = document.querySelector('[name="bankAccountNum"]');

        if (loanAmountInput) {
            loanAmountInput.addEventListener('input', function() {
                let value = extractNumbers(this.value);
                this.value = formatNumberWithComma(value);
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
                if (typeof global.updateRequiredMarks === 'function') {
                    global.updateRequiredMarks();
                }
                if (typeof global.updateRepaymentSimulation === 'function') {
                    global.updateRepaymentSimulation();
                }
            });
        }

        if (annualIncomeInput) {
            annualIncomeInput.addEventListener('input', function() {
                let value = extractNumbers(this.value);
                this.value = formatNumberWithComma(value);
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
                if (typeof global.updateRequiredMarks === 'function') {
                    global.updateRequiredMarks();
                }
            });
        }

        if (loanPeriodInput) {
            loanPeriodInput.addEventListener('input', function() {
                let value = extractNumbers(this.value);
                this.value = value;
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
                if (typeof global.calculateAndDisplayInterestRate === 'function') {
                    global.calculateAndDisplayInterestRate();
                }
                if (typeof global.updateRequiredMarks === 'function') {
                    global.updateRequiredMarks();
                }
                if (typeof global.updateRepaymentSimulation === 'function') {
                    global.updateRepaymentSimulation();
                }
            });
        }

        if (bankAccountNum) {
            bankAccountNum.addEventListener('input', function() {
                let value = extractNumbers(this.value);
                if (value.length > 7) {
                    value = value.substring(0, 7);
                }
                this.value = value;
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
                if (typeof global.updateBankAccountNumWarning === 'function') {
                    global.updateBankAccountNumWarning();
                }
                if (typeof global.updateRequiredMarks === 'function') {
                    global.updateRequiredMarks();
                }
            });
        }

        const loanTypeSelect = document.getElementById('loanTypeSelect');
        const bankName = document.querySelector('[name="bankName"]');
        const branchName = document.querySelector('[name="branchName"]');
        const bankAccountType = document.querySelector('[name="bankAccountType"]');
        const nameInput = document.querySelector('[name="name"]');

        if (loanTypeSelect) {
            loanTypeSelect.addEventListener('change', function() {
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
                if (typeof global.calculateAndDisplayInterestRate === 'function') {
                    global.calculateAndDisplayInterestRate();
                }
                if (typeof global.updateRequiredMarks === 'function') {
                    global.updateRequiredMarks();
                }
                if (typeof global.updateRepaymentSimulation === 'function') {
                    global.updateRepaymentSimulation();
                }
            });
        }
        if (bankName) {
            bankName.addEventListener('change', function() {
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
            });
        }
        if (branchName) {
            branchName.addEventListener('change', function() {
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
                if (typeof global.updateRequiredMarks === 'function') {
                    global.updateRequiredMarks();
                }
            });
        }
        if (bankAccountType) {
            bankAccountType.addEventListener('change', function() {
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
                if (typeof global.updateRequiredMarks === 'function') {
                    global.updateRequiredMarks();
                }
            });
        }
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                if (typeof global.saveFormDataToSessionStorage === 'function') {
                    global.saveFormDataToSessionStorage();
                }
                if (typeof global.updateRequiredMarks === 'function') {
                    global.updateRequiredMarks();
                }
            });
        }
    }

    global.resetSelectToPlaceholder = resetSelectToPlaceholder;
    global.resetFormSelections = resetFormSelections;
    global.attachClearButtonHandler = attachClearButtonHandler;
    global.initializeSelectFields = initializeSelectFields;
    global.setupNumberFormatting = setupNumberFormatting;
})(window);

