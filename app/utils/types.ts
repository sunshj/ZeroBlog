import type { FriendsCollectionItem, ProjectsCollectionItem } from '@nuxt/content'

// 友链：直接复用 nuxt-content 生成的 friends 数据集合内 friends 数组的元素类型
export type Friend = FriendsCollectionItem['friends'][number]

// 项目：直接复用 nuxt-content 生成的 projects 数据集合内 projects 数组的元素类型
export type Project = ProjectsCollectionItem['projects'][number]
