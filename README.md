# Play4Good

Play4Good is an innovative platform that gamifies charitable giving and social impact. It allows users to support various causes through donations while engaging in friendly competition and team-based activities.

## Features

- Team formation and collaboration for charitable efforts
- Real-time tracking of donation progress and impact
- Leaderboards for individuals and teams
- Time-limited challenges and competitions
- Achievement system to recognize donor milestones
- Personalized cause recommendations
- Transparent reporting on donation use and impact

## Tech Stack

- Frontend: Next.js
- Backend: Go
- Database: PostgreSQL
- Deployment: Render
- Authentication: NextAuth.js
- Payment Processing: Stripe

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Go (v1.16 or later)
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository
- git clone https://github.com/yourusername/play4good.git
- cd play4good

3. Install frontend dependencies
- cd frontend
- npm install

4. Install backend dependencies
- cd ../backend
- go mod tidy

5. Set up environment variables
- Create a `.env` file in both the `frontend` and `backend` directories
- Add necessary environment variables (database connection, API keys, etc.)

5. Start the development servers
In the frontend directory
npm run dev
In the backend directory
go run main.go

## Contributing

We welcome contributions to Play4Good! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to all the contributors who have helped shape Play4Good
- Inspired by the power of gamification in driving positive social change
