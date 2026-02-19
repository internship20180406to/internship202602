// API helpers for bank loan UI.
(function(global) {
    function fetchAllBranches() {
        return fetch('/getAllBranches').then(function(response) {
            return response.json();
        });
    }

    function calculateInterestRate(loanType, loanPeriod) {
        const query = `loanType=${encodeURIComponent(loanType)}&loanPeriod=${encodeURIComponent(loanPeriod)}`;
        return fetch(`/calculateInterestRate?${query}`).then(function(response) {
            return response.json();
        });
    }

    function saveBankLoan(params) {
        let body;
        if (params instanceof URLSearchParams) {
            body = params.toString();
        } else if (typeof params === 'string') {
            body = params;
        } else {
            const searchParams = new URLSearchParams();
            Object.keys(params || {}).forEach(function(key) {
                if (params[key] !== undefined && params[key] !== null) {
                    searchParams.append(key, params[key]);
                }
            });
            body = searchParams.toString();
        }

        return fetch('/saveBankLoan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });
    }

    global.bankLoanApi = {
        fetchAllBranches: fetchAllBranches,
        calculateInterestRate: calculateInterestRate,
        saveBankLoan: saveBankLoan
    };
})(window);

