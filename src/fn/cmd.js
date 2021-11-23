/**
 * Requires
 */
const { exec } = require( 'child_process' );

/**
 * Run command and return
 * @param {string} command - Command to run with exec
 * @return {Promise<string|ExecException>} - String stdout on success
 */
module.exports = function cmd( command ) {
    return new Promise( ( resolve ) => {
        exec( command, ( exception, stdout ) => {
            resolve( exception || stdout );
        } );
    } );
};
