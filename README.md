# @squirrel-forge/node-util

Collection of basic node utilities, errors, terminal input, output, filesystem and more.

## Installation

```
npm i @squirrel-forge/node-util
```

## Usage

```
const { Class, function } = require( '@squirrel-forge/node-util' );
```

## Notes

[**Breaking changes**] since version *^1.4.0* all external dependencies were removed and made optional peer dependencies and therefore must be installed manually when required.

### Optional dependencies

These dependencies are optional and only required when using the mentioned methods or classes.
All of these must be installed manually, since they have been removed as direct dependencies.

 - [cli-spinner@^0.2.10](https://www.npmjs.com/package/cli-spinner/v/0.2.10)
   - *Progress*
 - [directory-tree@^3.0.1](https://www.npmjs.com/package/directory-tree/v/3.0.1)
   - *FsInterface.fileList*
 - [intercept-stdout@^0.1.2](https://www.npmjs.com/package/intercept-stdout/v/0.1.2)
   - *OutputBuffer*
   - *Progress*
 - [node-fetch@^2.6.7](https://www.npmjs.com/package/node-fetch/v/2.6.7)
   - *FsInterface.remote*
   - *FsInterface.remoteText*
   - *FsInterface.remoteJSON*

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
   - remote( url )*
   - remoteText( url )*
   - remoteJSON( url )*
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
   - fileList( dir, options )*
   - fileListRecursive2Flat( tree, result )
   - treeWalker( tree, callback )
 - OutputBuffer()*
   - length : number
   - allowIntercept : boolean
   - flush()
   - reduce()
   - contents()
   - start()
   - end()
   - onIntercept( handler )
   - offIntercept( handler )
 - Progress()*
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
 - requireOptional( name, version, fatal )
 - round( value, decimals )
 - simpleReplace( template, data, prefix, suffix )
 - strand()
 - strSlug( string )
 - trimChar( string, remove, limit )
 - wait( ms )

* Has dependency, see [optional dependencies](#optional-dependencies).

## Issues and docs

If you encounter any issues, please report [here](https://github.com/squirrel-forge/node-util/issues).

---
Check the sourcecode on [github](https://github.com/squirrel-forge/node-util) for detailed comments.
