
const isTravis = process.env.TRAVIS

const reporters = ['progress', 'karma-typescript']
const coverageReporter = {
  reporters: []
}

if (isTravis) {
  reporters.push('coverage', 'coveralls')
  coverageReporter.reporters.push({
    type: 'lcov',
    dir: 'coverage/'
  })
}

module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "chai", "karma-typescript"],
    files: [
      'test/setup.ts',
      { pattern: "src/**/*.ts" },
      { pattern: "test/**/*.ts" },
    ],
    preprocessors: {
      "**/*.ts": ["karma-typescript"],
    },
    reporters,
    coverageReporter,
    browsers: isTravis ? ['Chrome_travis_ci'] : ['Chrome'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        validateSyntax: false,
        sourceMap: true,
        noParse: ['mqtt/dist/mqtt.min'],
        transforms: [require("karma-typescript-es6-transform")()],
      },
      compilerOptions: {
        allowJs: true,
        moduleResolution: 'node',
      }
    }
  });
};
