'use strict';

var fs = require('fs');

var testExistence = function (test, expectations) {
  test.expect(expectations.length);

  expectations.forEach(function (expectation) {
    test.equal(fs.existsSync(expectation), true, expectation + ' should exist');
  });

  test.done();
};

exports.command = {
  'app with asar': function (test) {
    testExistence(test, [
      'test/fixtures/out/footest/footest-0.0.1-full.nupkg',
      'test/fixtures/out/footest/footest-0.0.1-setup.exe',
      'test/fixtures/out/footest/RELEASES'
    ]);
  },
  'app without asar': function (test) {
    testExistence(test, [
      'test/fixtures/out/bartest/bartest-0.0.1-full.nupkg',
      'test/fixtures/out/bartest/bartest-0.0.1-setup.exe',
      'test/fixtures/out/bartest/RELEASES'
    ]);
  }
};
