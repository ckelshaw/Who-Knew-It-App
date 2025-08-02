Who Knew It Game

A real-time, web-based trivia game built for the Who Knew It with Matt Stewart podcast. Contestants join the game, submit fake answers to trivia questions, and try to fool each other to score points, just like on the show.

Live Demo: Coming soon

Features
	•	Host controlled game sessions
	•	Contestants join via invite link or game code
	•	Real time gameplay with Socket.io
	•	Players submit fake answers to trivia questions
	•	Points awarded for correct guesses and baiting others
	•	Admin dashboard to create and manage games
	•	Optional avatars, roles (host/contestant), and stats tracking

Tech Stack

Frontend: React + TypeScript, Tailwind CSS
Backend: Node.js, Express, Socket.io
Database: Supabase (PostgreSQL)
Realtime: Socket.io
Hosting: Vercel (frontend), Render (backend)

Folder Structure

/client — React frontend (TypeScript, Tailwind)
/server — Express backend (routes, controllers, game logic)
/shared — Shared class models and types (User, Game, Question, etc.)

Setup Instructions
	1.	Clone the Repository:
git clone https://github.com/your-username/who-knew-it-app.git
cd WhoKnewItGame
	2.	Install Dependencies:
Frontend:
cd client
npm install
Backend:
cd ../server
npm install
	3.	Environment Variables:
Create .env.local files in both client/ and server/.
Example client/.env.local:
VITE_BACKEND_URL=http://localhost:3001
Example server/.env.local:
PORT=3001
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=your_supabase_key
	4.	Start Dev Environment:
Backend:
cd server
npm run dev
Frontend:
cd client
npm run dev
The frontend runs on http://localhost:5173 and backend on http://localhost:3001

Sample Game Flow
	1.	Host creates a game on the dashboard.
	2.	Contestants join via invite link.
	3.	Host inputs a trivia question.
	4.	Contestants submit their best fake answer.
	5.	Answers are revealed and players vote on what they think is real.
	6.	Points are calculated.
	7.	Repeat for multiple rounds.

Future Enhancements
	•	Allow listeners to submit trivia questions
	•	Leaderboards and long-term stats
	•	Mobile responsiveness
	•	In-game chat
