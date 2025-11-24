export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/server.ts",
        "!src/prisma.ts"
    ],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
};