/**
 * Convert ms to hr time format
 * @param {number} ms - Milliseconds
 * @return {Array<number>} - Hrtime format
 */
module.exports = function convertMs2Hrtime( ms ) {
    const seconds = Math.floor( ms / 1000 );
    return [ seconds, ( ms - seconds * 1000 ) * 1000000 ];
};
