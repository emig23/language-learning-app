import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/dashboard.module.css';

// TODO: replace with real API fetch from your backend
const MOCK_LESSONS = [
  { id: '1', title: 'Greetings & Introductions', difficulty: 'beginner',     progress: 100, locked: false },
  { id: '2', title: 'Food & Drink',              difficulty: 'beginner',     progress: 60,  locked: false },
  { id: '3', title: 'Family & People',           difficulty: 'beginner',     progress: 0,   locked: false },
  { id: '4', title: 'Work & School',             difficulty: 'intermediate', progress: 0,   locked: true  },
  { id: '5', title: 'City & Travel',             difficulty: 'intermediate', progress: 0,   locked: true  },
  { id: '6', title: 'Politics & Society',        difficulty: 'advanced',     progress: 0,   locked: true  },
];

const DIFFICULTY_COLOR = {
  beginner:     '#4ade80',
  intermediate: '#facc15',
  advanced:     '#f87171',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Hello, {user?.name} 👋</p>
          <h1 className={styles.title}>
            {user?.language ? `Learning ${user.language.charAt(0).toUpperCase() + user.language.slice(1)}` : 'Your Lessons'}
          </h1>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>↩</button>
      </header>

      <div className={styles.streak}>
        <span className={styles.streakIcon}>🔥</span>
        <span className={styles.streakCount}>3 day streak</span>
      </div>

      <h2 className={styles.sectionTitle}>Lessons</h2>
      <div className={styles.lessonList}>
        {MOCK_LESSONS.map((lesson) => (
          <button
            key={lesson.id}
            className={`${styles.lessonCard} ${lesson.locked ? styles.locked : ''}`}
            onClick={() => !lesson.locked && navigate(`/lesson/${lesson.id}`)}
            disabled={lesson.locked}
          >
            <div className={styles.lessonLeft}>
              <span
                className={styles.difficultyDot}
                style={{ background: DIFFICULTY_COLOR[lesson.difficulty] }}
              />
              <div>
                <p className={styles.lessonTitle}>{lesson.title}</p>
                <p className={styles.lessonDifficulty}>{lesson.difficulty}</p>
              </div>
            </div>
            <div className={styles.lessonRight}>
              {lesson.locked ? (
                <span className={styles.lockIcon}>🔒</span>
              ) : (
                <div className={styles.progressRing}>
                  <span>{lesson.progress}%</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}