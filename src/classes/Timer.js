/**
 * Timer class
 * @class
 */
class Timer {

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        this._ = {};
        this.start( 'construct' );
    }

    /**
     * Start timer
     * @public
     * @param {string} name - Timer name
     * @return {boolean} - True if started, false if running already
     */
    start( name ) {
        if ( !this._[ name ] ) {
            this._[ name ] = process.hrtime();
            return true;
        }
        return false;
    }

    /**
     * End timer
     * @public
     * @param {string} name - Timer name
     * @return {null|string} - Time result or null if not available
     */
    end( name ) {
        if ( this._[ name ] ) {
            const cmd_time = process.hrtime( this._[ name ] );
            return ( cmd_time[ 0 ] ? cmd_time[ 0 ] + 's ' : '' ) +  cmd_time[ 1 ] / 1000000  + 'ms';
        }
        return null;
    }

}

/**
 * Export
 * @type {Timer}
 */
module.exports = Timer;
