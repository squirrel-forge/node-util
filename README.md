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
   - toLocaleString()
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
   - fileList( dir, options )
   - fileListRecursive2Flat( tree, result )
   - treeWalker( tree, callback )
 - OutputBuffer()
   - length : number
   - flush()
   - reduce()
   - contents()
   - start()
   - end()
 - Progress()
   - start( text, loop )
   - stop()
 - Timer
   - start( name )
   - get( name )
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
 - isPojo( obj )
 - isUrl( string )
 - leadingZeros( number, length, char )
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
