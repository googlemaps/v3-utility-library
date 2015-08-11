These instructions are for using SVN from the command-line, like on a Linux server with svn installed. If you're not sure if you have svn installed, just try typing "svn" and see if the command is recognized. If it's not, you'll need to use a pc/mac client like TortoiseSVN or ZigVersion.

## Code Checkout ##

If you're not a member of the project and just want to checkout the code to have a local copy on your system, you can use the anonymous checkout command:

`svn checkout http://google-maps-utility-library-v3.googlecode.com/svn/trunk/ google-maps-utility-library-v3`


If you're a member of the project and want to checkout the code so that you're able to commit changes to the codebase after editing it on your local machine, then you need to use the gmail username that's registered as a member:

`svn checkout https://google-maps-utility-library-v3.googlecode.com/svn/trunk/ google-maps-utility-library-v3 --username gmail.user`


It will prompt you for a password, which is NOT your gmail password, since it doesn't want to compromise the security of that password. It's a special google SVN password, which will be listed for you at the following URL, if you're signed in:
http://code.google.com/hosting/settings

## Code Changes ##

If you've checked out the code with your username and password, then it's easy to commit changes to the code.

If you want to add files are not a part of the latest project revision, you'll use the add command:

`svn add foldername  // will add everything in folder recursively`

`svn add filename `


If you want to delete files that are a part of the latest project revision, you'll use the delete command:

`svn delete foldername`

`svn delete filename`


Issuing adds and deletes will not actually affect the repository immediately.
If you're happy with your file edits, adds, or deletes, and want to submit to the repository, you'll use the commit command:
`svn commit -m "Message describing my changes here"`
The commit will execute the adds/deletes and update any edited files that were already in the repository and were changed in your local copy.
It's important to append a descriptive message to every commit, as it helps others to understand what each revision of the code represents.


## Code Mime-Types ##

In this project, we're actually storing HTML, CSS, and JS files so we want them to be rendered by the browser as their proper mime-type. SVN submits ASCII files as plain text by default, so we need to manually set the mime-type on certain files. To do that, we use the propset command:

`svn propset svn:mime-type text/html *.html`

`svn propset svn:mime-type text/javascript *.js`

`svn propset svn:mime-type text/css *.css`

Those are the most common mime-types we'll use in this project.

## Set Auto Prop ##

You maybe able to set mime-type automatically by pre-config the SVN client. For example, in TortoiseSVN, right click any SVN folder, choose TortoiseSVN >> Settings. In "General", find "Subvsion configuration file", click the "Edit" button. Notepad will open the config file, find "enable-auto-props", set it as "enable-auto-props = yes". Then in [auto-props] section, add the following lines:
```
enable-auto-props = yes


*.png = svn:mime-type=image/png
*.jpg = svn:mime-type=image/jpeg
*.gif = svn:mime-type=image/gif
*.xml = svn:mime-type=text/xml
*.js = svn:mime-type=text/javascript
*.xml = svn:mime-type=text/xml
*.css= svn:mime-type=text/css
*.html= svn:mime-type=text/html
*.htm= svn:mime-type=text/html
```
Save and close. After that, mime-type for any new files you added will be automatically set.

## Code Conflicts ##
There are no fine-grained permissions in googlecode SVN, so please be very careful to not commit changes to something that someone else is also working on. If you're both working on the same file, you may want to create separate versions or merge your changes.


## Additional Resources ##

[Version Control with Subversion (Online book)](http://svnbook.red-bean.com/)

[SVN Official Site](http://subversion.tigris.org/)