module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    'clean': {
      test: [
        'test/fixtures/out/'
      ]
    },

    'jshint': {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    'electron-windows-installer': {
      'options': {
        productDescription: 'Just a test.',
        rename: function (dest, src) {
          if (/\.exe$/.test(src)) {
            src = '<%= name %>-<%= version %>-setup.exe';
          }
          return dest + src;
        }
      },

      'app-with-asar': {
        src: 'test/fixtures/app-with-asar/',
        dest: 'test/fixtures/out/footest/'
      },

      'app-without-asar': {
        options: {
          bin: 'bartest.exe',
          icon: 'test/fixtures/icon.ico',
          categories: [
            'foo',
            'bar'
          ]
        },
        src: 'test/fixtures/app-without-asar/',
        dest: 'test/fixtures/out/bartest/'
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first lint everything, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jshint', 'electron-windows-installer', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);
};
