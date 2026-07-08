import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Bakti Udara',
  description: 'Technical documentation & client proposal for the Bakti Udara spares trading platform.',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }]
  ],

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/node_modules/**', '**/.git/**']
      }
    }
  },

  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Overview', link: '/guide/overview' },
      {
        text: 'Documentation',
        items: [
          { text: 'Architecture', link: '/guide/architecture' },
          { text: 'Tech Spec', link: '/guide/tech-spec' },
          { text: 'Business Process', link: '/guide/business-process' },
          { text: 'Modules', link: '/guide/modules' },
          { text: 'Data Model', link: '/guide/data-model' },
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'Proposal',
        items: [
          { text: 'Project Proposal', link: '/proposal/project-proposal' },
          { text: 'Pricing', link: '/proposal/pricing' },
          { text: 'Client Proposal', link: '/proposal/client-proposal' },
          { text: 'Roadmap', link: '/proposal/roadmap' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Technical Documentation',
          items: [
            { text: 'Project Overview', link: '/guide/overview' },
      { text: 'Business Process', link: '/guide/business-process' },
      { text: 'System Architecture', link: '/guide/architecture' },
      { text: 'Backend Tech Spec', link: '/guide/tech-spec' },
            { text: 'Module Breakdown', link: '/guide/modules' },
            { text: 'Data Model', link: '/guide/data-model' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        }
      ],
      '/proposal/': [
        {
          text: 'Proposal',
          items: [
            { text: 'Project Proposal', link: '/proposal/project-proposal' },
            { text: 'Pricing & Engagement', link: '/proposal/pricing' }
          ]
        },
        {
          text: 'Client Proposal',
          items: [
            { text: 'Proposal & Scope', link: '/proposal/client-proposal' },
            { text: 'Roadmap & Phasing', link: '/proposal/roadmap' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Bakti Udara — Spares Trading Platform. Phase 1 (Frontend Mockup).',
      copyright: '© 2025 Bakti Udara'
    },

    docFooter: {
      prev: true,
      next: true
    }
  }
})
