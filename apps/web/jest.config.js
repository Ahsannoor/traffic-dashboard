const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^d3-scale$": "<rootDir>/__mocks__/d3-scale.js",
    "^d3-scale-chromatic$": "<rootDir>/__mocks__/d3-scale-chromatic.js",
  },
});
