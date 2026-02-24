module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        html: '<html lang="en"><body></body></html>',
        url: 'https://jestjs.io/',
        userAgent: 'Agent/007',
    },
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.js"],
    coverageReporters: ["text", "lcov", "html"],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
