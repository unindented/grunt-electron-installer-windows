var path = require('path')

module.exports = function (grunt) {
  'use strict'

  // Project configuration.
  grunt.initConfig({
    'clean': {
      test: [
        'test/fixtures/out/'
      ]
    },

    'eslint': {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ]
    },

    'electron-windows-installer': {
      options: {
        productDescription: 'Just a test.'
      },

      'app-with-asar': {
        src: 'test/fixtures/app-with-asar/',
        dest: 'test/fixtures/out/footest/',
        rename: function (dest, src) {
          var ext = path.extname(src)
          if (ext === '.exe' || ext === '.msi') {
            src = '<%= name %>-<%= version %>-installer' + ext
          }
          return path.join(dest, src)
        }
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
        dest: 'test/fixtures/out/bartest/',
        rename: function (dest, src) {
          var ext = path.extname(src)
          if (ext === '.exe' || ext === '.msi') {
            src = '<%= name %>-<%= version %>-installer' + ext
          }
          return path.join(dest, src)
        }
      }
    },

    'nodeunit': {
      tests: ['test/*_test.js']
    }
  })

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks')

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-eslint')

  // Whenever the "test" task is run, first lint everything, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'eslint', 'electron-windows-installer', 'nodeunit'])

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test'])
}
