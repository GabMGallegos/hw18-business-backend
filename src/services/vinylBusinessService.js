function calculateAdjustedTime(vinyl) {
    return vinyl.time_record + vinyl.qualitydisk * 15;
}

function applyBusinessRule(vinyl) {
    return {
        ...vinyl,
        adjusted_time_record: calculateAdjustedTime(vinyl),
        business_rule: 'time_record + (qualitydisk * 15)'
    };
}

module.exports = {
    calculateAdjustedTime,
    applyBusinessRule
};