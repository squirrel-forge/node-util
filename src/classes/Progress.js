/**
 * Requires
 */
const Spinner = require( 'cli-spinner' ).Spinner;

/**
 * Progress class
 * @class
 */
class Progress {

    /**
     * Constructor
     * @constructor
     */
    constructor() {

        /**
         * Spinner reference
         * @protected
         * @type {Spinner}
         */
        this._ = null;
    }

    /**
     * Start progress
     * @param {string} text - Text prefix
     * @param {string} chars - Animation loop
     * @return {void}
     */
    start( text, chars = '|/-\\' ) {
        this.stop();
        this._ = new Spinner( ( text ? text + ' ' : '' ) + '%s' );
        this._.setSpinnerString( chars );
        this._.start();
    }

    /**
     * Stop progress
     * @return {void}
     */
    stop() {
        if ( this._ ) {
            this._.stop( true );
            this._ = null;
        }
    }
}

/**
 * Export
 * @type {Progress}
 */
module.exports = Progress;
