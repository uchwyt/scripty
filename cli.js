#!/usr/bin/env node

var lifecycleEvent = process.env.npm_lifecycle_event

if (!lifecycleEvent) {
  console.error(
    'scripty ERR! It seems you may be running scripty from the command-line directly.\n' +
    'At this time, scripty can only be run within an npm script specified in your package.json.\n\n' +
    'Example package.json entry:\n\n' +
    '  "scripts": {\n' +
    '    "foo:bar": "scripty"\n' +
    '  }\n\n' +
    'And then run via `npm run foo:bar`.\n\n' +
    'For more documentation, see:\n' +
    '  https://github.com/testdouble/scripty\n\n' +
    'Exiting.'
  )
  process.exit(1)
} else {
  var scripty = require('./lib/scripty')
  var loadOption = require('./lib/load-option')
  var log = require('./lib/log')
  // there is no PWD on windows instead there is INIT_PWD
  var packageJson = require(`${process.env.PWD || process.env.INIT_CWD}/package.json`)

  scripty(lifecycleEvent, {
    userArgs: process.argv.slice(2),
    parallel: loadOption('parallel', packageJson),
    dryRun: loadOption('dryRun', packageJson),
    logLevel: loadOption('logLevel', packageJson),
    quiet: loadOption('quiet', packageJson),
    silent: loadOption('silent', packageJson),
    verbose: loadOption('verbose', packageJson),
    spawn: {
      stdio: 'inherit'
    },
    resolve: {
      modules: loadOption('modules', packageJson),
      scripts: loadOption('path', packageJson),
      scriptsWin: loadOption('windowsPath', packageJson)
    }
  }, function (er, code) {
    if (er) {
      log.error(er)
      code = code || er.code || 1
    }
    process.exitCode = code
  })
}
