# Forward Indesign Tools

This is a collection of tools for use with Adobe InDesign and Adobe InCopy, mostly written by Richard Harrington (me) at the Forward Newspaper in New York.

The scripts are mostly at the top level of the sourcefiles folder. They do not have any namespace protection because that is provided in the real-life build at our workplace, for each script, by a wrapper script with the same name (minus the ".source" part of the name). This script is placed at the top level of the repository. All of these wrapper scripts have the same contents. They check the name of the file containing themselves, and then they call the corresponding script in the sourcefiles folder. 

So if you use any of these scripts, clone the repository as-is into your indesign Scripts Panel folder (or put an alias there to wherever your cloned repository is) and then create the wrapper scripts for any scripts you want to use, by copying the contents of the file sourcefiles/utilities/wrapperScriptTemplate.jsx into a new file with the name \<newscriptfilename\>.source.jsx, and putting it at the top level.

The purpose of this convolution is so that each script can be reversed by a single Undo action in InDesign or InCopy. Many of the source scripts, if run on their own, would take several steps to undo, but when run from the wrapper script, it is always one step.

At our paper, all these scripts are stored in a git repository on the local server. All the designers, and a couple of the editors who use InDesign fairly heavily, have aliases to this folder stored in their local InDesign script folders, so that they have access to all of these scripts from their Script panel in InDesign. They are not cached locally -- each time a script is run, it executes the code that is found on the network -- so I can upgrade them and the changes will be effective immediately on everyone's computer. 

In addition, the rest of the staff has access to a few of the most important and user-friendly of the scripts, through menu items in InCopy. This is accomplished as follows: in the sourcefiles folder is a folder called StartupItems, which contains an item called StartupItemsInstallationWrapper.source.jsx. All the users of InCopy have aliases to this file in their InCopy startup folders, so that if we update the file, everyone will automatically be updated the next time they restart InCopy. 

The installation wrapper could theoretically do a lot of things, but currently it just does one thing: it executes a menu installation script called AddMenuItems.source.jsx. This adds four menu items to the File and Edit menus in InCopy on each local machine. Again, no caching of anything is done -- each time the menu item is activated, the original copy of the event handling script is called directly, so that I could update one of the event handling scripts and the menu items would still work, without anyone having to restart InCopy.


## History

These scripts were written over a period of years, beginning at a time when I hardly knew Javascript. A few have been written recently and are fairly well organized with some good use of functional and object-oriented programming techniques, and at least relatively clean separation of data from logic. A few I haven't looked at closely in years, and are very hard to make changes to because they're like a pile of Jenga blocks, one modification away from breaking. Most fall somewhere in between.

Many will also be fairly useless outside of the environment in which they were written, but part of the reason I am putting them up on github is to motivate myself to make them more general and less hard-coded, and thus more useful to others (and more useful for us at the Forward in the long run). I'll be working on that. 

One particularly alarming thing to keep in mind, while reading them: when I started writing this stuff I was pretty much unaware of the naming conventions regarding initial capitalization of identifiers -- that it should really only be used for modules and constructors. One of my tasks is to go through and conform all the code to that convention.

On the other hand, all these scripts have the benefit of working for what they were intended to to, in a professional environment. They have saved our staff countless hours of work, and made it possible to move copy from print to web and back again with a minimum of fuss. So they must be good for something.

Suggestions or modifications are welcome.


## The Scripts

### Scripts available to all our users through menu items

* __ExportMarkdown__  
A script that exports an InDesign/InCopy story to markdown format, suitable for cutting and pasting into a website's CMS. Written long ago, encompassing a lot of functionality, probably should be broken up into pieces. Some of it is gobbledygook but it works. There is also a LOT of stuff in here that is specific to our newspaper.

* __ExportAllStories__  
A simple script that takes all the stories in an InDesign document and concatenates them into one story, suitable for printing or emailing.

* __Add/Edit Hyperlink__  
A script that adds a hyperlink to the selected text (or edits an existing hyperlink) in the format we prefer: with a visible but unobtrusive orange dotted border, and without creating a shared hyperlink destination. This visible border does not show up in print or in pdfs. This script was written fairly recently and the data is well-separated from the logic, so it might be useful in the wider world.

* __RemoveHyperlink__  
Fairly self-explanatory.




### Scripts available to designers through the InDesign scripts palette

* __Coming soon__  
Blah di blah


## License

Some of the code contained in this repository is based on code in blog posts, forum posts, or tutorials by Dave Saunders, Marc Autret, Peter Werner, and Peter Kahrel. Credit is given in comments in the code in these cases. One of the scripts, ProcessText, has a section that is largely based on the FindChangeByList script that comes with Adobe InDesign. The rest of the code is released under the MIT License below:

>__Copyright (c) 2011 Richard Harrington and the Forward Newspaper__

>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.