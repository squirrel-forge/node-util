/**
 * Requires
 */
const parseInput = require( '../fn/parseInput' );
const trimChar = require( '../fn/trimChar' );
const prompt = require( '../fn/prompt' );

/**
 * @typedef {Function} QuestionInputValidator
 * @param {*} value - Value to check
 * @return {boolean} - True if valid
 */

/**
 * @typedef {Object} QuestionObject
 * @property {string} question - Question text
 * @property {boolean} is_bool - Boolean question, default: false
 * @property {null|Function|QuestionInputValidator} validate - Input validator, default: null
 * @property {boolean} skippable - False to require a valid answer, default: true
 * @property {boolean} last - True to stop asking questions on valid value inside a loop, default: null
 */

/**
 * Cli input
 * @class
 * @type {CliInput}
 */
module.exports = class CliInput {

    /**
     * Constructor
     * @constructor
     * @param {null|console} cfx - Console or alike object
     * @param {null|Array<string>} args - Arguments, options and flags
     * @param {boolean} trimQuotes - Trim single and double quotes from options input
     * @param {null|Array<string>} false_values - List of strings that represent a false value
     * @param {null|Array<string>} true_values - List of strings that represent a true value
     */
    constructor( cfx = null, args = null, trimQuotes = true, false_values = null, true_values = null ) {

        /**
         * Console alike reporting object
         * @protected
         * @property
         * @type {console|null}
         */
        this._cfx = cfx;

        /**
         * False values
         * @protected
         * @property
         * @type {Array<string>|string[]}
         */
        this._f = false_values || [ '0', 'n', 'no', 'f', 'false', 'disable' ];

        /**
         * True values
         * @protected
         * @property
         * @type {Array<string>|string[]}
         */
        this._t = true_values || [ '1', 'y', 'yes', 't', 'true', 'enable' ];

        /**
         * Parsed input object
         * @protected
         * @property
         * @type {CliInputData}
         */
        this._i = parseInput( args );

        /**
         * Trim quotes option
         * @public
         * @property
         * @type {boolean}
         */
        this.trimQuotes = trimQuotes;
    }

    /**
     * Has arguments
     * @return {number} - Larger than 0 if arguments available
     */
    hasArgs() {
        return this._i.args.length;
    }

    /**
     * Has flags
     * @return {number} - Larger than 0 if flags available
     */
    hasFlags() {
        return this._i.flags.length;
    }

    /**
     * Get flag/option value
     * @public
     * @param {string} flag - Flag name including dash'es
     * @param {null|*} default_value - Default value if flag not set
     * @return {null|boolean|string|*} - Flag {boolean}, option {string} or default {*} value
     */
    flag( flag, default_value = null ) {
        let value = default_value;
        for ( let i = 0; i < this._i.flags.length; i++ ) {
            if ( this._i.flags[ i ] instanceof Array && this._i.flags[ i ][ 0 ] === flag ) {
                value = this.trimQuotes ?
                    trimChar( this._i.flags[ i ][ 1 ], '"\'', 1 )
                    : this._i.flags[ i ][ 1 ];
            } else if ( this._i.flags[ i ] === flag ) {
                value = true;
            }
        }
        return value;
    }

    /**
     * Get argument by index
     * @public
     * @param {number} index - Argument index
     * @return {null|string} - Argument value if available
     */
    arg( index = 0 ) {
        if ( this._i.args[ index ] ) {
            return this.trimQuotes ?
                trimChar( this._i.args[ index ], '"\'', 1 )
                : this._i.args[ index ];
        }
        return null;
    }

    /**
     * Set arguments
     * @param {string|Array<string>} arg - String is appended, array replaces
     * @return {void}
     */
    setArg( arg ) {
        if ( arg instanceof Array ) {
            this._i.args = [ ...arg ];
        } else {
            this._i.args.push( arg );
        }
    }

    /**
     * Set flags and options
     * @param {string|Array<string>} flag - String is appended, array replaces
     * @return {void}
     */
    setFlag( flag ) {
        if ( flag instanceof Array ) {
            this._i.flags = [ ...flag ];
        } else {
            this._i.flags.push( flag );
        }
    }

    /**
     * Get flags and options as object
     * @public
     * @param {{name:['short','long','default',boolean,boolean]}} src - Options source map
     * @return {{name:*}} - Map of flag and option values
     */
    getFlagsOptions( src ) {
        const check = Object.entries( src );
        const res = {};
        for ( let i = 0; i < check.length; i++ ) {
            const [ short, long, default_value, is_bool, allow_bool_string ] = check[ i ][ 1 ];
            const name = check[ i ][ 0 ];
            res[ name ] = this.flag( long ) || this.flag( short, default_value );

            const is_str = typeof res[ name ] === 'string';
            if ( is_bool && res[ name ] !== default_value && is_str && !allow_bool_string ) {

                // With boolean option force a boolean type value if its not the default value
                res[ name ] = this._f.indexOf( res[ name ].toLowerCase() ) < 0;
            } else if ( is_bool === false && !is_str ) {

                // Not a bool option, force the default value if not a string
                res[ name ] = default_value;
            }
        }
        return res;
    }

    /**
     * Erase the last line of output
     * @public
     * @return {void}
     */
    eraseLastLine() {
        process.stdout.write( '\x1b[K\x1b[1A\x1b[K' );
    }

    /**
     * Ask a question
     * @public
     * @param {string} question - Question text
     * @param {boolean} is_bool - Boolean question, default: false
     * @param {null|Function|QuestionInputValidator} validate - Input validator, default: null
     * @param {boolean} skippable - False to require a valid answer, default: true
     * @param {null|*} default_value - Default value to use on skip, default: null
     * @param {boolean} confirm_bool - Skippable and bool set answer to true, default: false
     * @param {boolean} last - True to stop asking questions on valid value inside a loop, default: null
     * @param {string} text_skip - Text to show on skip, default: 'skipping'
     * @param {string} text_confirm - Text to show on confirm, default: 'yes'
     * @param {string} text_prefix - Prefix for skip and confirm text, default: '  > '
     * @return {Promise<{is_last: boolean, answer: (string|boolean)}>} - Response data
     */
    async question( {
        question = null,
        is_bool = false,
        validate = null,
        skippable = true,
        default_value = null,
        confirm_bool = false,
        last = null,
        text_skip = 'skipped',
        text_confirm = 'yes',
        text_prefix = '  > ',
    } = {} ) {
        this._cfx.log( '[bwhite][fblack]  [ul]' + question + '[re][bwhite]  [re]' );

        // Return value must be a boolean
        if ( is_bool ) {

            /**
             * Boolean validator
             * @param {*} answer - Value to check
             * @return {boolean} - True if valid
             */
            validate = ( answer ) => {
                return typeof answer === 'boolean';
            };

        } else if ( typeof validate !== 'function' ) {

            /**
             * Default string validator
             * @param {*} answer - Value to check
             * @return {boolean} - True if non empty string
             */
            validate = ( answer ) => {
                return typeof answer === 'string' && answer.length;
            };
        }

        // Get answer
        let answer = null, is_last = false, tries = false;
        do {
            if ( tries ) {
                this.eraseLastLine();
            }
            answer = await prompt();
            answer = answer.trim();

            // Question is skippable
            if ( skippable && answer.length === 0 ) {
                answer = default_value;
                if ( !tries ) {
                    this.eraseLastLine();
                    if ( !confirm_bool ) {
                        this._cfx.log( text_prefix + text_skip );
                    } else {
                        this._cfx.log( text_prefix + text_confirm );
                    }
                }
                if ( confirm_bool ) {
                    answer = true;
                }
                break;
            }

            // Get requested type
            if ( is_bool ) {

                // Matches a false value
                if ( answer && this._f.indexOf( answer.toLowerCase() ) > -1 ) {
                    answer = false;

                    // Last if option is false
                    if ( last === false ) {
                        is_last = true;
                    }
                }

                // Matches a true value
                if ( answer && this._t.indexOf( answer.toLowerCase() ) > -1 ) {
                    answer = true;

                    // Last if option is true
                    if ( last === true ) {
                        is_last = true;
                    }
                }

            }

            tries = true;
        } while ( !validate( answer ) );

        // Last if not a bool and option is true
        if ( !is_bool && last === true ) {
            is_last = true;
        }
        return { answer, is_last };
    }

    /**
     * Ask multiple questions
     * @param {{name: QuestionObject}} questions - Object with result property names and values being question objects
     * @return {Promise<{name: *}>} - Response object
     */
    async ask( questions ) {
        process.stdin.setEncoding( 'utf-8' );
        const answers = {};
        const entries = Object.entries( questions );
        for ( let i = 0; i < entries.length; i++ ) {
            const [ name, question ] = entries[ i ];
            const { answer, is_last } = await this.question( question );

            // Set response only if we have an answer
            if ( answer !== null && typeof answer !== 'undefined' ) {
                answers[ name ] = answer;

                // Cancel asking and return response object
                if ( is_last ) {
                    break;
                }
            }
        }
        return answers;
    }
};
