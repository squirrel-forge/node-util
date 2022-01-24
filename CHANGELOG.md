# Changelog

## 1.4.1
 - Added *requireOptional* to require a module, either quiet or with requirement error message.
 - Moved all dependencies to optional peer dependencies, must be manually installed when using the methods or classes that require a dependency.

## 1.4.0 [**Breaking changes**]
 - Removed all dependencies for security and low usage reasons, must be installed manually if required.
 - Removed *Exception.toLocaleString* method, *toString* method is sufficient.
 - Fixed *Exception.stack* and Exception.toString* to handle previous without any conversion methods.
 - Added notes for *node-fetch* to README.md.

## 1.3.0
 - Added allow bool option with string value to *CliInput.getFlagsOptions* method.
 - Added *convertMs2Hrtime* time converter.
 - Simplified some files export syntax.

## 1.2.1
 - Added *OutputBuffer* conditional intercepts with methods *OutputBuffer.onIntercept* and *OutputBuffer.offIntercept*.
 - Added *safemode* to *Progress* that intercepts any other output to prevent the spinner from breaking.
 - Updated *directory-tree* and *node-fetch* packages.

## 1.2.0
 - Added *FsInterface.files* to fetch files inside a directory.
 - Added *FsInterface.filterOptions* to use same shortcut options for *FsInterface.files* as for *FsInterface.fileList*.
 - Added *FsInterface.filterFiles* filters a files list by options.

## 1.1.2
 - Added *reverse* option to *leadingZeros* function.
 - Added some missing docs.

## 1.1.1
 - Added *Timer.measure* to get hrtime difference to start and improved *Timer.end*.
 - Added *convertHrtime* hrtime formatter.
 - Added *StatsDisplay* class and *StatsDisplayType* class for making and displaying pretty stats objects.

## 1.0.0
 - Added a little better docs overview of abilities.
 - Added *Timer.get* to get specified start hrtime.
 - Made FsInterface methods static.

## 0.6.2
 - Added *FsInterface.unlink* method for deleting a single file.

## 0.6.1
 - Added *FsInterface.treeWalker* method to easily run a directory-tree result.

## 0.6.0
 - Added *convertBytes* number formatter.
 - Added *leadingZeros* number formatter.
 - Added *rand* get random number with min, max arguments.
 - Added *round* number formatter.
 - Added *simpleReplace* replace object property values in string.
 - Added *strand* generates a random string, very fast, not very unique.
 - Added *strSlug* sanitizes a string.

## 0.5.5
 - Added *cmd* promise style function.
 - Added *default_value* options to *CliInput.question* method.

## 0.5.4
 - Added *confirm_bool* option on enter/empty input and response text options for *CliInput.question* method.
 - Added *CliInput.setArg* and *CliInput.setFlag* methods to manually add or fully replace args and flags.

## 0.5.3
 - Changed FsInterface instanceof Error instead of Exception.
 - Minor docs updates.

## 0.5.2
 - Added *Progress* and *Timer* classes.
 - Added *callback* and *wait* functions.

## 0.5.1
 - Docs and added *FsInterface.isDir* method.

## 0.5.0
 - Core features prototype.
