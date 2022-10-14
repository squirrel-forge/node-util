/**
 * Requires
 */
const FsInterface = require( '../classes/FsInterface' );
const isPojo = require( './isPojo' );
const requireOptional = require("./requireOptional");

/**
 * @typedef {Object} MinPackageEngine - Local packe engine data
 * @property {string} node - Node version requirement
 */

/**
 * @typedef {Object} MinPackageData - Local package data
 * @property {string} name - Package name
 * @property {string} version - Package version
 * @property {MinPackageEngine|Object} engine - Engine restrictions
 */

/**
 * Run package version check
 * @param {MinPackageData|Object} pkg - Package json
 * @param {console} cfx - Console or alike object
 * @param {boolean} verbose - Show errors/lastest
 * @return {Promise<void>} - Returns nothing
 */
module.exports = async function updateNotice( pkg, cfx = console, verbose = false ) {
    if ( pkg ) {

        // Get semver or throw with requirement
        const semver = requireOptional( 'semver', '^6.3.0', true );
        try {
            const remote = await FsInterface.remoteJSON( 'https://registry.npmjs.org/' + pkg.name + '/latest' );
            if ( isPojo( remote ) && remote.version ) {

                // Check if there is an update available
                if ( semver.gt( remote.version, pkg.version ) ) {
                    const msg_offset = '[fwhite][fgreen][fcyan][fwhite][fcyan][fwhite]';
                    const msg = ' [fwhite]' + pkg.name + '[fgreen] update available [fcyan]from [fwhite]'
                        + pkg.version + '[fcyan] to [fwhite]' + remote.version + ' ';
                    let style = 'info';
                    if ( semver.major( remote.version ) > semver.major( pkg.version ) ) {
                        style = 'error';
                    } else if ( semver.minor( remote.version ) > semver.minor( pkg.version ) ) {
                        style = 'warn';
                    }
                    cfx.log( '' );
                    cfx[ style ]( '-'.repeat( msg.length - msg_offset.length ) );
                    cfx.info( msg );
                    if ( remote.engines.node !== pkg.engines.node ) {
                        cfx.warn( 'This update requires a different node version ' + remote.engines.node );
                    }
                    cfx[ style ]( '-'.repeat( msg.length - msg_offset.length ) );
                } else if ( verbose ) {
                    cfx.log( '[fgreen]You are using the latest version: [fwhite]' + pkg.version );
                }
            }
        } catch ( e ) {
            if ( verbose ) {
                cfx.error( e );
                cfx.error( 'Failed to check latest version' );
            }
        }
    }
};
