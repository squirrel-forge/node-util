/**
 * Utilities
 * @type {{FsInterface: FsInterface, Progress: Progress, Warning: Warning, wait: function(number): Promise<void>, parseInput: function((Array<string>|null)): CliInputData, trimChar: function(string, string=, number=): string, simpleReplace: function(string, Object, (string|null)=, (string|null)=): string, isPojo: function(Object): boolean, OutputBuffer: OutputBuffer, Exception: Exception, leadingZeros: function(number, number=, string=): string, rand: function(number, number): number, strSlug: function(string): string, strand: function(): string, Timer: Timer, round: function(number, number=): number, convertBytes: function(number, number=, number=, boolean=, number=): (string|Object), isUrl: function(string): boolean, callback: function(string, Object, Array=): (*|null), cmd: function(string): Promise<string|ExecException>, prompt: function(boolean=): Promise<string>, CliInput: CliInput}}
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
    convertBytes : require( './src/fn/convertBytes' ),
    isPojo : require( './src/fn/isPojo' ),
    isUrl : require( './src/fn/isUrl' ),
    leadingZeros : require( './src/fn/leadingZeros' ),
    parseInput : require( './src/fn/parseInput' ),
    prompt : require( './src/fn/prompt' ),
    rand : require( './src/fn/rand' ),
    round : require( './src/fn/round' ),
    simpleReplace : require( './src/fn/simpleReplace' ),
    strand : require( './src/fn/strand' ),
    strSlug : require( './src/fn/strSlug' ),
    trimChar : require( './src/fn/trimChar' ),
    wait : require( './src/fn/wait' ),
};
