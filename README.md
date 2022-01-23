# @squirrel-forge/node-util

Collection of node utilities.

## Installation

```
npm i @squirrel-forge/node-util

```

## Usage

```
const { Class, function } = require( '@squirrel-forge/node-util' );
```

## Notes

To use *FsInterface.remote*, *FsInterface.remoteText* or *FsInterface.remoteJSON* methods you must manually install [node-fetch@^2.6.7](https://www.npmjs.com/package/node-fetch/v/2.6.7) which is currently the latest node@^10.0.0 compatible version, the explicit dependency was removed for security and low usage reasons.

### Classes

 - CliInput( cfx, args, trimQuotes, false, true )
   - trimQuotes : boolean 
   - hasArgs()
   - hasFlags()
   - flag( flag, default )
   - arg( index )
   - setArg( arg )
   - setFlag( flag )
   - getFlagsOptions( src )
   - eraseLastLine()
   - question( options )
   - ask( questions )
 - Exception( message, previous, options )
   - name : string
   - previous : *
   - stack : string
   - toString()
 - FsInterface : static
   - remote( url )
   - remoteText( url )
   - remoteJSON( url )
   - read( file, enc )
   - readText( file )
   - readJSON( file )
   - exists( file, access )
   - write( file, content )
   - dir( dir )
   - isDir( dir )
   - unlink( file )
   - relative2root( dir, root )
   - filterOptions( options )
   - filterFiles( files, options )
   - files( dir, filter )
   - fileList( dir, options )
   - fileListRecursive2Flat( tree, result )
   - treeWalker( tree, callback )
 - OutputBuffer()
   - length : number
   - allowIntercept : boolean
   - flush()
   - reduce()
   - contents()
   - start()
   - end()
   - onIntercept( handler )
   - offIntercept( handler )
 - Progress()
   - start( text, loop, safemode )
   - stop( keep )
 - StatsDisplay( cfx )
   - constructor
     - StatsDisplayException : StatsDisplayException constructor
     - StatsDisplayType : StatsDisplayType constructor
   - hasStyle( name )
   - styleAs( string, style, no-reset )
   - is_simple( value )
   - is_display_type( value )
   - show( value, result, level, heading )
   - parse( source, result )
   - display( source, output )
 - Timer
   - start( name )
   - get( name )
   - measure( name )
   - end( name )
 - Warning( message, previous, options ) extends Exception
   - name : string
   - previous : *
   - stack : string
   - toString()
   - toLocaleString()

### Functions

 - callback( name, context, args )
 - cmd( command )
 - convertBytes( bytes, decimals, style, return, unit )
 - convertHrtime( time, seconds_suffix_separrator, milliseconds_suffix, return )
 - isPojo( obj )
 - isUrl( string )
 - leadingZeros( number, length, char, reverse )
 - parseInput( args )
 - prompt( once )
 - rand( min, max )
 - round( value, decimals )
 - simpleReplace( template, data, prefix, suffix )
 - strand()
 - strSlug( string )
 - trimChar( string, remove, limit )
 - wait( ms )

## Docs

Check the sourcecode on [github](https://github.com/squirrel-forge/node-util) for extensive comments.
