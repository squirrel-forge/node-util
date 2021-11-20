/**
 * Utilities
 * @type {{FsInterface: FsInterface, Warning: Warning, parseInput: function((Array<string>|null)): CliInputData, trimChar: function(string, string=, number=): string, isUrl: function(string): boolean, isPojo: function(Object): boolean, OutputBuffer: OutputBuffer, prompt: function(boolean=): Promise<string>, CliInput: CliInput, Exception: Exception}}
 */
module.exports = {
    CliInput : require( './src/classes/CliInput' ),
    Exception : require( './src/classes/Exception' ),
    FsInterface : require( './src/classes/FsInterface' ),
    OutputBuffer : require( './src/classes/OutputBuffer' ),
    Warning : require( './src/classes/Warning' ),
    isPojo : require( './src/fn/isPojo' ),
    isUrl : require( './src/fn/isUrl' ),
    parseInput : require( './src/fn/parseInput' ),
    prompt : require( './src/fn/prompt' ),
    trimChar : require( './src/fn/trimChar' ),
};
