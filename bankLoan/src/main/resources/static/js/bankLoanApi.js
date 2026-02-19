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

    function fetchScreeningResult(payload, options) {
        const baseUrl = options && options.baseUrl ? options.baseUrl.replace(/\/+$/, '') : '';
        const url = baseUrl ? baseUrl + '/screening' : '/screening';
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload || {})
        });
    }

    global.bankLoanApi = {
        fetchAllBranches: fetchAllBranches,
        calculateInterestRate: calculateInterestRate,
        saveBankLoan: saveBankLoan,
        fetchScreeningResult: fetchScreeningResult
    };
})(window);
