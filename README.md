# grunt-electron-windows-installer [![Version](https://img.shields.io/npm/v/grunt-electron-windows-installer.svg)](https://www.npmjs.com/package/grunt-electron-windows-installer) [![Build Status](https://img.shields.io/appveyor/ci/unindented/grunt-electron-windows-installer.svg)](https://ci.appveyor.com/project/unindented/grunt-electron-windows-installer) [![Dependency Status](https://img.shields.io/gemnasium/unindented/grunt-electron-windows-installer.svg)](https://gemnasium.com/unindented/grunt-electron-windows-installer)

> Create a Windows package for your Electron app.


## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-electron-windows-installer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-electron-windows-installer');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-copy/tree/grunt-0.3-stable).*


## Installer task

_Run this task with the `grunt electron-windows-installer` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Usage

Say your app lives in `path/to/app`, and has a structure like this:

```
$ tree path/to/app/ -L 2
path/to/app/
├── LICENSE
├── index.js
├── main
│   ├── index.js
│   └── squirrel.js
├── node_modules
│   ├── fs-plus
│   └── yargs
├── package.json
└── renderer
    ├── index.css
    ├── index.html
    └── index.js
```

To create a package from your app, the configuration for your task would look like this:

```js
'electron-windows-installer': {
  app: {
    src: 'path/to/app/',
    dest: 'path/to/out/'
  }
}
```

The task will try to extract all necessary information from your `package.json`. When it finishes, you'll have these:

```
$ ls path\to\out
RELEASES  app-0.0.1-full.nupkg  Setup.exe
```

You can also create different packages for different architectures, while manually overriding certain options:

```js
'electron-windows-installer': {
  options: {
    productName: 'Foo',
    productDescription: 'Bar baz qux.',
    rename: function (dest, src) {
      if (/\.exe$/.test(src)) {
        src = '<%= name %>-<%= version %>-setup.exe';
      }
      return dest + src;
    }
  },

  win32: {
    src: 'path/to/win32/',
    dest: 'path/to/out/win32/'
  },

  win64: {
    src: 'path/to/win64/',
    dest: 'path/to/out/win64/'
  }
}
```

### Options

#### src
Type: `String`
Default: `undefined`

Path to the folder that contains your built Electron application.

#### dest
Type: `String`
Default: `undefined`

Path to the folder that will contain your Windows installer.

#### options.name
Type: `String`
Default: `package.name`

Name of the package (e.g. `atom`), used in the [`id` field of the `nuspec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.productName
Type: `String`
Default: `package.productName || package.name`

Name of the application (e.g. `Atom`), used in the [`title` field of the `nuspec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.description
Type: `String`
Default: `package.description`

Short description of the application, used in the [`summary` field of the `nuspec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.productDescription
Type: `String`
Default: `package.productDescription || package.description`

Long description of the application, used in the [`description` field of the `nuspec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.version
Type: `String`
Default: `package.version`

Long description of the application, used in the [`version` field of the `nuspec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.copyright
Type: `String`
Default: `package.copyright`

Copyright details for the package, used in the [`copyright` field of the `nuspec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.authors
Type: `Array[String]`
Default: `package.author`

List of authors of the package, used in the [`authors` field of the `spec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.owners
Type: `Array[String]`
Default: `package.author`

List of owners of the package, used in the [`authors` field of the `spec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.homepage
Type: `String`
Default: `package.homepage || package.author.url`

URL of the homepage for the package, used in the [`projectUrl` field of the `spec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.iconUrl
Type: `String`
Default: `undefined`

URL for the image to use as the icon for the package in the *Manage NuGet Packages* dialog box, used in the [`iconUrl` field of the `spec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.licenseUrl
Type: `String`
Default: `undefined`

URL for the license that the package is under, used in the [`licenseUrl` field of the `spec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.requireLicenseAcceptance
Type: `String`
Default: `false`

Whether the client needs to ensure that the package license (described by `licenseUrl`) is accepted before the package is installed, used in the [`requireLicenseAcceptance` field of the `spec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.tags
Type: `Array[String]`
Default: `[]`

List of tags and keywords that describe the package, used in the [`tags` field of the `spec` file](https://docs.nuget.org/create/nuspec-reference).

#### options.rename
Type: `Function`
Default: `function (dest, src) { return dest + src; }`

Function that renames all files generated by the task just before putting them in your `dest` folder.


## Updating

### Squirrel
Current version: 1.0.5

To update [Squirrel](https://github.com/Squirrel/Squirrel.Windows) to the latest version:

```
$ rm vendor/squirrel/*
$ curl -kLo vendor/squirrel.zip https://github.com/Squirrel/Squirrel.Windows/releases/download/1.0.5/Squirrel.Windows-1.0.5.zip
$ unzip -d vendor/squirrel/ vendor/squirrel.zip
$ rm vendor/squirrel.zip
```

### NuGet
Current version: 2.8.5

To update [NuGet](http://nuget.codeplex.com/) to the latest version, head over to the [releases page](http://nuget.codeplex.com/releases).


## Meta

* Code: `git clone git://github.com/unindented/grunt-electron-windows-installer.git`
* Home: <https://github.com/unindented/grunt-electron-windows-installer/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2015 Daniel Perez Alvarez ([unindented.org](https://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
