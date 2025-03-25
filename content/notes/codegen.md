---
title: Codegen Helper
date: '2025-01-12 19:40:59'
path: /notes/codegen
---

## Codegen Helper


::code-group
```ts [CodegenContext.ts]
class CodegenContext {
  code = ''
  private level = 0

  push(code: string) {
    this.code += code
  }

  newline(indent?: number) {
    this.push(`\n${'  '.repeat(indent ?? this.level)}`)
  }

  indent() {
    this.newline(++this.level)
  }

  deindent(noNewline = false) {
    if (noNewline) {
      --this.level
    } else {
      this.newline(--this.level)
    }
  }
}
```

```ts [test.ts]
const ctx = new CodegenContext()

ctx.push('function sum(a, b){')
ctx.indent()
ctx.push('return a + b')
ctx.deindent()
ctx.push('}')


console.log(ctx.code)

// "function sum(a, b){
//   return a + b
// }" 
```

::