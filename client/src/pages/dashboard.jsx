import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/dashboard.module.css';

const MOCK_LESSONS = [
  { id: '1', title: 'Greetings & Introductions', difficulty: 'beginner',     progress: 100, locked: false },
  { id: '2', title: 'Food & Drink',              difficulty: 'beginner',     progress: 60,  locked: false },
  { id: '3', title: 'Family & People',           difficulty: 'beginner',     progress: 0,   locked: false },
  { id: '4', title: 'Work & School',             difficulty: 'intermediate', progress: 0,   locked: true  },
  { id: '5', title: 'City & Travel',             difficulty: 'intermediate', progress: 0,   locked: true  },
  { id: '6', title: 'Politics & Society',        difficulty: 'advanced',     progress: 0,   locked: true  },
];

const COURSE_CARDS = [
  { language: 'Spanish', flag: '🇪🇸', lessons: 24, progress: 75, color: '#e8547a' },
  { language: 'French',  flag: '🇫🇷', lessons: 20, progress: 50, color: '#c45ecf' },
];

const DIFFICULTY_COLOR = {
  beginner:     'var(--accent-teal)',
  intermediate: 'var(--accent-orange)',
  advanced:     'var(--accent-secondary)',
};

function ProgressCircle({ percent, color }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
      <circle
        cx="26" cy="26" r={r}
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="31" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
        {percent}%
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const completedLessons = MOCK_LESSONS.filter(l => l.progress === 100).length;
  const inProgress = MOCK_LESSONS.filter(l => l.progress > 0 && l.progress < 100).length;
  const totalPoints = completedLessons * 50 + inProgress * 10;

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Hello, {user?.name}, welcome back!</p>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>↩</button>
      </header>

      {/* Course Cards */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>My Courses</h2>
          <span className={styles.viewAll}>View All</span>
        </div>
        <div className={styles.courseGrid}>
          {COURSE_CARDS.map(course => (
            <div
              key={course.language}
              className={styles.courseCard}
              style={{ background: `linear-gradient(135deg, ${course.color}cc, ${course.color}88)` }}
              onClick={() => navigate('/dashboard')}
            >
              <div className={styles.courseTop}>
                <div>
                  <p className={styles.courseLanguage}>{course.language}</p>
                  <p className={styles.courseLessons}>{course.lessons} lessons</p>
                </div>
                <ProgressCircle percent={course.progress} color={course.color} />
              </div>
              <div className={styles.courseFlag}>{course.flag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Statistics</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Lessons Done</p>
            <p className={styles.statValue}>{completedLessons}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Points</p>
            <p className={styles.statValue}>{totalPoints}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>In Progress</p>
            <p className={styles.statValue}>{inProgress}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Day Streak</p>
            <p className={styles.statValue}>🔥 3</p>
          </div>
        </div>
      </section>

      {/* Lesson List */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Lessons</h2>
          <span className={styles.viewAll}>View All</span>
        </div>
        <div className={styles.lessonList}>
          {MOCK_LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              className={`${styles.lessonCard} ${lesson.locked ? styles.locked : ''}`}
              onClick={() => !lesson.locked && navigate(`/lesson/${lesson.id}`)}
              disabled={lesson.locked}
            >
              <div className={styles.lessonLeft}>
                <div
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
                ) : lesson.progress === 100 ? (
                  <span className={styles.doneBadge}>✓ Done</span>
                ) : lesson.progress > 0 ? (
                  <span className={styles.progressBadge}>{lesson.progress}%</span>
                ) : (
                  <span className={styles.startBadge}>Start →</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}