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
            if ( stDi && stDi.hasStyle( 'type_null' ) ) {
                return this.style_convert( 'type_null', value, stDi );
            }
            return 'null';
        }
        const to = typeof value;
        switch ( to ) {
        case 'undefined' :
            if ( stDi && stDi.hasStyle( 'type_' + to ) ) {
                return this.style_convert( 'type_' + to, to, stDi );
            }
            return to;
        case 'boolean' :
            value = value ? 'true' : 'false';
            if ( stDi && stDi.hasStyle( 'type_' + to ) ) {
                return this.style_convert( 'type_' + to, value, stDi );
            }
            return value;
        case 'number' :
            if ( stDi && stDi.hasStyle( 'type_' + to ) ) {
                return this.style_convert( 'type_' + to, '' + value, stDi );
            }
            return '' + value;
        case 'string' :
            if ( stDi && stDi.hasStyle( 'type_' + to ) ) {
                return this.style_convert( 'type_' + to, value, stDi );
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
        if ( stDi && stDi.hasStyle( 'type_unknown' ) ) {
            return this.style_convert( 'type_unknown', '[object Unknown]', stDi );
        }
        return '';
    }

    /**
     * Null style convert
     * @param {*} value - Any string convertable
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of value
     */
    static convert_null( value, stDi ) {
        return this.style_convert( 'type_null', '' + value, stDi );
    }

    /**
     * Undefined style convert
     * @param {*} value - Any string convertable
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of value
     */
    static convert_undefined( value, stDi ) {
        return this.style_convert( 'type_undefined', '' + value, stDi );
    }

    /**
     * Boolean style convert
     * @param {*} value - Any string convertable
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of value
     */
    static convert_boolean( value, stDi ) {
        return this.style_convert( 'type_boolean', '' + value, stDi );
    }

    /**
     * Number style convert
     * @param {*} value - Any string convertable
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of value
     */
    static convert_number( value, stDi ) {
        return this.style_convert( 'type_number', '' + value, stDi );
    }

    /**
     * Unknown style convert
     * @param {*} value - Any string convertable
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of value
     */
    static convert_unknown( value, stDi ) {
        return this.style_convert( 'type_unknown', '' + value, stDi );
    }

    /**
     * No style convert
     * @param {*} value - Any string convertable
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of value
     */
    static convert_none( value, stDi ) {
        if ( stDi && stDi.hasStyle( 'none' ) ) {
            return this.style_convert( 'none', value + '', stDi );
        }
        return value + '';
    }

    /**
     * Array to oneliner
     * @param {Array} value - Array of values
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of array values
     */
    static convert_asline( value, stDi ) {
        const result = [];
        for ( let i = 0; i < value.length; i++ ) {
            if ( this.is_type( value[ i ] ) ) {
                const typed = new this( ...value[ i ] );
                typed.parent = stDi;
                result.push( typed + '' );
            } else {
                result.push( this.convert_any( value[ i ], stDi ) );
            }
        }
        return result.join( ' ' );
    }

    /**
     * Percent converter
     * @param {Array} value - Percent value
     * @param {StatsDisplay} stDi - StatsDisplay instance
     * @return {string} - Readable string representation of percent
     */
    static convert_percent( value, stDi ) {
        return this.style_convert( 'type_number', '' + value, stDi )
            + this.style_convert( 'unit', '%', stDi );
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
        const time = convertHrtime( value, 's ', 'ms', true );
        const styles = [ 'type_number', 'unit', 'type_number', 'unit' ];
        const result = [];
        for ( let i = 0; i < time.length; i++ ) {
            result.push( this.style_convert( styles[ 4 + i - time.length ], time[ i ], stDi ) );
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
        return this.style_convert( 'type_number', size.value, stDi )
            + ' ' + this.style_convert( 'unit', size.unit, stDi );
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
        if ( ![ 'string', 'number' ].includes( to ) ) {
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
     * Abstract type value checker
     * @param {*} value - Value to check
     * @return {boolean} - True if abstract display type
     */
    static is_type( value ) {
        return value instanceof Array
            && value.length === 2
            && typeof value[ 1 ] === 'string'
            && value[ 1 ].length
            && this.has_type( value[ 1 ] );
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
        this.header = '[bmagenta]' + ' '.repeat( 10 ) + '[re]'
            + '[fmagenta][  [fwhite]STATS  [fmagenta]]'
            + '[bmagenta]' + ' '.repeat( 10 ) + '[re]';

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

            type_null : '[fblue]',
            type_undefined : '[fwhite]',
            type_boolean : '[fgreen]',
            type_number : '[fcyan]',
            type_string : '[fyellow]',
            type_unknown : '[fred]',

            none : '[fwhite]',
            unit : '[fwhite]',

            pathDir : '[fyellow]',
            pathFile : '[fwhite]',
            pathExt : '[fcyan]',

            heading1 : '[fmagenta][bo]',
            heading2 : '[fblue][bo]',
            heading3 : '[fwhite]',
            heading4 : '[fwhite]',
            heading5 : '[fwhite]',
            heading6 : '[fwhite]',
        };

        /**
         * Level indent factor
         * @public
         * @property
         * @type {number}
         */
        this.indentFactor = 1;

        /**
         * Start on level
         * @public
         * @property
         * @type {number}
         */
        this.indentStart = 1;

        /**
         * Collection of pieces used for rendering the stats
         * @public
         * @property
         * @type {Object}
         */
        this.pieces = { headingSpacer : ' : ', indentChar : ' ' };

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
     * @public
     * @param {*} value - Any value
     * @return {boolean} - True if simple value
     */
    is_simple( value ) {
        return value === null || typeof value !== 'object';
    }

    /**
     * Abstract type value checker
     * @public
     * @param {*} value - Any value
     * @return {boolean} - True if abstract display type
     */
    is_display_type( value ) {
        return StatsDisplayType.is_type( value );
    }

    /**
     * Get indent
     * @protected
     * @param {number} level - Indent level
     * @return {string} - Indent prefix string
     */
    _indent( level ) {
        if ( level < 1 ) return '';
        return this.pieces.indentChar.repeat( level * this.indentFactor );
    }

    /**
     * Parse array
     * @protected
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
            const line = this.styleAs( heading, 'heading' + level );
            if ( !this.show( content, result, level, line ) ) {
                if ( result.length && level === this.indentStart ) {
                    result.push( '' );
                }
                result.push( this._indent( level ) + line );
                this._recursive( content, result, level + 1 );
            }
        }
    }

    /**
     * Display value
     * @public
     * @param {*} value - Value
     * @param {Array|true} result - Result array to fill
     * @param {number} level - Indent level
     * @param {null|string} heading - Heading to use
     * @return {boolean|StatsDisplayType} - True if value was displayed, or StatsDisplayType if result is set true
     */
    show( value, result, level = 1, heading = null ) {
        if ( this.is_simple( value ) ) {
            value = new StatsDisplayType( value );
        }
        if ( this.is_display_type( value ) ) {
            value = new StatsDisplayType( ...value );
        }
        if ( value instanceof StatsDisplayType ) {
            value.parent = this;
            if ( result === true || level > 1 ) {
                if ( heading ) {
                    value = heading + this.pieces.headingSpacer + value;
                } else {
                    value += '';
                }
                if ( result !== true ) {
                    value = this._indent( level ) + value;
                }
                if ( result === true ) return value;
                result.push( value );
            } else {
                result.push( this._indent( level ) + heading );
                result.push( this._indent( level + 1 ) + value );
            }
            return true;
        }
        return false;
    }

    /**
     * Parse array
     * @protected
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
            if ( !this.show( src[ i ], result, level ) ) {
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
        this._recursive( src, result, this.indentStart );
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
