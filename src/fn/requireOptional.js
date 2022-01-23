/**
 * Require optional
 * @param {string} name - Module name
 * @param {string} version - Version for fatal notice
 * @param {boolean} fatal - Throw if not available
 * @return {null|*} - Module if available
 */
module.exports = function requireOptional( name, version, fatal = false ) {
    let module = null;
    try {
        module = require( name );
    } catch ( err ) {
        if ( fatal ) throw new Error( `Requires ${name}@${version}`, err );
    }
    return module;
};
