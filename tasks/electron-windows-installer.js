'use strict';

var _ = require('lodash');
var asar = require('asar');
var async = require('async');
var child = require('child_process');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var temp = require('temp').track();

/**
 * Execute a file.
 */
var exec = function (file, args, callback) {
  var execdProcess = null;
  var error = null;
  var stderr = '';

  try {
    execdProcess = child.execFile(file, args);
  }
  catch (err) {
    process.nextTick(function () {
      callback(err, stderr);
    });
    return;
  }

  execdProcess.stderr.on('data', function (data) {
    stderr += data;
  });

  execdProcess.on('error', function (err) {
    error = error || err;
  });

  execdProcess.on('close', function (code, signal) {
    if (code !== 0) {
      error = error || signal || code;
    }

    callback(error && new Error('Error executing file (' + (error.message || error) + '): ' +
      '\n' + file + ' ' + args.join(' ') + '\n' + stderr));
  });
};

/**
 * Read `package.json` either from `resources.app.asar` (if the app is packaged)
 * or from `resources/app/package.json` (if it is not).
 */
var readPackage = function (options, callback) {
  var withAsar = path.join(options.src, 'resources/app.asar');
  var withoutAsar = path.join(options.src, 'resources/app/package.json');

  try {
    if (fs.existsSync(withAsar)) {
      callback(null, JSON.parse(asar.extractFile(withAsar, 'package.json')));
    }
    else {
      callback(null, fs.readJsonSync(withoutAsar));
    }
  }
  catch (err) {
    callback(new Error('Error reading package: ' + (err.message || err)));
  }
};

/**
 * Get the hash of default options for the Grunt task. Some come from the info
 * read from `package.json`, and some are hardcoded.
 */
var getDefaults = function (task, callback) {
  readPackage({src: task.data.src}, function (err, pkg) {
    pkg = pkg || {};

    var authors = pkg.author && [(typeof pkg.author === 'string' ?
      pkg.author.replace(/\s+(<[^>]+>|\([^)]+\))/g, '') :
      pkg.author.name
    )];

    var defaults = {
      name: pkg.name || 'electron',
      productName: pkg.productName || pkg.name,
      description: pkg.description,
      productDescription: pkg.productDescription || pkg.description,
      version: pkg.version || '0.0.0',

      copyright: pkg.copyright,
      authors: authors,
      owners: authors,

      homepage: pkg.homepage || (pkg.author && (typeof pkg.author === 'string' ?
        pkg.author.replace(/.*\(([^)]+)\).*/, '$1') :
        pkg.author.url
      )),

      exe: pkg.name ? (pkg.name + '.exe') : 'electron.exe',
      icon: path.resolve(__dirname, '../resources/icon.ico'),
      animation: path.resolve(__dirname, '../resources/animation.gif'),

      iconUrl: undefined,
      licenseUrl: undefined,
      requireLicenseAcceptance: false,

      tags: [],

      remoteReleases: undefined,

      certificateFile: undefined,
      certificatePassword: undefined,
      signWithParams: undefined,

      rename: function (dest, src) {
        return dest + src;
      }
    };

    callback(err, defaults);
  });
};

/**
 * Get the hash of options for the Grunt task.
 */
var getOptions = function (task, defaults, callback) {
  var options = task.options(defaults);

  // Put `src` and `dest` in `options` to make it easier to pass them around.
  options.src = task.data.src;
  options.dest = task.data.dest;

  callback(null, options);
};

/**
 * Fill in a template with the hash of options.
 */
var generateTemplate = function (file, options, callback) {
  async.waterfall([
    async.apply(fs.readFile, file),
    function (template, callback) {
      callback(null, _.template(template)(options));
    }
  ], callback);
};

/**
 * Create the nuspec file for the package.
 *
 * See: https://docs.nuget.org/create/nuspec-reference
 */
var createSpec = function (options, dir, callback) {
  var specSrc = path.resolve(__dirname, '../resources/spec.ejs');
  var specDest = path.join(dir, 'nuget', options.name + '.nuspec');

  async.waterfall([
    async.apply(generateTemplate, specSrc, options),
    async.apply(fs.outputFile, specDest)
  ], function (err) {
    callback(err && new Error('Error creating spec file: ' + (err.message || err)));
  });
};

/**
 * Copy the application into the package.
 */
var createApplication = function (options, dir, callback) {
  var applicationDir = path.join(dir, options.name);
  var updateSrc = path.resolve(__dirname, '../vendor/squirrel/Squirrel.exe');
  var updateDest = path.join(applicationDir, 'Update.exe');

  async.waterfall([
    async.apply(fs.copy, options.src, applicationDir),
    async.apply(fs.copy, updateSrc, updateDest)
  ], function (err) {
    callback(err && new Error('Error copying application directory: ' + (err.message || err)));
  });
};

/**
 * Create temporary directory where the contents of the package will live.
 */
var createDir = function (options, callback) {
  async.waterfall([
    async.apply(temp.mkdir, 'electron-'),
    function (dir, callback) {
      dir = path.join(dir, options.name + '_' + options.version);
      fs.ensureDir(dir, callback);
    }
  ], function (err, dir) {
    callback(err && new Error('Error creating temporary directory: ' + (err.message || err)), dir);
  });
};

/**
 * Create subdirectories where intermediate files will live.
 */
var createSubdirs = function (options, dir, callback) {
  async.parallel([
    async.apply(fs.ensureDir, path.join(dir, 'nuget')),
    async.apply(fs.ensureDir, path.join(dir, 'squirrel'))
  ], function (err) {
    callback(err && new Error('Error creating temporary subdirectories: ' + (err.message || err)), dir);
  });
};

/**
 * Create the contents of the package.
 */
var createContents = function (options, dir, callback) {
  async.parallel([
    async.apply(createSpec, options, dir),
    async.apply(createApplication, options, dir)
  ], function (err) {
    callback(err, dir);
  });
};

/**
 * Package everything using `nuget`.
 */
var createPackage = function (options, dir, callback) {
  var applicationDir = path.join(dir, options.name);
  var nugetDir = path.join(dir, 'nuget');
  var specFile = path.join(nugetDir, options.name + '.nuspec');

  var cmd = path.resolve(__dirname, '../vendor/nuget/NuGet.exe');
  var args = [
    'pack',
    specFile,
    '-BasePath',
    applicationDir,
    '-OutputDirectory',
    nugetDir,
    '-NoDefaultExcludes'
  ];

  exec(cmd, args, function (err) {
    callback(err && new Error('Error creating package: ' + (err.message || err)), dir);
  });
};

/**
 * Find the package just created.
 */
var findPackage = function (options, dir, callback) {
  var packagePattern = path.join(dir, 'nuget', '*.nupkg');

  glob(packagePattern, function (err, files) {
    callback(err, dir, files[0]);
  });
};

/**
 * Releasify everything using `squirrel`.
 */
var releasifyPackage = function (options, dir, pkg, callback) {
  var squirrelDir = path.join(dir, 'squirrel');

  var cmd = path.resolve(__dirname, '../vendor/squirrel/Squirrel.com');
  var args = [
    '--releasify',
    pkg,
    '--releaseDir',
    squirrelDir
  ];

  if (options.icon) {
    args.push('--setupIcon');
    args.push(path.resolve(options.icon));
  }

  if (options.animation) {
    args.push('--loadingGif');
    args.push(path.resolve(options.animation));
  }

  if (options.signWithParams) {
    args.push('--signWithParams');
    args.push(options.signWithParams);
  }
  else if (options.certificateFile && options.certificatePassword) {
    args.push('--signWithParams');
    args.push([
      '/a',
      '/f "' + path.resolve(options.certificateFile) + '"',
      '/p "' + options.certificatePassword + '"'
    ].join(' '));
  }

  exec(cmd, args, function (err) {
    callback(err && new Error('Error releasifying package: ' + (err.message || err)), dir);
  });
};

/**
 * Move the package files to the specified destination.
 */
var movePackage = function (options, dir, callback) {
  var packagePattern = path.join(dir, 'squirrel', '*');

  async.waterfall([
    async.apply(glob, packagePattern),
    function (files, callback) {
      async.each(files, function (file) {
        var dest = options.rename(options.dest, path.basename(file));
        fs.move(file, _.template(dest)(options), {clobber: true}, callback);
      }, callback);
    }
  ], function (err) {
    callback(err && new Error('Error moving package files: ' + (err.message || err)), dir);
  });
};

/******************************************************************************/

module.exports = function (grunt) {
  grunt.registerMultiTask('electron-windows-installer',
                          'Create a Windows package for your Electron app.', function () {
    var done = this.async();

    grunt.log.writeln('Creating package (this may take a while)');

    async.waterfall([
      async.apply(getDefaults, this),
      async.apply(getOptions, this),
      function (options, callback) {
        async.waterfall([
          async.apply(createDir, options),
          async.apply(createSubdirs, options),
          async.apply(createContents, options),
          async.apply(createPackage, options),
          async.apply(findPackage, options),
          async.apply(releasifyPackage, options),
          async.apply(movePackage, options)
        ], function (err) {
          callback(err, options);
        });
      }
    ], function (err, options) {
      if (!err) {
        grunt.log.ok('Successfully created package ' + options.dest);
      }

      done(err);
    });
  });
};
