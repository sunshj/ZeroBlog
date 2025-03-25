import { defineConfig } from '@sunshj/eslint-config'

export default defineConfig([
  {
    rules: {
      'no-alert': 'off'
    }
  },
  {
    files: ['content/**/*.md/*'],
    rules: {
      'no-unused-vars': 'off',
      'unicorn/prefer-reflect-apply': 'off',
      'unicorn/no-new-array': 'off'
    }
  }
])
