/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'linebreak-style': 0,
    'object-curly-spacing': ['error', 'always', { 'arraysInObjects': true, 'objectsInObjects': true }],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        'selector': 'class',
        'format': ['PascalCase'],
      },
      {
        'selector': 'interface',
        'format': ['PascalCase'],
      },
      {
        'selector': 'variable',
        'format': ['camelCase', 'snake_case'],
      },
    ],
    // 'semi': 'off',
    '@typescript-eslint/semi': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true,
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': false,
        },
      },
    ],
    'keyword-spacing': 'error',
    // add padding before and after statements
    'padding-line-between-statements': [
      'warn',
      { 'blankLine': 'always', 'prev': '*', 'next': 'block' },
      { 'blankLine': 'always', 'prev': 'block', 'next': '*' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'block-like' },
      { 'blankLine': 'always', 'prev': 'block-like', 'next': '*' },
    ],
    'newline-before-return': 'error',
    'curly': 'warn',
    'eqeqeq': ['warn', 'always', { null: 'ignore' }],
    'no-throw-literal': 'warn',
    'prefer-const': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 'args': 'none' }],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'never',
        'exports': 'always-multiline',
        'functions': 'always-multiline',
        'enums': 'always-multiline',
        'generics': 'always-multiline',
        'tuples': 'always-multiline',
      },
    ],
    'func-call-spacing': ['error', 'never'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'max-len': [
      'warn',
      {
        'code': 140,
        'tabWidth': 2,
        'ignoreComments': true,
        'ignoreUrls': true,
        // ignoreStrings: true,
      },
    ],
    'no-console': ['warn', { 'allow': ['warn', 'error'] }],
    'no-unused-vars': 'off',
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'space-in-parens': ['error', 'never'],
    'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 3 }],
    'require-jsdoc': 0,
  },
};
