# 𝕍 Voca — Language Learning App
 
A full-stack language learning web application that teaches Spanish and French through interactive exercises, real-time progress tracking, and adaptive lesson unlocking.
 
**Live Demo:** [https://language-learning-app-zq8v.vercel.app](https://language-learning-app-zq8v.vercel.app)
 
---

## Features
 
- **User Authentication** — Secure registration and login with JWT tokens, bcrypt password hashing and email/password validation
- **Multiple Languages** — Spanish and French with expandable architecture for adding more
- **3 Exercise Types** — Sentence translation, fill-in-the-blank and vocabulary matching
- **Lenient Answer Checking** — Ignores punctuation and accent marks so users aren't penalized for keyboard limitations
- **Progress Tracking** — Lesson completion, points, streaks and weekly activity stored per user in MongoDB
- **Milestone System** — Achievements that unlock based on real user data (first lesson, streak goals, word count)
- **Adaptive Unlocking** — Intermediate lessons unlock after completing all beginner lessons, advanced after intermediate
- **Vocabulary Browser** — Searchable word list with filtering by difficulty, showing translations, parts of speech and gender
- **Responsive Design** — Desktop-first layout with sidebar navigation, fully responsive for smaller screens

## Tech Stack
 
**Frontend**
- React
- React Router
- CSS Modules
- Vite
**Backend**
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt
**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
## Getting Started
 
### Prerequisites
 
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
### Installation
 
1. Clone the repository:
```bash
git clone https://github.com/emig23/language-learning-app.git
cd language-learning-app
```
 
2. Set up the backend:
```bash
cd server
npm install
```
 
3. Create a `.env` file in the `server` directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```
 
4. Seed the database:
```bash
node seed.js
```
 
5. Start the backend:
```bash
node app.js
```
 
6. Set up the frontend (in a new terminal):
```bash
cd client
npm install
npm run dev
```
 
7. Open [http://localhost:5173](http://localhost:5173) in your browser.
## Project Structure
 
```
language-learning-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Layout, sidebar navigation
│   │   ├── context/         # Auth context (global state)
│   │   ├── pages/           # All page components
│   │   │   ├── Landing      # Public landing page
│   │   │   ├── Auth         # Login / Register
│   │   │   ├── Dashboard    # Lesson list, stats, activity
│   │   │   ├── Lesson       # Exercise engine
│   │   │   ├── Vocab        # Word browser
│   │   │   ├── Progress     # Streaks, milestones, history
│   │   │   └── Languages    # Language switcher
│   │   └── styles/          # CSS Modules
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── WordVocabItem.js
│   │   ├── SentenceItem.js  
│   │   └── LessonProgress.js
│   ├── routes/
│   │   ├── auth.js          # Register, login
│   │   ├── users.js         # Profile, language selection
│   │   ├── api.js           # Words & sentences endpoints
│   │   └── progress.js      # Lesson completion & stats
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── data/                # Seed data (JSON)
│   └── seed.js              # Database seeder
```
 
## API Endpoints
 
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Log in and receive JWT |
| GET | `/users/me` | Get current user profile |
| PUT | `/users/language` | Update selected language |
| GET | `/api/words?language=spanish/french/etc.` | Get vocabulary by language |
| GET | `/api/sentences?language=spanish/french/etc.` | Get sentences by language |
| POST | `/progress/complete` | Save lesson completion |
| GET | `/progress` | Get completed lessons |
| GET | `/progress/stats` | Get full user statistics |
 
## Future Improvements

- Spaced repetition algorithm for reviewing weak areas
- Audio pronunciation for vocabulary and sentences
- Leaderboard system
- Additional languages 
- Mobile app version