// Repayment simulation helpers for bank loan UI.
(function(global) {
    function setRepaymentSimulationPlaceholder() {
        const monthly = document.getElementById('displayMonthlyPayment');
        const total = document.getElementById('displayTotalPayment');
        const interest = document.getElementById('displayTotalInterest');
        if (monthly) monthly.textContent = '---';
        if (total) total.textContent = '---';
        if (interest) interest.textContent = '---';
    }

    function animateCurrencyValue(element, targetValue, stateKey, durationMs) {
        if (!element) return;

        const state = (global.bankLoanState && global.bankLoanState.repaymentAnimationState) || {
            monthly: null,
            total: null,
            interest: null
        };

        if (state[stateKey]) {
            cancelAnimationFrame(state[stateKey]);
            state[stateKey] = null;
        }

        const existingText = (element.textContent || '').replace(/[円,\s]/g, '');
        const startValue = parseFloat(existingText);
        const fromValue = isNaN(startValue) ? 0 : startValue;
        const toValue = Math.max(0, Math.round(targetValue));

        if (fromValue === toValue) {
            element.textContent = `${formatNumberWithComma(toValue)} 円`;
            return;
        }

        const startTime = performance.now();
        const duration = typeof durationMs === 'number' ? durationMs : 350;

        const step = function(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(fromValue + (toValue - fromValue) * eased);
            element.textContent = `${formatNumberWithComma(currentValue)} 円`;
            if (progress < 1) {
                state[stateKey] = requestAnimationFrame(step);
            }
        };

        state[stateKey] = requestAnimationFrame(step);
    }

    function updateRepaymentSimulation() {
        const loanAmountInput = document.getElementById('loanAmount');
        const loanPeriodInput = document.getElementById('loanPeriod');
        const interestRateDisplay = document.getElementById('displayInterestRate');
        const monthly = document.getElementById('displayMonthlyPayment');
        const total = document.getElementById('displayTotalPayment');
        const interest = document.getElementById('displayTotalInterest');

        if (!loanAmountInput || !loanPeriodInput || !interestRateDisplay || !monthly || !total || !interest) {
            return;
        }

        const principalValue = (loanAmountInput.value || '').replace(/,/g, '').trim();
        const yearsValue = (loanPeriodInput.value || '').trim();
        const rateValue = (interestRateDisplay.textContent || '').replace('%', '').trim();

        const principal = parseFloat(principalValue);
        const years = parseInt(yearsValue, 10);
        const annualRate = parseFloat(rateValue);

        if (!principalValue || !yearsValue || isNaN(principal) || isNaN(years) || isNaN(annualRate)) {
            setRepaymentSimulationPlaceholder();
            return;
        }

        const months = years * 12;
        if (months <= 0) {
            setRepaymentSimulationPlaceholder();
            return;
        }

        const monthlyRate = annualRate / 100 / 12;
        let monthlyPayment = 0;

        if (monthlyRate === 0) {
            monthlyPayment = principal / months;
        } else {
            const factor = Math.pow(1 + monthlyRate, months);
            monthlyPayment = principal * monthlyRate * factor / (factor - 1);
        }

        const totalPayment = monthlyPayment * months;
        const totalInterest = totalPayment - principal;

        animateCurrencyValue(monthly, monthlyPayment, 'monthly');
        animateCurrencyValue(total, totalPayment, 'total');
        animateCurrencyValue(interest, totalInterest, 'interest');
    }

    global.setRepaymentSimulationPlaceholder = setRepaymentSimulationPlaceholder;
    global.animateCurrencyValue = animateCurrencyValue;
    global.updateRepaymentSimulation = updateRepaymentSimulation;
})(window);

