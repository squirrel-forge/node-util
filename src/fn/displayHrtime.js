/**
 * Render hrtime
 * @param {Array} time - Process hrtime value
 * @param {string} s - Seconds suffix and spacer
 * @param {string} ms - Milliseconds suffix
 * @return {string} - Rendered time string
 */
module.exports = function displayHrtime( time, s = 's ', ms = 'ms' ) {
    return ( time[ 0 ] ? time[ 0 ] + s : '' ) +  time[ 1 ] / 1000000  + ms;
};
