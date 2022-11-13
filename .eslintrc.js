module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    overrides: [
        {
            files: [
                '*.js',
            ],
            env: {
            },
            extends: [
                '@matthiaskunnen/eslint-config-base',
            ],
        },
        {
            files: [
                '*.ts',
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['tsconfig/tsconfig.lint.json'],
                sourceType: 'module',
            },
            extends: [
                '@matthiaskunnen/eslint-config-typescript-node',
            ],
        },
        {
            files: [
                '*.spec.ts',
                'tests/**/*.ts',
            ],
            env: {
                jest: true,
            },
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['tsconfig/tsconfig.spec.json'],
                sourceType: 'module',
            },
            extends: [
                'plugin:jest/recommended',
                '@matthiaskunnen/eslint-config-typescript-node',
            ],
        },
    ],
};
