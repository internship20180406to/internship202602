// Shared state container for bank loan UI.
(function(global) {
    const bankLoanState = {
        repaymentAnimationState: {
            monthly: null,
            total: null,
            interest: null
        },
        allBranches: {},
        flatBranchList: [],
        hasValidationAttempt: false
    };

    global.bankLoanState = bankLoanState;
})(window);

