// Shared formatting helpers for bank loan UI.
(function(global) {
    function formatNumberWithComma(num) {
        if (num === null || num === undefined || num === '') return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function convertToHalfWidth(str) {
        if (!str) return '';
        return str.replace(/[０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }

    function extractNumbers(str) {
        if (!str) return '';
        const halfWidth = convertToHalfWidth(str);
        return halfWidth.replace(/[^0-9]/g, '');
    }

    function formatInterestRateForDisplay(rateText) {
        if (rateText === null || rateText === undefined) return '---';
        const trimmed = String(rateText).trim();
        if (!trimmed || trimmed === '---') return '---';
        return trimmed.endsWith('%') ? trimmed : trimmed + '%';
    }

    global.formatNumberWithComma = formatNumberWithComma;
    global.convertToHalfWidth = convertToHalfWidth;
    global.extractNumbers = extractNumbers;
    global.formatInterestRateForDisplay = formatInterestRateForDisplay;
})(window);

