# Building from source

Building the project should be quick and easy. If it isn't, it's the maintainer's fault. Please report any problems with building in a GitHub issue.

You need to have a reasonably recent version of node.js to build *urlcat*. My node version is 12.18.3, npm is at 6.14.6.

First, clone the git repository:

```
git clone git@github.com:balazsbotond/urlcat.git
```

Then switch to the newly created urlcat directory and install the dependencies:

```
cd urlcat
npm install
```

You can then run the unit tests to verify that everything works correctly:

```
npm test
```

And finally, build the library:

```
npm run build
```

The output will appear in the `dist` directory.

Happy hacking!

