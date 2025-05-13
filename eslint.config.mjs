import pkg from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';

const { configs: eslintRecommended } = pkg;

export default [
    {
        files: ['src/**/*.{js,jsx}'], // Target only the source files
        ignores: ['build/', 'dist/'], // Ignore build and dist directories
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...Object.fromEntries(
                    Object.entries(globals.browser).map(([key, value]) => [key.trim(), value]),
                ),
            },
        },
        ...eslintRecommended.recommended,
        ...reactRecommended,
        rules: {
            'no-unused-vars': [
                'warn',
                {
                    varsIgnorePattern: 'React', // Ignore React import in React 17+
                    argsIgnorePattern: '^_', // Ignore unused arguments starting with _
                },
            ],
            'react/react-in-jsx-scope': 'off', // Disable the need for React to be in scope
            'react/jsx-uses-vars': 'error',
        },
    },
];
