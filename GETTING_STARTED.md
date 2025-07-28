# 🚀 Getting Started with StudyGenius

Welcome to StudyGenius - The Ultimate Educational Platform! This guide will help you set up and run the platform locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 8+** - Usually comes with Node.js
- **PostgreSQL database** - [Download here](https://www.postgresql.org/download/) (optional for demo)
- **Git** - [Download here](https://git-scm.com/)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/study-genius.git
cd study-genius
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

### 4. Configure Environment Variables

Edit your `.env` file with the following settings:

```env
# Database (optional for demo - uses mock data)
DATABASE_URL=postgresql://username:password@localhost:5432/studygenius

# Session Management
SESSION_SECRET=your-super-secret-session-key-replace-with-random-string

# AI Services (optional for demo)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key-optional
GOOGLE_AI_API_KEY=your-google-ai-api-key-optional

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 5. Initialize Database (Optional)

If you have PostgreSQL set up:

```bash
npm run db:push
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Demo Mode

StudyGenius works out of the box with mock data! You can:

1. **Browse without login** - View the landing pages
2. **Demo login** - Use any email/password combination to access the platform
3. **Explore features** - All main features work with simulated data

### Demo Credentials

For quick testing, you can use:
- **Email**: `demo@studygenius.com`
- **Password**: `demo123`

## 🏗️ Available Scripts

```bash
# Development
npm run dev          # Start development servers (client + server)
npm run dev:client   # Frontend only
npm run dev:server   # Backend only

# Production
npm run build        # Build for production
npm run start        # Start production server

# Testing & Quality
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run lint         # Code linting
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript checking

# Database (if using PostgreSQL)
npm run db:generate  # Generate migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open database studio

# Docker (optional)
npm run docker:build # Build Docker image
npm run docker:run   # Run container
```

## 🌟 Key Features Available

### ✅ Fully Functional
- **🏠 Dashboard** - Main hub with feature overview
- **🔐 Authentication** - Login/Register (demo mode)
- **📸 Homework Solver** - Upload images and get AI solutions
- **🎮 Learning Games** - 10 interactive educational games
- **📅 Study Planner** - AI-powered task management
- **🤖 AI Chatbot** - Educational assistant (existing implementation)

### 🚧 Coming Soon
- **📝 Notes & Drawing** - Rich text editor and Apple Pen support
- **🃏 Flashcards** - Spaced repetition system
- **💬 Messaging** - Real-time communication
- **🎥 Video Calls** - Virtual study rooms
- **🔬 Research Tools** - Academic paper search and citations

## 🎨 UI/UX Features

- **Beautiful Design** - Modern glass morphism interface
- **Responsive Layout** - Works on all devices
- **Dark/Light Themes** - Customizable appearance
- **Smooth Animations** - Framer Motion powered
- **Accessibility** - WCAG compliant design

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Wouter** for routing
- **Lucide React** for icons

### Backend (Planned)
- **Node.js + Express**
- **PostgreSQL** database
- **Socket.io** for real-time features
- **OpenAI API** integration

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
```

### Option 3: Docker
```bash
# Build and run with Docker
npm run docker:build
npm run docker:run
```

## 🔗 API Integration

### OpenAI Setup (Optional)
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env`: `OPENAI_API_KEY=your-key-here`
3. Restart the development server

### Google OAuth Setup (Optional)
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## 📱 Mobile Development

The platform is mobile-responsive and works great on:
- **iOS Safari**
- **Android Chrome**
- **Progressive Web App** ready

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or change port in .env
PORT=3001
```

**Node modules issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database connection issues:**
```bash
# Check PostgreSQL status
sudo service postgresql status
# Or skip database setup for demo mode
```

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/study-genius/issues)
- **Documentation**: Check the README.md for detailed information
- **Community**: Join our Discord server (link coming soon)

## 🎯 Next Steps

1. **Explore the Dashboard** - Navigate through all features
2. **Try the Homework Solver** - Upload a math problem image
3. **Play Learning Games** - Test the gamification features
4. **Set up API keys** - Enable AI features
5. **Join the Community** - Share feedback and suggestions

## 🏆 Pro Tips

- **Use Chrome DevTools** - Inspect the beautiful UI components
- **Check the Network Tab** - See the API calls in action
- **Try Mobile View** - Test responsive design
- **Explore Animations** - Notice the smooth Framer Motion effects

---

**Ready to revolutionize education? Start exploring StudyGenius now! 🚀**

*Built with ❤️ for the future of learning*