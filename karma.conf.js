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
    reporters: ["progress", "karma-typescript"],
    browsers: ["Chrome"],
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
