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
            rules: {
                '@typescript-eslint/naming-convention': [
                    'error',
                    {format: ['camelCase'], selector: 'default'},
                    {format: ['PascalCase'], selector: 'typeLike'},
                    {format: ['PascalCase'], selector: 'enumMember'},
                    {format: ['camelCase'], leadingUnderscore: 'allow', selector: 'method'},
                    {
                        format: ['camelCase', 'PascalCase'],
                        leadingUnderscore: 'allow',
                        selector: 'parameter',
                    },
                    {
                        format: ['camelCase', 'PascalCase'],
                        leadingUnderscore: 'allow',
                        selector: 'variable',
                    },
                    {format: null, selector: 'classProperty'},
                    {format: null, selector: 'objectLiteralProperty'},
                    {format: null, selector: 'typeProperty'},
                ],
            },
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
