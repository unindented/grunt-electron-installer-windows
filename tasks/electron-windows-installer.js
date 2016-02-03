'use strict'

var installer = require('electron-installer-windows')

module.exports = function (grunt) {
  grunt.registerMultiTask('electron-windows-installer',
    'Create a Windows package for your Electron app.',
    function () {
      var done = this.async()
      var options = this.options({
        src: this.data.src,
        dest: this.data.dest,
        rename: this.data.rename
      })

      grunt.log.writeln('Creating package (this may take a while)')

      installer(options, function (err, options) {
        if (!err) {
          grunt.log.ok('Successfully created package at ' + options.dest)
        } else {
          grunt.log.error('Error creating package: ' + (err.message || err))
        }

        done(err)
      })
    }
  )
}
