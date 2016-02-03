'use strict'

var fs = require('fs')
var async = require('async')

var testExistence = function (test, expectations) {
  test.expect(expectations.length)

  async.parallel(expectations.map(function (expectation) {
    return function (callback) {
      fs.access(expectation, function (err) {
        test.ok(!err, expectation + ' should exist')
        callback()
      })
    }
  }), function () {
    test.done()
  })
}

exports.command = {
  'app with asar': function (test) {
    testExistence(test, [
      'test/fixtures/out/footest/RELEASES',
      'test/fixtures/out/footest/footest-0.0.1-full.nupkg',
      'test/fixtures/out/footest/footest-0.0.1-installer.exe'
    ].concat(process.platform === 'win32'
      ? 'test/fixtures/out/footest/footest-0.0.1-installer.exe'
      : []
    ))
  },
  'app without asar': function (test) {
    testExistence(test, [
      'test/fixtures/out/bartest/RELEASES',
      'test/fixtures/out/bartest/bartest-0.0.1-full.nupkg',
      'test/fixtures/out/bartest/bartest-0.0.1-installer.exe'
    ].concat(process.platform === 'win32'
      ? 'test/fixtures/out/bartest/bartest-0.0.1-installer.msi'
      : []
    ))
  }
}
