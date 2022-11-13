/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    moduleFileExtensions: ['ts', 'js'],
    preset: 'ts-jest',
    setupFiles: ['dotenv/config'],
    testEnvironment: 'node',
    testTimeout: 60000,
    transform: {
        // Regex must not be changed or tsconfig will not be picked up, see
        // https://stackoverflow.com/q/68656057/#comment130907129_73696933
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: './tsconfig/tsconfig.spec.json',
            },
        ],
    },
    testMatch: [
        '**/tests/**/*.spec.ts',
    ],
};
