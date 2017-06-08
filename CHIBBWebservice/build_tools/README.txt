From command line in folder 'build_tools' run:
ant -f build.xml -Dtarget.platform=<platform>

Or for a specific build target:
ant -f build.xml -Dtarget.platform=<platform> <targetname> <targetname2> ...

Examples:
ant -f build.xml -Dtarget.platform=production build
ant -f build.xml -Dtarget.platform=development build



Command parameters:
-f => Specifies a file to act as build script
-D => Specifies a property