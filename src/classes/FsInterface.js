/**
 * Requires
 */
const path = require( 'path' );
const fs = require( 'fs' );
const requireOptional = require( '../fn/requireOptional' );
const Exception = require( './Exception' );

/**
 * FsInterface exception
 * @class
 */
class FsInterfaceException extends Exception {}

/**
 * File system interface
 * @class
 * @type {FsInterface}
 */
class FsInterface {

    /**
     * Read remote file as buffer
     * @public
     * @param {string} url - Url to file
     * @return {Promise<Buffer|FsInterfaceException|null>} - Buffer or null on error
     */
    static remote( url ) {
        return new Promise( ( resolve, reject ) => {

            // Get node-fetch or throw with requirement
            const fetch = requireOptional( 'node-fetch', '^2.6.7', true );

            /**
             * Successfully loaded
             * @param {Object} res - Fetch buffer
             * @return {Promise<void>} - Possibly throws errors in strict mode
             */
            const success = async function( res ) {
                if ( res.ok ) {
                    const file_buffer = await res.buffer();
                    resolve( file_buffer );
                } else {
                    reject( new FsInterfaceException( res.status + '#' + res.statusText + ' for: ' + url ) );
                }
            };

            // Fetch file form url
            fetch( url ).then( success ).catch( ( err ) => {
                reject( new FsInterfaceException( 'Failed to fetch url: ' + url, err ) );
            } );
        } );
    }

    /**
     * Read remote text file
     * @public
     * @param {string} url - Url to file
     * @throws {FsInterfaceException}
     * @return {Promise<string|null>} - UTF8 string
     */
    static async remoteText( url ) {
        const buf = await FsInterface.remote( url );
        if ( buf instanceof Error ) {
            throw buf;
        }
        return buf ? buf.toString( 'utf8' ) : null;
    }

    /**
     * Read remote json file
     * @public
     * @param {string} url - Url to file
     * @throws {FsInterfaceException}
     * @return {Promise<Array|Object|null>} - JSON data
     */
    static async remoteJSON( url ) {
        const text = await FsInterface.remoteText( url );
        if ( text ) {
            try {
                return JSON.parse( text );
            } catch ( e ) {
                throw new FsInterfaceException( 'Failed to load JSON: ' + url, e );
            }
        }
        return null;
    }

    /**
     * Read local file as buffer
     * @public
     * @param {string} file - Path to file
     * @param {string} enc - Charset
     * @return {Promise<Buffer|FsInterfaceException|null>} - Buffer or null on error
     */
    static read( file, enc = 'utf8' ) {
        return new Promise( ( resolve, reject ) => {
            fs.readFile( file, enc, ( err, content ) => {
                if ( err ) {
                    reject( new FsInterfaceException( 'Failed to read file: ' + file, err ) );
                } else {
                    const buffer = Buffer.from( content );
                    resolve( buffer );
                }
            } );
        } );
    }

    /**
     * Read local text file
     * @public
     * @param {string} file - Path to file
     * @throws {FsInterfaceException}
     * @return {Promise<string|null>} - UTF8 string
     */
    static async readText( file ) {
        const buf = await FsInterface.read( file, 'utf8' );
        if ( buf instanceof Error ) {
            throw buf;
        }
        return buf ? buf.toString( 'utf8' ) : null;
    }

    /**
     * Read local json file
     * @public
     * @param {string} file - Path to file
     * @throws {FsInterfaceException}
     * @return {Promise<Array|Object|null>} - JSON data
     */
    static async readJSON( file ) {
        const text = await FsInterface.readText( file );
        if ( text ) {
            try {
                return JSON.parse( text );
            } catch ( e ) {
                throw new FsInterfaceException( 'Failed to load file: ' + file, e );
            }
        }
        return null;
    }

    /**
     * Check if local file exists
     * @public
     * @param {string} file - Path to file
     * @param {string} type - Access type
     * @return {Promise<boolean>} - True if file exists
     */
    static exists( file, type = 'R_OK' ) {
        return new Promise( ( resolve ) => {
            fs.access( file, fs.constants[ type ], ( err ) => {
                if ( err ) {
                    resolve( false );
                } else {
                    resolve( true );
                }
            } );
        } );
    }

    /**
     * Write local file
     * @public
     * @param {string} file - Filepath to write
     * @param {string} content - File content
     * @return {Promise<boolean|FsInterfaceException>} - True if the file was created
     */
    static write( file, content ) {
        return new Promise( ( resolve, reject ) => {
            fs.writeFile( file, content, ( err ) => {
                if ( err ) {
                    reject( new FsInterfaceException( 'Failed to write file: ' + file, err ) );
                } else {
                    resolve( true );
                }
            } );
        } );
    }

    /**
     * Copy local file
     * @public
     * @param {string} source - Source file
     * @param {string} target - Target file
     * @return {Promise<boolean|FsInterfaceException>} - True if the file was copied
     */
    static copy( source, target ) {
        return new Promise( ( resolve, reject ) => {
            fs.copyFile( source, target, ( err ) => {
                if ( err ) {
                    reject( new Exception( 'Failed to copy: ' + source + ' to: ' + target , err ) );
                } else {
                    resolve( true );
                }
            } );
        } );
    }

    /**
     * Write local dir
     * @public
     * @param {string} dir - Directory path
     * @return {Promise<boolean|FsInterfaceException>} - True if directory exists or was created
     */
    static dir( dir ) {
        return new Promise( ( resolve, reject ) => {
            fs.mkdir( dir, { recursive : true }, ( err ) => {
                if ( err ) {
                    reject( new FsInterfaceException( 'Failed to create directory: ' + dir, err ) );
                } else {
                    resolve( true );
                }
            } );
        } );
    }

    /**
     * Is local dir
     * @public
     * @param {string} dir - Directory path
     * @return {boolean} - True if directory exists
     */
    static isDir( dir ) {
        return fs.lstatSync( dir ).isDirectory();
    }

    /**
     * Delete file
     * @public
     * @param {string} file - Path to file
     * @return {Promise<true|FsInterfaceException|null>} - True or null on error
     */
    static unlink( file ) {
        return new Promise( ( resolve, reject ) => {
            fs.unlink( file, ( err ) => {
                if ( err ) {
                    reject( new FsInterfaceException( 'Failed to delete file: ' + file, err ) );
                } else {
                    resolve( true );
                }
            } );
        } );
    }

    /**
     * Get relative to root path
     * @public
     * @param {string} dir - Source path
     * @param {string} root - Included root path
     * @throws {FsInterfaceException}
     * @return {string} - Path relative to root
     */
    static relative2root( dir, root ) {

        // Directory must be a descendant of root
        if ( dir.substring( 0, root.length ) !== root ) {
            throw new FsInterfaceException( 'Path "' + dir + '" must be nested in root: ' + root );
        }
        const rel = dir.substring( root.length );

        // Need to remove the absolute path slash
        if ( rel.length && rel[ 0 ] === path.sep ) {
            return rel.substring( 1 );
        }
        return rel;
    }

    /**
     * Get filter options from shortcuts
     * @public
     * @param {null|string|Object|{exclude:RegExp,extensions:RegExp}} options - Options input
     * @return {null|{exclude:RegExp,extensions:RegExp}} - Options object or null
     */
    static filterOptions( options ) {
        if ( options === 'json' ) {
            options = { extensions : /\.json/ };
        } else if ( options === 'js' ) {
            options = { extensions : /\.js/ };
        } else if ( typeof options !== 'object' ) {
            return null;
        }
        return options;
    }

    /**
     * Filter files array result
     * @public
     * @param {Array} files - Files array
     * @param {null|string|{exclude:RegExp,extensions:RegExp}} options - directory-tree like options
     * @return {Array<string>} - Filtered files
     */
    static filterFiles( files, options ) {

        // Options resolve shortcut
        options = FsInterface.filterOptions( options );

        // Skip if no filter selected
        if ( options === null ) {
            return files;
        }

        // Filter files
        const result = [];
        for ( let i = 0; i < files.length; i++ ) {
            const file = files[ i ];

            // Skip if it matches the exclude regex
            if ( options.exclude ) {
                const excludes = options.exclude instanceof Array ? options.exclude : [ options.exclude ];
                if ( excludes.some( ( exclusion ) => { return exclusion.test( file.toLowerCase() ); } ) ) {
                    continue;
                }
            }

            // Skip if it does not match the extension regex
            if ( options.extensions && !options.extensions.test( path.extname( file ).toLowerCase() ) ) {
                continue;
            }

            // Add to results
            result.push( file );
        }
        return result;
    }

    /**
     * Get files list
     * @public
     * @param {string} dir - Source directory
     * @param {Object|{exclude:RegExp,extensions:RegExp}} filter - directory-tree options
     * @return {Promise<Array<string>|FsInterfaceException|null>} - Array or null on error
     */
    static files( dir, filter ) {
        return new Promise( ( resolve, reject ) => {
            fs.readdir( dir, ( err, files ) => {
                if ( err ) {
                    reject( new FsInterfaceException( 'Failed to read directory: ' + dir, err ) );
                } else {
                    for ( let i = 0; i < files.length; i++ ) {
                        files[ i ] = path.resolve( dir, files[ i ] );
                    }
                    if ( filter ) {
                        resolve( FsInterface.filterFiles( files, filter ) );
                    } else {
                        resolve( files );
                    }
                }
            } );
        } );
    }

    /**
     * Get files list recursive
     * @public
     * @param {string} dir - Source directory
     * @param {('json'|'js')|Object|{exclude:RegExp,extensions:RegExp}} options - directory-tree options
     * @return {Array<string>} - List of files
     */
    static fileList( dir, options ) {

        // Get directory-tree or throw with requirement
        const dirTree = requireOptional( 'directory-tree', '^3.0.1', true );

        // Options resolve shortcut
        options = FsInterface.filterOptions( options );

        // Get files tree
        const tree = dirTree( dir, options );
        const result = [];

        // Build flat results array
        if ( tree && tree.children ) {
            FsInterface.fileListRecursive2Flat( tree.children, result );
        }
        return result;
    }

    /**
     * Convert tree to file list
     * @public
     * @param {Object} tree - Tree data
     * @param {Array<string>} result - Files list
     * @return {void}
     */
    static fileListRecursive2Flat( tree, result ) {
        for ( let i = 0; i < tree.length; i++ ) {
            if ( tree[ i ].children ) {

                // Iterate down the tree
                FsInterface.fileListRecursive2Flat( tree[ i ].children, result );
            } else {

                // Add path to list
                result.push( tree[ i ].path );
            }
        }
    }

    /**
     * Tree walker
     * @public
     * @param {Object} tree - directory-tree result
     * @param {Function} callback - Callback
     * @return {undefined|false} - False if iteration was cancelled
     */
    static treeWalker( tree, callback ) {
        if ( !( tree instanceof Array ) ) {
            if ( !( tree.children instanceof Array ) ) {
                throw new Error( '' );
            }
            tree = tree.children;
        }
        for ( let i = 0; i < tree.length; i++ ) {
            const item = tree[ i ];
            const o = {
                name : item.name,
                path : item.path,
                ext : item.children ? null : path.extname( item.path ),
                dir : !!item.children,
            };
            const action = callback( o );
            if ( action === true ) {
                continue;
            } else if ( action === false ) {
                return false;
            }
            if ( o.dir ) {
                const sub_action = FsInterface.treeWalker( item.children, callback );
                if ( sub_action === false ) {
                    return false;
                }
            }
        }
    }
}

// Export FsInterfaceException as static property constructor
FsInterface.FsInterfaceException = FsInterfaceException;
module.exports = FsInterface;
