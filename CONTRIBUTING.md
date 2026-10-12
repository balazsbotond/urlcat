## Contribute

Contributions of any kind (pull requests, bug reports, feature requests, documentation, design) are more than welcome! If you like this project and want to help, but feel like you are stuck, feel free to contact the maintainer (Botond Balázs &lt;balazsbotond@gmail.com&gt;).

### Building from source

Building the project should be quick and easy. If it isn't, it's the maintainer's fault. Please report any problems with building in a GitHub issue.

You need Node.js 22.12 or later to build *urlcat* and run its tests (the version in `.nvmrc` is the one used for development). The published package itself runs on Node 14 and above.

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
