/**
 * Run callback form context
 * @param {string} name - Method name
 * @param {Object} context - Method context
 * @param {Array} args - Arguments array
 * @return {null|*} - Callback result or null
 */
module.exports = function callback( name, context, args = [] ) {
    if ( typeof context[ name ] === 'function' ) {
        return context[ name ]( ...args );
    }
    return null;
};
