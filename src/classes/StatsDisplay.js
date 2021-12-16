/**
 * Requires
 */
const Exception = require( './Exception' );
const isPojo = require( '../fn/isPojo' );
const convertHrtime = require( '../fn/convertHrtime' );
const convertBytes = require( '../fn/convertBytes' );

/**
 * StatsDisplay exception
 * @class
 */
class StatsDisplayException extends Exception {}

/**
 * StatsDisplayType
 * @class
 */
class StatsDisplayType {

    /**
     * Constructor
     * @param {*} value - Any value
     * @param {null|string} type - Value type
     */
    constructor( value, type = null ) {

        /**
         * Source value
         * @protected
         * @property
         * @type {*}
         */
        this._ = value;

        /**
         * Display type
         * @protected
         * @property
         * @type {null|string}
         */
        this._type = type;

        /**
         * StatsDisplay instance
         * @public
         * @property
         * @type {null|StatsDisplay}
         */
        this.parent = null;
    }

    /**
     * Default converter
     * @param {*} value - Any value
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of value
     */
    static convert_any( value, stDi ) {
        if ( value === null ) {
            if ( stDi && stDi.hasStyle( 'null' ) ) {
                return this.style_convert( 'null', value, stDi );
            }
            return 'null';
        }
        const to = typeof value;
        switch ( to ) {
        case 'undefined' :
            if ( stDi && stDi.hasStyle( to ) ) {
                return this.style_convert( to, to, stDi );
            }
            return to;
        case 'boolean' :
            value = value ? 'true' : 'false';
            if ( stDi && stDi.hasStyle( to ) ) {
                return this.style_convert( to, value, stDi );
            }
            return value;
        case 'number' :
            if ( stDi && stDi.hasStyle( to ) ) {
                return this.style_convert( to, '' + value, stDi );
            }
            return '' + value;
        case 'string' :
            if ( stDi && stDi.hasStyle( to ) ) {
                return this.style_convert( to, value, stDi );
            }
            return value;
        case 'object' :
            if ( typeof value.toLocaleString() === 'function' ) {
                return value.toLocaleString();
            } else if ( typeof value.toString === 'function' ) {
                return value.toString();
            } else if ( isPojo( value ) ) {
                try {
                    return JSON.stringify( value, null, 2 );
                } catch ( e ) {
                    throw new StatsDisplayException( 'Value could not be converted to json', e );
                }
            }
        }
        if ( stDi && stDi.hasStyle( 'unknown' ) ) {
            return this.style_convert( 'unknown', '', stDi );
        }
        return '';
    }

    /**
     * Hrtime converter
     * @param {Array<number>} value - Hrtime
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of hrtime
     */
    static convert_time( value, stDi ) {
        if ( !( value instanceof Array )
            || value.length !== 2
            || typeof value[ 0 ] !== 'number'
            || typeof value[ 1 ] !== 'number' ) {
            throw new StatsDisplayException( 'Invalid hrtime format: ' + typeof value );
        }
        const time = convertHrtime( value, ' s ', ' ms', true );
        const styles = [ 'timeNum1', 'timeUnit1', 'timeNum2', 'timeUnit2' ];
        const result = [];
        for ( let i = 0; i < time.length; i++ ) {
            result.push( this.style_convert( styles[ 4 - time.length ], time[ i ], stDi ) );
        }
        return result.join( '' );
    }

    /**
     * Bytes converter
     * @param {number} value - Bytes
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of bytes
     */
    static convert_bytes( value, stDi ) {
        const size = convertBytes( value, 2, 1024, true );
        return this.style_convert( 'bytesNum', size.value, stDi )
            + ' ' + this.style_convert( 'bytesUnit', size.unit, stDi );
    }

    /**
     * Path/url converter
     * @param {string} value - Path or url
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Colored representation of path or url
     */
    static convert_path( value, stDi ) {
        if ( !value.length ) {
            return '';
        }
        const result = [];
        const parts = value.split( '/' );
        const file = parts.pop().split( '.' );
        if ( parts.length ) {
            result.push( this.style_convert( 'pathDir', parts.join( '/' ) + '/', stDi ) );
        }
        const ext = file.length > 1 ? file.pop() : null;
        result.push( this.style_convert( 'pathFile', file.join( '.' ), stDi ) );
        if ( ext ) {
            result.push( this.style_convert( 'pathExt', '.' + ext, stDi ) );
        }
        return result.join( '' );
    }

    /**
     * Fatal converter
     * @param {string} value - String to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Styled representation of value
     */
    static convert_fatal( value, stDi ) {
        return this.style_convert( 'fatal', value, stDi );
    }

    /**
     * Error converter
     * @param {string} value - String to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Styled representation of value
     */
    static convert_error( value, stDi ) {
        return this.style_convert( 'error', value, stDi );
    }

    /**
     * Warning converter
     * @param {string} value - String to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Styled representation of value
     */
    static convert_warn( value, stDi ) {
        return this.style_convert( 'warn', value, stDi );
    }

    /**
     * Notice converter
     * @param {string} value - String to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Styled representation of value
     */
    static convert_notice( value, stDi ) {
        return this.style_convert( 'notice', value, stDi );
    }

    /**
     * Success converter
     * @param {string} value - String to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Styled representation of value
     */
    static convert_success( value, stDi ) {
        return this.style_convert( 'success', value, stDi );
    }

    /**
     * Valid converter
     * @param {string} value - String to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Styled representation of value
     */
    static convert_valid( value, stDi ) {
        return this.style_convert( 'valid', value, stDi );
    }

    /**
     * Alert converter
     * @param {string} value - String to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Styled representation of value
     */
    static convert_alert( value, stDi ) {
        return this.style_convert( 'alert', value, stDi );
    }

    /**
     * Show/highlight converter
     * @param {string} value - String to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Styled representation of value
     */
    static convert_show( value, stDi ) {
        return this.style_convert( 'show', value, stDi );
    }

    /**
     * Convert to style
     * @param {string} style - Style name
     * @param {string} value - Value to style
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @param {boolean} noReset - Do not reset style at end of string
     * @return {string} - Styled string
     */
    static style_convert( style, value, stDi, noReset = false ) {
        const to = typeof value;
        if ( to !== 'string' ) {
            throw new StatsDisplayException( 'Invalid value type: ' + to );
        }
        if ( typeof stDi.styleAs !== 'function' ) {
            throw new StatsDisplayException( 'Parent requires a styleAs method' );
        }
        return stDi.styleAs( value, style, noReset );
    }

    /**
     * Has type converter
     * @param {string} type - Type name
     * @return {null|string} - Converter name if available
     */
    static has_type( type ) {
        if ( type && type.length ) {
            const method = 'convert_' + type;
            if ( typeof this[ method ] === 'function' ) {
                return method;
            }
        }
        return null;
    }

    /**
     * Value getter
     * @return {string} - Displayable value
     */
    get value() {
        const method = this.constructor.has_type( this._type );
        if ( method ) {
            return this.constructor[ method ]( this._, this.parent );
        }
        return this.constructor.convert_any( this._, this.parent );
    }

    /**
     * Value setter
     * @param {*} value - Any value
     * @return {void}
     */
    set value( value ) {
        this._ = value;
    }

    /**
     * Default to string conversion
     * @return {string} - Displayable value
     */
    toString() {
        return this.value;
    }
}

/**
 * StatsDisplay
 * @class
 */
class StatsDisplay {

    /**
     * Constructor
     * @constructor
     * @param {null|console} cfx - Console or alike object
     */
    constructor( cfx = null ) {

        /**
         * Console alike reporting object
         * @protected
         * @property
         * @type {console|null}
         */
        this._cfx = cfx;

        /**
         * Stats output header
         * @public
         * @property
         * @type {string}
         */
        this.header = '[fmagenta][ [fwhite]Stats [fmagenta]][re]';

        /**
         * Output styles
         * @public
         * @property
         * @type {Object}
         */
        this.styles = {
            fatal : '[bred][fwhite]',
            error : '[bwhite][fred]',
            warn : '[byellow][fblack]',
            notice : '[fyellow]',
            success : '[bgreen][fblack]',
            valid : '[fgreen]',
            alert : '[bmagenta][fblack]',
            show : '[fmagenta]',

            timeNum1 : '[fwhite]',
            timeNum2 : '[fwhite]',
            timeUnit1 : '[fyellow]',
            timeUnit2 : '[fyellow]',

            bytesNum : '[fwhite]',
            bytesUnit : '[fwhite]',

            pathDir : '[fyellow]',
            pathFile : '[fwhite]',
            pathExt : '[fcyan]',

            heading1 : '[bwhite][fblack][bo]>[re] [fmagenta][bo]',
            heading2 : '[bwhite][fblack][bo]>[re] [fcyan][bo]',
            heading3 : '[bwhite][fblack][bo]>[re] [fcyan]',
            heading4 : '[bwhite][fblack][bo]>[re] [fcyan]',
            heading5 : '[bwhite][fblack][bo]>[re] [fcyan]',
            heading6 : '[bwhite][fblack][bo]>[re] [fcyan]',
        };

        /**
         * Level indent factor
         * @public
         * @property
         * @type {number}
         */
        this.indentFactor = 1;

        /**
         * Collection of pieces used for rendering the stats
         * @public
         * @property
         * @type {Object}
         */
        this.pieces = { headingSpacer : ' : ' };

        /**
         * Reset styles
         * @public
         * @property
         * @type {string}
         */
        this.styleReset = '[re]';
    }

    /**
     * Style is defined
     * @param {string} style - Style name
     * @return {boolean} - True if the style name is defined
     */
    hasStyle( style ) {
        return !!this.styles[ style ];
    }

    /**
     * Style string
     * @param {string} str - String to style
     * @param {string} style - Style name
     * @param {boolean} noReset - Do not reset style at end of string
     * @return {string} - Styled string
     */
    styleAs( str, style = null, noReset = false ) {
        if ( !style ) return str;
        if ( !this.hasStyle( style ) ) {
            throw new StatsDisplayException( 'Unknown style: ' + style );
        }
        return this.styles[ style ] + str + ( noReset ? '' : this.styleReset );
    }

    /**
     * Recursive parse stats object
     * @protected
     * @param {*} src - Stats object
     * @param {Array} result - Result array to fill
     * @param {number} level - Indent level
     * @return {void}
     */
    _recursive( src, result, level ) {
        if ( src === null || typeof src !== 'object' ) {
            throw new StatsDisplayException( 'Invalid source type: ' + typeof src );
        }
        if ( src instanceof Array ) {
            this._array( src, result, level );
        } else if ( isPojo( src ) ) {
            this._object( src, result, level );
        } else if ( typeof src.toLocaleString === 'function' ) {
            result.push( src.toLocaleString() );
        } else if ( typeof src.toString === 'function' ) {
            result.push( src.toString() );
        } else {
            throw new StatsDisplayException( 'Cannot convert unknown object' );
        }
    }

    /**
     * Simple type value checker
     * @protected
     * @param {*} value - Any value
     * @return {boolean} - True if simple value
     */
    _is_simple( value ) {
        return value === null || typeof value !== 'object';
    }

    /**
     * Abstract type value checker
     * @protected
     * @param {*} value - Any value
     * @return {boolean} - True if abstract display type
     */
    _is_display_type( value ) {
        return value instanceof Array
            && value.length === 2
            && typeof value[ 1 ] === 'string'
            && StatsDisplayType.has_type( value[ 1 ] );
    }

    /**
     * Get indent
     * @protected
     * @param {number} level - Indent level
     * @return {string} - Indent prefix string
     */
    _indent( level ) {
        level--;
        if ( level < 1 ) return '';
        return ' '.repeat( level * this.indentFactor );
    }

    /**
     * Parse array
     * @param {Object} src - Stats object
     * @param {Array} result - Result array to fill
     * @param {number} level - Indent level
     * @return {void}
     */
    _object( src, result, level ) {
        if ( !isPojo( src ) ) {
            throw new StatsDisplayException( 'Source must be a plain object' );
        }
        const entries = Object.entries( src );
        for ( let i = 0; i < entries.length; i++ ) {
            const [ heading, content ] = entries[ i ];
            const line = this._indent( level ) + this.styleAs( heading, 'heading' + level );
            if ( !this._display( content, result, level, line ) ) {
                result.push( line );
                this._recursive( content, result, level + 1 );
            }
        }
    }

    /**
     * Display value
     * @param {*} value - Value
     * @param {Array} result - Result array to fill
     * @param {number} level - Indent level
     * @param {null|string} heading - Heading to use
     * @return {boolean} - True if value was displayed
     */
    _display( value, result, level, heading = null ) {
        if ( this._is_simple( value ) ) {
            value = new StatsDisplayType( value );
        }
        if ( this._is_display_type( value ) ) {
            value = new StatsDisplayType( ...value );
        }
        if ( value instanceof StatsDisplayType ) {
            value.parent = this;
            if ( level > 1 ) {
                if ( heading ) {
                    value = heading + this.pieces.headingSpacer + value;
                }
                result.push( value );
            } else {
                result.push( heading );
                result.push( this._indent( level + 1 ) + value );
            }
            return true;
        }
        return false;
    }

    /**
     * Parse array
     * @param {Array} src - Stats array
     * @param {Array} result - Result array to fill
     * @param {number} level - Indent level
     * @return {void}
     */
    _array( src, result, level ) {
        if ( !( src instanceof Array ) ) {
            throw new StatsDisplayException( 'Source must be an array' );
        }
        for ( let i = 0; i < src.length; i++ ) {
            if ( !this._display( src[ i ], result, level ) ) {
                this._recursive( src, result, level );
            }
        }
    }

    /**
     * Parse stats object
     * @public
     * @param {Object} src - Stats object
     * @param {Array} result - Result array to fill
     * @return {void}
     */
    parse( src, result ) {
        this._recursive( src, result, 1 );
    }

    /**
     * Generate stats output
     * @public
     * @param {Object} src - Stats object
     * @param {boolean} output - Output with cfx instance
     * @return {Array<string>} - Generated output
     */
    display( src, output = true ) {

        // Heading
        const result = [];
        if ( this.header ) result.push( this.header );

        // Process source object
        this.parse( src, result );

        // Display with cfx if available
        if ( output && this._cfx && typeof this._cfx.log === 'function' ) {
            for ( let i = 0; i < result.length; i++ ) {
                this._cfx.log( result[ i ] );
            }
        }

        // Return output lines
        return result;
    }
}

// Export StatsDisplayException and StatsDisplayType as static property constructor
StatsDisplay.StatsDisplayException = StatsDisplayException;
StatsDisplay.StatsDisplayType = StatsDisplayType;
module.exports = StatsDisplay;
