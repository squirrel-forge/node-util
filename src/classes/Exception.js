/**
 * Requires
 */
const { inspect } = require( 'util' );

/**
 * Exception Class
 * @class
 */
module.exports = class Exception extends Error {

    /**
     * Convert any value to string
     * @param {*} anything - Value to convert
     * @return {string} - Converted value
     */
    static convertAny( anything ) {
        return inspect( anything, { depth : 4, colors : true } );
    }

    /**
     * Get error stack
     * @param {string} prefix - Return prefix
     * @param {Object} previous - Some form of error object
     * @param {boolean} showStack - Can show stack, default: true
     * @param {boolean} showPrevious - Show previous boolean for toString method, default: true
     * @return {null|string} - Converted error string if available
     */
    static getErrorFromObject( prefix, previous, showStack = true, showPrevious = true ) {

        // Something Error like with a stack
        if ( showStack && ( typeof previous.stack === 'string' || typeof previous.stack.toString === 'function' ) ) {
            return prefix + previous.stack;
        }

        // Something Error like
        if ( typeof previous.toString === 'function' ) {
            return prefix + previous.toString( showPrevious );
        }

        // At least it has a message property
        if ( typeof previous.message === 'string' && previous.message.length ) {
            return prefix + previous.message;
        }
        return null;
    }

    /**
     * Get string from previous error
     * @param {string} prefix - Return prefix
     * @param {Object} previous - Some form of error object
     * @param {boolean} showStack - Can show stack, default: true
     * @param {boolean} showPrevious - Show previous boolean for toString method, default: true
     * @return {string} - Converted error string or empty
     */
    static getFromPrevious( prefix, previous, showStack = true, showPrevious = true ) {
        if ( previous ) {
            let converted = null;
            switch ( typeof previous ) {
            case 'string' :
                return prefix + previous;
            case 'object' :
                converted = this.getErrorFromObject( prefix, previous, showStack, showPrevious );
            }
            if ( converted ) return converted;

            // We have nothing to make sense of, let's convert and show what we have
            return prefix + 'Converted data:\n' + this.convertAny( previous );
        }
        return '';
    }

    /**
     * Constructor
     * @constructor
     * @param {string} message - Exception message
     * @param {null|string|Error|Exception} previous - Previous exception
     * @param {string} prefix - Message prefix
     * @param {string} suffix - Message suffix
     */
    constructor( message, previous = null, { prefix = '\x1b[41m\x1b[37m ', suffix = ' \x1b[0m' } = {} ) {
        message = prefix + message + suffix;
        super( message );
        this.name = this.constructor.name;
        this.previous = previous;
        Error.captureStackTrace( this, this.constructor );
        this.stack = this.stack + this.constructor.getFromPrevious( '\n[Previous] ', previous );
    }

    /**
     * Convert to string
     * @public
     * @param {boolean} showPrevious - Append previous, default: true
     * @return {string} - String representation of the exception
     */
    toString( showPrevious = true ) {
        return super.toString()
            + ( showPrevious ?
                this.constructor.getFromPrevious( '\n > ', this.previous, false )
                : '' );
    }
};
