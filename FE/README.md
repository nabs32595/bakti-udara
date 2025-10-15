# Bakti Udara Frontend

A modern Vue 3 application built with TypeScript and Vite for optimal development experience.

## 🚀 Features

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for lightning-fast development
- **Modern CSS** with CSS custom properties
- **Component-based architecture**
- **Hot Module Replacement (HMR)**

## 🛠️ Tech Stack

- Vue 3.5.22
- TypeScript 5.9.3
- Vite 7.1.7
- Node.js (latest LTS recommended)

## 📦 Project Structure

```
src/
├── components/          # Vue components
│   ├── layouts/        # Layout components
│   │   └── DashboardLayout.vue
│   └── ui/             # shadcn-vue components
├── pages/              # Route pages
│   ├── LoginPage.vue
│   ├── DashboardPage.vue
│   ├── AnalyticsPage.vue
│   └── SettingsPage.vue
├── router/             # Vue Router configuration
│   └── index.ts
├── lib/                # Utility functions
│   └── utils.ts
├── assets/             # Static assets
├── App.vue            # Root component
├── main.ts            # Application entry point
└── style.css          # Global styles with Tailwind
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Features Demonstrated

- **Modern Dashboard**: Clean, professional dashboard interface
- **Vue Router**: Client-side routing with navigation
- **shadcn-vue Components**: Beautiful, accessible UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript Integration**: Full type safety throughout
- **Component Architecture**: Well-organized component structure
- **Layout System**: Reusable layout components

## 🧩 Dashboard Features

### Pages
- **Login**: Authentication with Google OAuth and passwordless options
- **Dashboard**: Overview with key metrics and quick actions
- **Analytics**: Detailed performance insights and trends
- **Settings**: Application configuration and preferences

### Components
- **Sidebar Navigation**: Collapsible sidebar with route navigation
- **Card Components**: Information display with consistent styling
- **Button Variants**: Multiple button styles for different actions
- **Responsive Grid**: Adaptive layouts for different screen sizes

### Authentication
- **Google OAuth**: One-click login with Google account
- **Passwordless Login**: Username-based magic link authentication
- **Demo Mode**: UI-only implementation for development
- **Route Protection**: Automatic redirect to login when not authenticated

## 🔧 Development Tools

- **Vite**: Fast build tool and dev server
- **Vue TSC**: TypeScript compiler for Vue
- **Hot Module Replacement**: Instant updates during development

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.