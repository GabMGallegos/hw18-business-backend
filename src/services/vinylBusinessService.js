function calculateAdjustedTime(vinyl) {
    const timeRecord = Number(vinyl.time_record);
    const qualityDisk = Number(vinyl.qualitydisk);

    return timeRecord + qualityDisk * 15;
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