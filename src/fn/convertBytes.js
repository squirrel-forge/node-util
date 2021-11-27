/**
 * Convert bytes to readable number
 * @param {number} bytes - Bytes
 * @param {number} decimals - Number of decimals, default: 2
 * @param {number} style - Calculation style, default: 1024
 * @param {boolean} obj - Return object with values, default: false
 * @param {number} forceUnit - Convert to specific unit
 * @return {string|Object} - Converted string or value object
 */
module.exports = function convertBytes( bytes, decimals = 2, style = 1024, obj = false, forceUnit = null ) {

    // Ensure correct style
    if ( style !== 1024 && style !== 1000 ) {
        style = 1024;
    }

    // Result object
    const res = {
        bytes : bytes <= 0 ? 0 : bytes,
        unit : 'bytes'
    };
    res.value = res.bytes;

    // Has no size
    if ( res.bytes <= 0 ) {
        return obj ? res : '0 bytes';
    }

    // Available size units
    const sizes = style === 1000 ?
        [ 'bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb' ]
        : [ 'bytes', 'kib', 'mib', 'gib', 'tib', 'pib', 'eib', 'zib', 'yib' ];

    // Unit scope
    const i = typeof forceUnit === 'number' ? forceUnit : Math.floor( Math.log( res.bytes ) / Math.log( style ) );

    // Number of decimals, considers values below 0 to be 0
    const dm = decimals <= 0 || sizes[ i ] === 'bytes' ? 0 : decimals;

    // Set value and unit
    res.value = ( res.bytes / Math.pow( style, i ) ).toFixed( dm );
    res.unit =  sizes[ i ];

    // Return
    return obj ? res : res.value + ' ' + res.unit;
};
