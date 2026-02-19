// Interest rate calculation helpers for bank loan UI.
(function(global) {
    const bankLoanApi = global.bankLoanApi;

    function calculateAndDisplayInterestRate() {
        const loanTypeSelect = document.getElementById('loanTypeSelect');
        const loanPeriod = document.getElementById('loanPeriod');
        const displayInterestRate = document.getElementById('displayInterestRate');

        if (!loanTypeSelect || !loanTypeSelect.value || !loanPeriod || !loanPeriod.value) {
            if (displayInterestRate) {
                displayInterestRate.textContent = '---';
            }
            if (typeof global.updateRepaymentSimulation === 'function') {
                global.updateRepaymentSimulation();
            }
            return;
        }

        const loanPeriodValue = parseInt(loanPeriod.value, 10);
        if (isNaN(loanPeriodValue)) {
            if (displayInterestRate) {
                displayInterestRate.textContent = '---';
            }
            if (typeof global.updateRepaymentSimulation === 'function') {
                global.updateRepaymentSimulation();
            }
            return;
        }

        const interestPromise = bankLoanApi ?
            bankLoanApi.calculateInterestRate(loanTypeSelect.value, loanPeriodValue) :
            fetch(`/calculateInterestRate?loanType=${encodeURIComponent(loanTypeSelect.value)}&loanPeriod=${loanPeriodValue}`)
                .then(function(response) { return response.json(); });

        interestPromise
            .then(function(data) {
                if (displayInterestRate && data.interestRate) {
                    displayInterestRate.textContent = formatInterestRateForDisplay(data.interestRate);
                }
                if (typeof global.updateRepaymentSimulation === 'function') {
                    global.updateRepaymentSimulation();
                }
            })
            .catch(function(error) {
                console.error('金利計算エラー:', error);
                if (displayInterestRate) {
                    displayInterestRate.textContent = '---';
                }
                if (typeof global.updateRepaymentSimulation === 'function') {
                    global.updateRepaymentSimulation();
                }
            });
    }

    global.calculateAndDisplayInterestRate = calculateAndDisplayInterestRate;
})(window);

