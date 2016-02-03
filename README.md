# grunt-electron-installer-windows [![Version](https://img.shields.io/npm/v/grunt-electron-installer-windows.svg)](https://www.npmjs.com/package/grunt-electron-installer-windows) [![Build Status](https://img.shields.io/travis/unindented/grunt-electron-installer-windows.svg)](http://travis-ci.org/unindented/grunt-electron-installer-windows) [![Build Status](https://img.shields.io/appveyor/ci/unindented/grunt-electron-installer-windows.svg)](https://ci.appveyor.com/project/unindented/grunt-electron-installer-windows) [![Dependency Status](https://img.shields.io/gemnasium/unindented/grunt-electron-installer-windows.svg)](https://gemnasium.com/unindented/grunt-electron-installer-windows)

> Create a Windows package for your Electron app.

Not a fan of [Grunt](http://gruntjs.com/)? Use the vanilla module [`electron-installer-windows`](https://github.com/unindented/electron-installer-windows)!


## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-electron-installer-windows --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-electron-installer-windows')
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-copy/tree/grunt-0.3-stable).*


## Installer task

_Run this task with the `grunt electron-installer-windows` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Usage

Say your Electron app lives in `path\to\app`, and has a structure like this:

```
.
├── LICENSE
├── README.md
├── node_modules
│   ├── electron-packager
│   └── electron-prebuilt
├── package.json
├── resources
│   ├── Icon.png
│   ├── IconTemplate.png
│   └── IconTemplate@2x.png
└── src
    ├── index.js
    ├── main
    │   └── index.js
    └── renderer
        ├── index.html
        └── index.js
```

You now run `electron-packager` to build the app for Debian:

```
$ electron-packager . app --platform win32 --arch x64 --out dist\
```

And you end up with something like this in your `dist` folder:

```
.
└── dist
    └── app-win32-x64
        ├── LICENSE
        ├── LICENSES.chromium.html
        ├── content_resources_200_percent.pak
        ├── content_shell.pak
        ├── d3dcompiler_47.dll
        ├── icudtl.dat
        ├── libEGL.dll
        ├── libGLESv2.dll
        ├── locales
        ├── msvcp120.dll
        ├── msvcr120.dll
        ├── natives_blob.bin
        ├── node.dll
        ├── pdf.dll
        ├── app.exe
        ├── resources
        ├── snapshot_blob.bin
        ├── ui_resources_200_percent.pak
        ├── vccorlib120.dll
        ├── version
        └── xinput1_3.dll
        ├── LICENSE
        ├── LICENSES.chromium.html
        ├── content_shell.pak
        ├── app
        ├── icudtl.dat
        ├── libgcrypt.so.11
        ├── libnode.so
        ├── locales
        ├── natives_blob.bin
        ├── resources
        ├── snapshot_blob.bin
        └── version
```

In order to create a package for your app, the configuration for your Grunt task would look like this:

```js
'electron-installer-windows': {
  app: {
    src: 'path\to\app\dist\app-win32-x64',
    dest: 'path\to\app\dist\installers\'
  }
}
```

The task will try to extract all necessary information from your `package.json`, and then generate your packages at `path\to\app\dist\installers\`:

```
$ ls path\to\app\dist\installers
RELEASES  app-0.0.1-full.nupkg  app-0.0.1-setup.exe  app-0.0.1-setup.msi
```

You can also create different packages for different architectures, while manually overriding certain options:

```js
'electron-installer-windows': {
  options: {
    productName: 'Foo',
    productDescription: 'Bar baz qux.'
  },

  win32: {
    src: 'path\to\app\dist\app-win32-ia32',
    dest: 'path\to\app\dist\installers\'
  },

  win64: {
    src: 'path\to\app\dist\app-win32-x64',
    dest: 'path\to\app\dist\installers\'
  }
}
```

### Options

See the options supported by [`electron-installer-windows`](https://github.com/unindented/electron-installer-windows#options).


## Meta

* Code: `git clone git://github.com/unindented/grunt-electron-installer-windows.git`
* Home: <https://github.com/unindented/grunt-electron-installer-windows/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2016 Daniel Perez Alvarez ([unindented.org](https://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
