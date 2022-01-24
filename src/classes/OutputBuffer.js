/**
 * Requires
 */
const requireOptional = require( '../fn/requireOptional' );
const intercept = requireOptional( 'intercept-stdout', '^0.1.2', true );

/**
 * Output Buffer class
 * @class
 */
module.exports = class OutputBuffer {

    /**
     * Constructor
     * @constructor
     */
    constructor() {

        /**
         * End callback
         * @protected
         * @type {null|Function}
         */
        this._end = null;

        /**
         * Buffer contents
         * @protected
         * @type {Array<string>}
         */
        this._ = [];

        /**
         * Input handlers
         * @protected
         * @property
         * @type {Array<start>}
         */
        this._h = [];

        /**
         * Allow intercept decision
         * @public
         * @property
         * @type {boolean}
         */
        this.allowIntercept = false;
    }

    /**
     * Flush buffer
     * @return {OutputBuffer} - Self instance
     */
    flush() {
        this._ = [];
        return this;
    }

    /**
     * Get buffer contents and flush
     * @return {Array<string>} - Buffer contents
     */
    reduce() {
        const buffer = this.contents();
        this.flush();
        return buffer;
    }

    /**
     * Get buffer contents
     * @return {Array<string>} - Buffer contents
     */
    contents() {
        return this._;
    }

    /**
     * Get buffer length
     * @return {number} - Number of entries in buffer
     */
    get length() {
        return this._.length;
    }

    /**
     * Set buffer length
     * @param {number} value - Cannot be set
     * @throws {Error}
     * @return {void}
     */
    set length( value ) {
        throw new Error( 'Cannot set length property on OutputBuffer' );
    }

    /**
     * Start buffering
     * @return {OutputBuffer} - Self instance
     */
    start() {
        this._end = intercept( ( text ) => {
            if ( !this.allowIntercept || this._shouldIntercept( text ) ) {
                this._.push( text );
                return '';
            }
            return text;
        } );
        return this;
    }

    /**
     * End buffering
     * @return {OutputBuffer} - Self instance
     */
    end() {
        if ( typeof this._end === 'function' ) {
            this._end();
            this._end = null;
        }
        return this;
    }

    /**
     * Should intercept
     * @protected
     * @param {string} text - Intercepted output
     * @return {boolean} - True to intercept
     */
    _shouldIntercept( text ) {
        if ( !this._h.length ) return true;
        for ( let i = 0; i < this._h.length; i++ ) {
            const should = this._h[ i ]( text );
            if ( typeof should === 'boolean' ) return should;
        }
        return false;
    }

    /**
     * Set intercept handler
     * @param {Function} handler - Intercept checker
     * @return {void}
     */
    onIntercept( handler ) {
        if ( typeof handler !== 'function' ) {
            throw new Error( 'Invalid handler argument, must be a function' );
        }
        this._h.push( handler );
    }

    /**
     * Remove intercept handler or clear all
     * @param {true|Function} handler - True to remove all
     * @return {void}
     */
    offIntercept( handler ) {
        if ( !( handler === true || typeof handler === 'function' ) ) {
            throw new Error( 'Invalid handler argument, must be a function or true to remove all handlers' );
        }
        if ( handler === true ) {
            this._h = [];
        } else {
            for ( let i = 0; i < this._h.length; i++ ) {
                if ( this._h[ i ] === handler ) this._h.splice( i, 1 );
            }
        }
    }
};
