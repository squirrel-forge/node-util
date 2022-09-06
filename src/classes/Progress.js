/**
 * Requires
 */
const requireOptional = require( '../fn/requireOptional' );

/**
 * Progress class
 * @class
 */
module.exports = class Progress {

    /**
     * Constructor
     * @constructor
     */
    constructor() {

        /**
         * Intercept dependency
         * @protected
         * @type {Function|null}
         */
        this._intercept = requireOptional( 'intercept-stdout', '^0.1.2', true );

        /**
         * Spinner reference
         * @protected
         * @type {Spinner}
         */
        this._ = null;

        /**
         * Safe mode handler
         * @protected
         * @property
         * @type {null}
         */
        this._safe = null;

        /**
         * Intercepted output
         * @public
         * @property
         * @type {Array<string>}
         */
        this.intercepted = [];
    }

    /**
     * Verify output
     * @protected
     * @param {string} output - Intercepted string
     * @param {undefined|string} text - Spinner text
     * @param {string} chars - Spinner chars
     * @return {string} - Allowed output
     */
    _verifyOutput( output, text, chars ) {

        // Allow the command characters
        if ( [ '\u001b[2K', '\u001b[1G' ].includes( output ) ) {
            return output;
        }

        // If we have a text
        if ( text && text.length ) {

            // We can check against it
            if ( output.substring( 0, text.length ) === text ) {
                return output;
            }
        } else if ( output.length === 1 || chars.indexOf( output ) >= 0 ) {

            // No text, only allow output of the spinner chars
            return output;
        }
        this.intercepted.push( output );
        return '';
    }

    /**
     * Clear the existing interceptor if set
     * @protected
     * @return {void}
     */
    _clearIntercept() {
        if ( this._safe ) {
            this._safe();
            this._safe = null;
        }
    }

    /**
     * Start progress
     * @param {string} text - Text prefix
     * @param {string} chars - Animation loop
     * @param {boolean} safemode - Set false to disable safe mode
     * @return {Array<string>} - Array of intercepted output
     */
    start( text, chars = '|/-\\', safemode = true ) {
        const last = this.stop();

        // Setup new spinner
        const { Spinner } = requireOptional( 'cli-spinner', '^0.2.10', true );
        this._ = new Spinner( ( text ? text + ' ' : '' ) + '%s' );
        this._.setSpinnerString( chars );

        // In safe mode allow the spinner to intercept colliding output
        if ( safemode ) {
            this._safe = this._intercept( ( output ) => { return this._verifyOutput( output, text, chars ); } );
        }
        this._.start();
        return last;
    }

    /**
     * Stop progress
     * @param {boolean} keep - Keep any intercepted data
     * @return {Array<string>} - Array of intercepted output
     */
    stop( keep = false ) {
        if ( this._ ) {
            this._.stop( true );
            this._ = null;
        }
        this._clearIntercept();
        const last = this.intercepted;
        if ( !keep ) this.intercepted = [];
        return last;
    }
};
