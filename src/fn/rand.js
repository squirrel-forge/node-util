/**
 * Get random integer
 * @param {number} min - Min value
 * @param {number} max - May value
 * @return {number} - Random integer
 */
module.exports = function rand( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
};
