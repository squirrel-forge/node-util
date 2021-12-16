/**
 * Convert hrtime to a readable time
 * @param {Array} time - Process hrtime value
 * @param {string} s - Seconds suffix and spacer
 * @param {string} ms - Milliseconds suffix
 * @param {boolean} ret - Return as array
 * @return {string|Array} - Rendered time string or array parts
 */
module.exports = function convertHrtime( time, s = 's ', ms = 'ms', ret = false ) {
    const result = [];
    if ( time[ 0 ] ) {
        result.push( time[ 0 ] );
        result.push( s );
    }
    result.push( time[ 1 ] / 1000000 );
    result.push( ms );
    return ret === true ? result : result.join( '' );
};
