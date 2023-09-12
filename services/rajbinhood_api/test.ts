/*
|--------------------------------------------------------------------------
| Tests
|--------------------------------------------------------------------------
|
| The contents in this file boots the AdonisJS application and configures
| the Japa tests runner.
|
| For the most part you will never edit this file. The configuration
| for the tests can be controlled via ".adonisrc.json" and
| "tests/bootstrap.ts" files.
|
*/

process.env.NODE_ENV = 'test'

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
import {
  apiClient,
  assert,
  specReporter,
  runFailedTests,
} from '@japa/preset-adonis'
import {
  configure,
  processCliArgs,
  run,
  RunnerHooksHandler,
} from '@japa/runner'

sourceMapSupport.install({ handleUncaughtExceptions: false })

const kernel = new Ignitor(__dirname).kernel('test')

kernel
  .boot()
  .then(() => import('./tests/bootstrap'))
  .then(({ runnerHooks, ...config }) => {
    const app: RunnerHooksHandler[] = [() => kernel.start()]

    configure({
      ...kernel.application.rcFile.tests,
      ...processCliArgs(process.argv.slice(2)),
      ...config,
      ...{
        importer: filePath => import(filePath),
        setup: app.concat(runnerHooks.setup),
        teardown: runnerHooks.teardown,
        files: ['tests/**/*spec.ts'],
        plugins: [apiClient(), assert(), runFailedTests()],
        reporters: [specReporter()],
      },
      cwd: kernel.application.appRoot,
    })

    run()
  })
