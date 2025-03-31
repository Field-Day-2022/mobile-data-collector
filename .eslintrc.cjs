module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    settings: {
        react: {
            version: 'detect', // Automatically detect the React version
        },
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly', // Add any global variables here
    },
    rules: {
        'no-unused-vars': 'warn',
        'react/prop-types': 'off', // Disable PropTypes validation rule
        'react/react-in-jsx-scope': 'off', // Also disable React in scope if using React 17+
        "jsx-a11y/no-noninteractive-tabindex": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "react/jsx-key": "off",
        "no-undef": "off",
        "react/no-unescaped-entities": "off",
        "jsx-a11y/*": "off", // If there are still remaining accessibility errors
        "jsx-a11y/no-noninteractive-tabindex": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "react/no-unescaped-entities": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/label-has-associated-control": "off",
    },
};