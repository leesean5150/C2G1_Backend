const config = {
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", { configFile: "./babel.config.json" }],
    },
    transformIgnorePatterns: ["/node_modules/(?!(supertest)/)"],
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
    moduleFileExtensions: ["js", "json", "ts", "tsx"],
    maxWorkers: 1,
};

module.exports = config;