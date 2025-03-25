---
title: 树
date: '2024-11-17 13:26:33'
path: /notes/tree
---

## 数组转树

::code-group
  ```ts [build-tree.ts]
  type DeepTreeNode<T> = T & { children: Array<DeepTreeNode<T>> }

  interface BuildTreeOptions<T> {
    key: keyof T
    parentKey: keyof T
  }

  function buildTree<T extends object>(array: T[], options: BuildTreeOptions<T>) {
    const { key, parentKey } = options
    const tree: Array<DeepTreeNode<T>> = []
    const lookup = new Map<T[keyof T], DeepTreeNode<T>>()

    for (const item of array) {
      lookup.set(item[key], { ...item, children: [] })
    }

    for (const item of array) {
      if (item[parentKey]) {
        const parent = lookup.get(item[parentKey])
        if (parent) {
          parent.children.push(lookup.get(item[key]) as DeepTreeNode<T>)
        }
      } else {
        tree.push(lookup.get(item[key]) as DeepTreeNode<T>)
      }
    }

    return tree
  }
  ```

```ts [test.ts]
const raw = [
    { "id": 1, "pid": null, "content": "这是一条顶级评论" },
    { "id": 2, "pid": 1, "content": "这是对评论1的回复" },
    { "id": 3, "pid": 2, "content": "这是对评论2的回复" },
    { "id": 4, "pid": 1, "content": "这是对评论1的另一条回复" },
    { "id": 5, "pid": null, "content": "这是另一条顶级评论" }
];

const comments = buildTree(raw, { key: 'id', parentKey: 'pid' })

console.log(comments)
```

```json [test-result.json]
[
    {
        "id": 1,
        "pid": null,
        "content": "这是一条顶级评论",
        "children": [
            {
                "id": 2,
                "pid": 1,
                "content": "这是对评论1的回复",
                "children": [
                    {
                        "id": 3,
                        "pid": 2,
                        "content": "这是对评论2的回复",
                        "children": []
                    }
                ]
            },
            {
                "id": 4,
                "pid": 1,
                "content": "这是对评论1的另一条回复",
                "children": []
            }
        ]
    },
    {
        "id": 5,
        "pid": null,
        "content": "这是另一条顶级评论",
        "children": []
    }
]
```
::

## 浅层树
只构建一层父子关系，子孙节点全部扁平化

::code-group
```ts [build-shallow-tree.ts]
type TreeNode<T, C = any> = T & { children: C[] }
type ShallowTreeNode<T> = TreeNode<T, T>

interface BuildTreeOptions<T> {
    key: keyof T
    parentKey: keyof T
}

function buildShallowTree<T extends object>(array: T[], options: BuildTreeOptions<T>) {
  const { key, parentKey } = options

  const lookup = new Map<keyof T, ShallowTreeNode<T>>()

  for (const item of array) {
    lookup.set(item[key] as keyof T, { ...item, children: [] })
  }

  function* ancestry(id: keyof T): Generator<keyof T> {
    if (id && lookup.has(id)) {
      yield id
      yield* ancestry(lookup.get(id)![parentKey] as keyof T)
    }
  }

  array.forEach(node => {
    const [ancestor] = [...ancestry(node[parentKey] as keyof T)].reverse()
    if (ancestor && lookup.has(ancestor)) {
      lookup.get(ancestor)!.children.push(lookup.get(node[key] as keyof T)!)
    }
  })

  return Array.from(lookup.values()).filter(node => node[parentKey] === null)
}
```

```ts [test.ts]
const raw = [
    { "id": 1, "pid": null, "content": "这是一条顶级评论" },
    { "id": 2, "pid": 1, "content": "这是对评论1的回复" },
    { "id": 3, "pid": 2, "content": "这是对评论2的回复" },
    { "id": 4, "pid": 1, "content": "这是对评论1的另一条回复" },
    { "id": 5, "pid": null, "content": "这是另一条顶级评论" }
]

const comments = buildShallowTree(raw, { key: 'id', parentKey: 'pid' })
console.log(comments)
```

```json [test-result.json]
[
    {
        "id": 1,
        "pid": null,
        "content": "这是一条顶级评论",
        "children": [
            {
                "id": 2,
                "pid": 1,
                "content": "这是对评论1的回复",
                "children": []
            },
            {
                "id": 3,
                "pid": 2,
                "content": "这是对评论2的回复",
                "children": []
            },
            {
                "id": 4,
                "pid": 1,
                "content": "这是对评论1的另一条回复",
                "children": []
            }
        ]
    },
    {
        "id": 5,
        "pid": null,
        "content": "这是另一条顶级评论",
        "children": []
    }
]
```
::

## 统计树节点数量

::code-group
```ts [count-tree-nodes.ts]
function countTreeNodes<T>(nodes: Array<TreeNode<T>>): number {
  let count = 0

  const traverse = (node: TreeNode<T>) => {
    count++
    for (const child of node.children) {
      traverse(child)
    }
  }

  for (const node of nodes) {
    traverse(node)
  }

  return count
}
```

```ts [tree-data.ts]
const tree = [
  {
    id: 1,
    pid: null,
    content: "这是一条顶级评论",
    children: [
      {
        id: 2,
        pid: 1,
        content: "这是对评论1的回复",
        children: [
          {
            id: 3,
            pid: 2,
            content: "这是对评论2的回复",
            children: [],
          },
        ],
      },
      {
        id: 4,
        pid: 1,
        content: "这是对评论1的另一条回复",
        children: [],
      },
    ],
  },
  {
    id: 5,
    pid: null,
    content: "这是另一条顶级评论",
    children: [],
  },
];
```

```ts [test.ts]
const count = countTreeNodes(tree)
const firstNodeCount = countTreeNodes(tree.find(i => i.id === 1)!.children)
console.log(count) // 5
console.log(firstNodeCount) // 3
```
::

## 树扁平化

::code-group
```ts [flatten-tree.ts]
function flattenTree<T>(tree: T[], childrenKey: keyof T) {
  const result: Array<Omit<T, keyof T>> = [];

  function recurse(nodes: T[] | undefined) {
    if (!nodes) return;

    for (const node of nodes) {
      const { [childrenKey]: children, ...rest } = node;
      result.push(rest);
      recurse(children as T[]);
    }
  }

  recurse(tree);
  return result;
}

```
```ts [tree-data.ts]
const tree = [
  {
    id: 1,
    pid: null,
    content: "这是一条顶级评论",
    children: [
      {
        id: 2,
        pid: 1,
        content: "这是对评论1的回复",
        children: [
          {
            id: 3,
            pid: 2,
            content: "这是对评论2的回复",
            children: [],
          },
        ],
      },
      {
        id: 4,
        pid: 1,
        content: "这是对评论1的另一条回复",
        children: [],
      },
    ],
  },
  {
    id: 5,
    pid: null,
    content: "这是另一条顶级评论",
    children: [],
  },
];
```

```ts [test.ts]
const result = flattenTree(tree, 'children')
console.log(result)
/**
[
  {
    id: 1,
    pid: null,
    content: "这是一条顶级评论",
  },
  {
    id: 2,
    pid: 1,
    content: "这是对评论1的回复",
  },
  {
    id: 3,
    pid: 2,
    content: "这是对评论2的回复",
  },
  {
    id: 4,
    pid: 1,
    content: "这是对评论1的另一条回复",
  },
  {
    id: 5,
    pid: null,
    content: "这是另一条顶级评论",
  }
]
 */
```
::