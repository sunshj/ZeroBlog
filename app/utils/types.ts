export interface Friend {
  name: string
  link: string
  avatar: string
  description: string
}

export interface Project {
  name: string
  link?: string
  repo?: string
  npm?: string
  description: string
  techStack?: string[]
}
