import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['import', 'unicorn', 'node', 'jsdoc', 'oxc', 'typescript', 'eslint', 'vue'],
  jsPlugins: [
    {
      name: 'regexp',
      specifier: 'eslint-plugin-regexp'
    }
  ],
  categories: {
    correctness: 'off'
  },
  env: {
    builtin: true,
    es2024: true,
    node: true,
    vue: true
  },
  ignorePatterns: [
    '**/node_modules',
    '**/dist',
    '**/package-lock.json',
    '**/pnpm-lock.yaml',
    '**/bun.lockb',
    '**/coverage',
    '**/fixtures',
    '**/.idea',
    '**/*.min.*',
    '**/LICENSE*',
    '**/__snapshots__',
    '**/.DS_Store',
    '**/*.log',
    '**/*.tgz',
    '**/*.vsix',
    '**/logs',
    '**/.env',
    'docs/**'
  ],
  rules: {
    'for-direction': 'error',
    'no-async-promise-executor': 'error',
    'no-case-declarations': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': 'error',
    'no-constant-binary-expression': 'error',
    'no-constant-condition': 'error',
    'no-control-regex': 'error',
    'no-debugger': 'warn',
    'no-delete-var': 'error',
    'no-dupe-else-if': 'error',
    'no-duplicate-case': 'error',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    'no-empty-pattern': 'error',
    'no-empty-static-block': 'error',
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': 'error',
    'no-fallthrough': [
      'warn',
      {
        commentPattern: 'break[\\s\\w]*omitted'
      }
    ],
    'no-global-assign': 'error',
    'no-irregular-whitespace': 'error',
    'no-loss-of-precision': 'error',
    'no-misleading-character-class': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-prototype-builtins': 'error',
    'no-redeclare': 'error',
    'no-regex-spaces': 'error',
    'no-self-assign': 'error',
    'no-shadow-restricted-names': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-unused-labels': 'error',
    'no-unused-private-class-members': 'error',
    'no-useless-catch': 'error',
    'no-useless-escape': 'error',
    'require-yield': 'error',
    'use-isnan': [
      'error',
      {
        enforceForIndexOf: true,
        enforceForSwitchCase: true
      }
    ],
    'valid-typeof': [
      'error',
      {
        requireStringLiterals: true
      }
    ],
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    eqeqeq: ['error', 'smart'],
    'no-console': 'error',
    'no-duplicate-imports': 'error',
    'no-inner-declarations': 'error',
    'no-lonely-if': 'error',
    'no-multi-str': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'require-await': 'error',
    'unicode-bom': ['error', 'never'],
    'no-unused-vars': [
      'error',
      {
        args: 'after-used',
        ignoreRestSiblings: true
      }
    ],
    'vars-on-top': 'error',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-default': 'error',
    'import/no-self-import': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'unicorn/catch-error-name': 'error',
    'unicorn/consistent-empty-array-spread': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
          pascalCase: true
        }
      }
    ],
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-array-method-this-argument': 'error',
    'unicorn/no-await-in-promise-methods': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-invalid-remove-event-listener': 'error',
    'unicorn/no-lonely-if': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-single-promise-in-promise-methods': 'error',
    'unicorn/no-static-only-class': 'error',
    'unicorn/no-unnecessary-await': 'error',
    'unicorn/no-zero-fractions': 'error',
    'unicorn/prefer-add-event-listener': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-index-of': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-at': 'error',
    'unicorn/prefer-blob-reading-methods': 'error',
    'unicorn/prefer-date-now': 'error',
    'unicorn/prefer-dom-node-append': 'error',
    'unicorn/prefer-dom-node-dataset': 'error',
    'unicorn/prefer-dom-node-remove': 'error',
    'unicorn/prefer-dom-node-text-content': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-keyboard-event-key': 'error',
    'unicorn/prefer-math-trunc': 'error',
    'unicorn/prefer-modern-dom-apis': 'error',
    'unicorn/prefer-modern-math-apis': 'error',
    'unicorn/prefer-negative-index': 'error',
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-optional-catch-binding': 'error',
    'unicorn/prefer-prototype-methods': 'error',
    'unicorn/prefer-query-selector': 'error',
    'unicorn/prefer-reflect-apply': 'error',
    'unicorn/prefer-regexp-test': 'error',
    'unicorn/prefer-string-replace-all': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-trim-start-end': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/throw-new-error': 'error',
    'node/handle-callback-err': ['error', '^(err|error)$'],
    'node/no-exports-assign': 'error',
    'node/no-new-require': 'error',
    'node/no-path-concat': 'error',
    'jsdoc/check-access': 'warn',
    'jsdoc/check-property-names': 'warn',
    'jsdoc/empty-tags': 'warn',
    'jsdoc/implements-on-classes': 'warn',
    'jsdoc/no-defaults': 'warn',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-property': 'warn',
    'jsdoc/require-property-description': 'warn',
    'jsdoc/require-property-name': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'regexp/confusing-quantifier': 'warn',
    'regexp/control-character-escape': 'error',
    'regexp/match-any': 'error',
    'regexp/negation': 'error',
    'regexp/no-contradiction-with-assertion': 'error',
    'regexp/no-dupe-characters-character-class': 'error',
    'regexp/no-dupe-disjunctions': 'error',
    'regexp/no-empty-alternative': 'warn',
    'regexp/no-empty-capturing-group': 'error',
    'regexp/no-empty-character-class': 'error',
    'regexp/no-empty-group': 'error',
    'regexp/no-empty-lookarounds-assertion': 'error',
    'regexp/no-empty-string-literal': 'error',
    'regexp/no-escape-backspace': 'error',
    'regexp/no-extra-lookaround-assertions': 'error',
    'regexp/no-invalid-regexp': 'error',
    'regexp/no-invisible-character': 'error',
    'regexp/no-lazy-ends': 'warn',
    'regexp/no-legacy-features': 'error',
    'regexp/no-misleading-capturing-group': 'error',
    'regexp/no-misleading-unicode-character': 'error',
    'regexp/no-missing-g-flag': 'error',
    'regexp/no-non-standard-flag': 'error',
    'regexp/no-obscure-range': 'error',
    'regexp/no-optional-assertion': 'error',
    'regexp/no-potentially-useless-backreference': 'warn',
    'regexp/no-trivially-nested-assertion': 'error',
    'regexp/no-trivially-nested-quantifier': 'error',
    'regexp/no-unused-capturing-group': 'error',
    'regexp/no-useless-assertions': 'error',
    'regexp/no-useless-backreference': 'error',
    'regexp/no-useless-character-class': 'error',
    'regexp/no-useless-dollar-replacements': 'error',
    'regexp/no-useless-escape': 'error',
    'regexp/no-useless-flag': 'warn',
    'regexp/no-useless-lazy': 'error',
    'regexp/no-useless-non-capturing-group': 'error',
    'regexp/no-useless-quantifier': 'error',
    'regexp/no-useless-range': 'error',
    'regexp/no-useless-set-operand': 'error',
    'regexp/no-useless-string-literal': 'error',
    'regexp/no-useless-two-nums-quantifier': 'error',
    'regexp/no-zero-quantifier': 'error',
    'regexp/optimal-lookaround-quantifier': 'warn',
    'regexp/optimal-quantifier-concatenation': 'error',
    'regexp/prefer-character-class': 'error',
    'regexp/prefer-d': 'error',
    'regexp/prefer-plus-quantifier': 'error',
    'regexp/prefer-predefined-assertion': 'error',
    'regexp/prefer-question-quantifier': 'error',
    'regexp/prefer-range': 'error',
    'regexp/prefer-set-operation': 'error',
    'regexp/prefer-star-quantifier': 'error',
    'regexp/prefer-unicode-codepoint-escapes': 'error',
    'regexp/prefer-w': 'error',
    'regexp/simplify-set-operations': 'error',
    'regexp/sort-flags': 'error',
    'regexp/strict': 'error',
    'regexp/use-ignore-case': 'error',
    'constructor-super': 'off',
    'no-class-assign': 'off',
    'no-const-assign': 'off',
    'no-dupe-class-members': 'off',
    'no-dupe-keys': 'off',
    'no-func-assign': 'off',
    'no-import-assign': 'off',
    'no-new-native-nonconstructor': 'off',
    'no-obj-calls': 'off',
    'no-setter-return': 'off',
    'no-this-before-super': 'off',
    'no-unsafe-negation': 'off',
    'no-with': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true
      }
    ],
    'no-array-constructor': 'error',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true
      }
    ],
    'typescript/ban-ts-comment': 'off',
    'typescript/no-duplicate-enum-values': 'error',
    'typescript/no-empty-object-type': 'off',
    'typescript/no-explicit-any': 'off',
    'typescript/no-extra-non-null-assertion': 'error',
    'typescript/no-misused-new': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-non-null-asserted-optional-chain': 'error',
    'typescript/no-require-imports': 'off',
    'typescript/no-this-alias': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unsafe-declaration-merging': 'error',
    'typescript/no-unsafe-function-type': 'off',
    'typescript/no-wrapper-object-types': 'error',
    'typescript/prefer-as-const': 'warn',
    'typescript/prefer-namespace-keyword': 'error',
    'typescript/triple-slash-reference': 'error',
    'typescript/array-type': [
      'error',
      {
        default: 'array-simple'
      }
    ],
    'typescript/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as'
      }
    ],
    'typescript/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
        fixStyle: 'inline-type-imports'
      }
    ],
    'typescript/no-import-type-side-effects': 'error',
    'typescript/no-non-null-assertion': 'off',
    'typescript/prefer-literal-enum-member': [
      'error',
      {
        allowBitwiseExpressions: true
      }
    ]
  },
  overrides: [
    {
      files: ['content/**/*.md/*'],
      rules: {
        'no-unused-vars': 'off',
        'unicorn/prefer-reflect-apply': 'off',
        'unicorn/no-new-array': 'off'
      }
    }
  ]
})
