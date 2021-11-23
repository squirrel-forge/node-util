/**
 * Utilities
 * @type {{FsInterface: FsInterface, Progress: Progress, Warning: Warning, wait: function(number): Promise<void>, parseInput: function((Array<string>|null)): CliInputData, trimChar: function(string, string=, number=): string, isPojo: function(Object): boolean, OutputBuffer: OutputBuffer, Exception: Exception, Timer: Timer, isUrl: function(string): boolean, callback: function(string, Object, Array=): (*|null), cmd: function(string): Promise<string|ExecException>, prompt: function(boolean=): Promise<string>, CliInput: CliInput}}
 */
module.exports = {
    CliInput : require( './src/classes/CliInput' ),
    Exception : require( './src/classes/Exception' ),
    FsInterface : require( './src/classes/FsInterface' ),
    OutputBuffer : require( './src/classes/OutputBuffer' ),
    Progress : require( './src/classes/Progress' ),
    Timer : require( './src/classes/Timer' ),
    Warning : require( './src/classes/Warning' ),
    callback : require( './src/fn/callback' ),
    cmd : require( './src/fn/cmd' ),
    isPojo : require( './src/fn/isPojo' ),
    isUrl : require( './src/fn/isUrl' ),
    parseInput : require( './src/fn/parseInput' ),
    prompt : require( './src/fn/prompt' ),
    trimChar : require( './src/fn/trimChar' ),
    wait : require( './src/fn/wait' ),
};
