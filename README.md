# Forward Indesign Tools

This is a collection of tools for use with Adobe InDesign and Adobe Photoshop, mostly written by Richard Harrington at the Forward Newspaper in New York.

The scripts at the top level of the directory are wrappers, and they all contain the exact same code. The code checks the name of the file containing itself, and then calls a script starting with the identical name (but ending with .source.jsx instead of .jsx) in the sourcefiles folder. The wrapper scripts are all wrapped themselves in anonymous function calls which also encapsulate the scripts that are called, also.

The purpose of this convolution is so that each script can be reversed by a single Undo action in InDesign or InCopy.

Also in the sourcefiles folder is a folder called StartupItems, which contain the only startup item we use, which is a menu installation script, in addition to StartupItemsInstallationWrapper.jsx, which calls the menu installation script and any other startup items you want to use.

The way that we have this set up at our newspaper is that the repository is stored on the server, aliases to the repository are stored in all the users' script folders, and aliases to the file StartupItemsInstallationWrapper.jsx are stored in their startup scripts folders.

These scripts were written over a period of years, beginning at a time when I hardly knew Javascript. Many will be fairly useless outside of the environment in which they were written, but part of the reason I am putting them up on Github is to motivate myself to make them more general and less hard-coded, and thus more useful to others (and more useful for us at the Forward in the long run). I'll be working on that.

Suggestions or modifications are welcome.


## License

Some of the code contained in this repository is based on code in blog posts, forum posts, or tutorials by Dave Saunders, Marc Autret, and Peter Kahrel. Credit is given in comments in the code in these cases. One of the scripts, ProcessText, has a section that is largely based on the FindChangeByList script that comes with Adobe InDesign. The rest of the code is released under the MIT License below:

>__Copyright (c) 2011 Richard Harrington and the Forward Newspaper__

>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.