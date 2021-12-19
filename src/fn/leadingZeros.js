/**
 * Leading Zero helper
 * @param {number} num - Number to add prefix
 * @param {number} length - Expected length
 * @param {string} char - Custom character
 * @param {boolean} reverse - Reverse and
 * @return {string} - The prefixed number
 */
module.exports = function leadingZeros( num, length = 2, char = '0', reverse = false ) {
    num = num + '';
    while ( num.length < length ) {
        num = reverse ? num + char : char + num;
    }
    return num;
};
