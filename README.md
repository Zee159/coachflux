# CoachFlux

**AI-powered GROW coaching platform for personal development and goal achievement**

CoachFlux is a conversational AI coaching application that guides users through structured coaching frameworks, starting with the GROW (Goal, Reality, Options, Will) model.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your Anthropic API key to .env.local

# Start development server
pnpm dev

# In another terminal, start Convex
pnpm convex:dev
```

Visit `http://localhost:5173` to start coaching!

## 📚 Documentation

All project documentation is organized in the [`docs/`](./docs/) folder:

- **[Getting Started](./docs/01-getting-started/)** - Setup and project overview
- **[Frameworks](./docs/02-frameworks/)** - Coaching framework specifications
- **[Architecture](./docs/03-architecture/)** - Technical architecture and design
- **[Features](./docs/04-features/)** - Feature specifications
- **[Business](./docs/05-business/)** - Business model and strategy
- **[Legal](./docs/06-legal/)** - Legal compliance and policies
- **[Planning](./docs/07-planning/)** - Project planning and roadmap
- **[Development](./docs/08-development/)** - Development guidelines

👉 **[View Full Documentation Index](./docs/README.md)**

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Convex (serverless backend)
- **AI**: Anthropic Claude (via Convex HTTP actions)
- **Deployment**: Netlify (frontend) + Convex Cloud (backend)

## 🎯 Current Status

**Phase 1: GROW Framework MVP** ✅ Complete
- Anonymous coaching sessions
- Full GROW framework implementation
- Session reports with structured data
- Safety escalation system
- UK English conversational tone

**Phase 2: User Onboarding & Freemium** 🚧 In Progress
- User authentication
- Session history
- Email capture and newsletter
- Free vs. paid tier implementation

## 🤝 Contributing

See [CONTRIBUTING.md](./docs/01-getting-started/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/Zee159/coachflux/issues)

---

*Built with ❤️ for better coaching conversations*
