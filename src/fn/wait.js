/**
 * Wait
 * @param {number} timeout - Time in ms
 * @return {Promise<void>} - Delays execution for the given ms
 */
module.exports = function wait( timeout ) {
    return new Promise( ( resolve ) => {
        setTimeout( resolve, timeout );
    } );
};
