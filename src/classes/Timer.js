/**
 * Requires
 */
const displayHrtime = require( '../fn/displayHrtime' );

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
     * Get start time
     * @public
     * @param {string} name - Timer name
     * @return {null|hrtime} - Null if not started
     */
    get( name ) {
        if ( this._[ name ] ) {
            return this._[ name ];
        }
        return null;
    }

    /**
     * Measure time
     * @param {string} name - Timer name
     * @return {null|[number, number]} - Process hrtime value
     */
    measure( name ) {
        if ( this._[ name ] ) {
            return process.hrtime( this._[ name ] );
        }
        return null;
    }

    /**
     * End timer
     * @public
     * @param {string} name - Timer name, default: 'construct'
     * @return {null|string} - Time result or null if not available
     */
    end( name = 'construct' ) {
        const t = this.measure( name );
        if ( t ) return displayHrtime( t );
        return null;
    }

}

/**
 * Export
 * @type {Timer}
 */
module.exports = Timer;
