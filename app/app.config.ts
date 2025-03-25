export default defineAppConfig({
  mdcp: {
    codeIconMap: {
      '.commitlintrc.cjs': 'vscode-icons:file-type-commitlint',
      'vite.config.js': 'vscode-icons:file-type-vite'
    },
    codeBlock: {
      enableFold: true,
      foldHeight: 500
    }
  },

  site: {
    title: "sunshj's Blog",
    description: '用心写点没用的东西~',
    author: 'sunshj',
    link: 'https://sunshj.top',
    avatar: '/images/avatar.png'
  },

  firstScreen: {
    content: '用心写点没用的东西~',
    backgroundImage: '/images/bg.svg',
    disableTypingAnimation: false
  },

  articleConfig: {
    comment: true,
    copyright: true,
    surround: true
  },

  notesConfig: {
    comment: false,
    copyright: false,
    surround: false
  },

  giscus: {
    repo: 'sunshj/blogComments' as `${string}/${string}`,
    repoId: 'R_kgDOMxnK-w',
    category: 'Announcements',
    categoryId: 'DIC_kwDOMxnK-84CieT2'
  },

  header: {
    navLinks: [
      {
        name: 'Home',
        to: '/'
      },
      {
        name: 'Articles',
        to: '/articles'
      },
      {
        name: 'Notes',
        to: '/notes'
      },
      {
        name: 'Projects',
        to: '/projects'
      },
      {
        name: 'Friends',
        to: '/friends'
      },
      {
        name: 'About',
        to: '/about'
      }
    ]
  },

  footer: {
    since: 2021,
    socialLinks: [
      {
        name: 'GitHub',
        icon: 'lucide:github',
        link: 'https://github.com/sunshj'
      },
      {
        name: 'Twitter',
        icon: 'lucide:twitter',
        link: 'https://twitter.com/sunshj'
      },
      {
        name: 'Email',
        icon: 'lucide:mail',
        link: 'mailto:me#sunshj.top'
      }
    ]
  }
})
