module.exports = {
  'root': true,
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
  },
  'plugins': ['@typescript-eslint'],
  'rules': {
    '@typescript-eslint/naming-convention': 'warn',
    'semi': 'off',
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
    'eqeqeq': 'warn',
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
    'indent': ['error', 2],
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
  },
};