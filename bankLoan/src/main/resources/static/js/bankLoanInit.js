// Initialization flow for bank loan UI.
(function(global) {
    function initFormPage() {
        console.log('Initializing form page...');
        setTimeout(function() {
            if (typeof global.initializeSelectFields === 'function') {
                global.initializeSelectFields();
            }
            if (typeof global.restoreFormDataFromSessionStorage === 'function') {
                global.restoreFormDataFromSessionStorage();
            }
            if (typeof global.calculateAndDisplayInterestRate === 'function') {
                global.calculateAndDisplayInterestRate();
            }

            if (typeof global.setupNumberFormatting === 'function') {
                global.setupNumberFormatting();
            }
            if (typeof global.updateBankAccountNumWarning === 'function') {
                global.updateBankAccountNumWarning();
            }
            if (typeof global.initializeBranchData === 'function') {
                global.initializeBranchData();
            }
            if (typeof global.initializeBranchNameField === 'function') {
                global.initializeBranchNameField();
            }
            if (typeof global.attachRequiredMarkListeners === 'function') {
                global.attachRequiredMarkListeners();
            }
            if (typeof global.attachClearButtonHandler === 'function') {
                global.attachClearButtonHandler();
            }
            if (typeof global.updateRequiredMarks === 'function') {
                global.updateRequiredMarks();
            }
            if (typeof global.updateRepaymentSimulation === 'function') {
                global.updateRepaymentSimulation();
            }
        }, 0);
    }

    function init() {
        console.log('DOMContentLoaded event fired');
        const loanAmountEl = document.getElementById('loanAmount');
        console.log('loanAmount element:', loanAmountEl);

        if (loanAmountEl) {
            initFormPage();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})(window);

