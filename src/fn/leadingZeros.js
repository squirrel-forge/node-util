/**
 * Leading Zero helper
 * @param {number} num - Number to add prefix
 * @param {number} length - Expected length
 * @param {string} char - Custom character
 * @return {string} - The prefixed number
 */
module.exports = function leadingZeros( num, length = 2, char = '0' ) {
    num = num + '';
    while ( num.length < length ) {
        num = char + num;
    }
    return num;
};
