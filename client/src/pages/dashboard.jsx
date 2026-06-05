import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/dashboard.module.css';

const MOCK_LESSONS = [
  { id: '1', title: 'Greetings & Introductions', difficulty: 'beginner',     progress: 0, locked: false, sentences: 5 },
  { id: '2', title: 'Food & Drink',              difficulty: 'beginner',     progress: 0,  locked: false, sentences: 5 },
  { id: '3', title: 'Family & People',           difficulty: 'beginner',     progress: 0,   locked: false, sentences: 5 },
  { id: '4', title: 'Work & School',             difficulty: 'intermediate', progress: 0,   locked: true,  sentences: 5 },
  { id: '5', title: 'City & Travel',             difficulty: 'intermediate', progress: 0,   locked: true,  sentences: 5 },
  { id: '6', title: 'Politics & Society',        difficulty: 'advanced',     progress: 0,   locked: true,  sentences: 5 },
];

const DIFFICULTY_COLOR = {
  beginner:     'var(--accent-teal)',
  intermediate: 'var(--accent-orange)',
  advanced:     'var(--accent-secondary)',
};

function ProgressCircle({ percent, size = 52, stroke = 5, color = 'white' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const center = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={center} cy={center} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
      <circle
        cx={center} cy={center} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text x={center} y={center + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
        {percent}%
      </text>
    </svg>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className={styles.progressBarTrack}>
      <div className={styles.progressBarFill} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const completedLessons = MOCK_LESSONS.filter(l => l.progress === 100).length;
  const inProgress = MOCK_LESSONS.filter(l => l.progress > 0 && l.progress < 100).length;
  const totalPoints = completedLessons * 50 + inProgress * 10;
  const lang = user?.language
    ? user.language.charAt(0).toUpperCase() + user.language.slice(1)
    : 'a language';

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back, {user?.name}. Keep it up!</p>
        </div>
        <div className={styles.streakPill}>
          <span>🔥</span>
          <span>3 day streak</span>
        </div>
      </header>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'color-mix(in srgb, var(--accent-teal) 12%, transparent)', color: 'var(--accent-teal)' }}>✓</div>
          <div>
            <p className={styles.statValue}>{completedLessons}</p>
            <p className={styles.statLabel}>Completed</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'color-mix(in srgb, var(--accent-orange) 12%, transparent)', color: 'var(--accent-orange)' }}>▶</div>
          <div>
            <p className={styles.statValue}>{inProgress}</p>
            <p className={styles.statLabel}>In Progress</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)', color: 'var(--accent-primary)' }}>★</div>
          <div>
            <p className={styles.statValue}>{totalPoints}</p>
            <p className={styles.statLabel}>Total Points</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'color-mix(in srgb, var(--accent-secondary) 12%, transparent)', color: 'var(--accent-secondary)' }}>📖</div>
          <div>
            <p className={styles.statValue}>{lang}</p>
            <p className={styles.statLabel}>Currently Learning</p>
          </div>
        </div>
      </div>

      {/* Two-column area */}
      <div className={styles.columns}>

        {/* Left — Lessons */}
        <div className={styles.colLeft}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Lessons</h2>
            <span className={styles.lessonCount}>{MOCK_LESSONS.length} total</span>
          </div>
          <div className={styles.lessonList}>
            {MOCK_LESSONS.map((lesson, i) => (
              <button
                key={lesson.id}
                className={`${styles.lessonCard} ${lesson.locked ? styles.locked : ''}`}
                onClick={() => !lesson.locked && navigate(`/lesson/${lesson.id}`)}
                disabled={lesson.locked}
              >
                <div className={styles.lessonIndex}>
                  {lesson.locked ? '🔒' : lesson.progress === 100 ? '✓' : i + 1}
                </div>
                <div className={styles.lessonBody}>
                  <div className={styles.lessonMeta}>
                    <p className={styles.lessonTitle}>{lesson.title}</p>
                    <div className={styles.lessonTags}>
                      <span
                        className={styles.diffTag}
                        style={{ color: DIFFICULTY_COLOR[lesson.difficulty], borderColor: DIFFICULTY_COLOR[lesson.difficulty] }}
                      >
                        {lesson.difficulty}
                      </span>
                      <span className={styles.sentenceTag}>{lesson.sentences} sentences</span>
                    </div>
                  </div>
                  {!lesson.locked && (
                    <ProgressBar percent={lesson.progress} />
                  )}
                </div>
                <div className={styles.lessonAction}>
                  {lesson.locked ? (
                    <span className={styles.lockedLabel}>Locked</span>
                  ) : lesson.progress === 100 ? (
                    <span className={styles.doneBadge}>Done</span>
                  ) : lesson.progress > 0 ? (
                    <span className={styles.continueBadge}>Continue</span>
                  ) : (
                    <span className={styles.startBadge}>Start</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — Course overview + activity */}
        <div className={styles.colRight}>

          {/* Course card */}
          <div className={styles.courseCard}>
            <div className={styles.courseGlow} />
            <div className={styles.courseContent}>
              <div className={styles.courseInfo}>
                <p className={styles.courseLabel}>Current Course</p>
                <h3 className={styles.courseLang}>{lang}</h3>
                <p className={styles.courseStat}>
                  {completedLessons}/{MOCK_LESSONS.length} lessons completed
                </p>
              </div>
              <ProgressCircle
                percent={Math.round((completedLessons / MOCK_LESSONS.length) * 100)}
                size={72}
                stroke={6}
              />
            </div>
          </div>

          {/* Weekly activity */}
          <div className={styles.activityCard}>
            <h3 className={styles.activityTitle}>This Week</h3>
            <div className={styles.activityGrid}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const heights = [65, 80, 45, 0, 0, 0, 0];
                const active = i < 3;
                return (
                  <div key={day} className={styles.activityDay}>
                    <div
                      className={styles.activityBar}
                      style={{
                        height: active ? `${heights[i]}%` : '6%',
                        background: active ? 'var(--accent-primary)' : 'var(--border)',
                      }}
                    />
                    <span className={`${styles.activityLabel} ${active ? styles.activityLabelActive : ''}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick tip */}
          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <p className={styles.tipTitle}>Tip of the day</p>
              <p className={styles.tipText}>
                Try translating sentences out loud — it helps with pronunciation and recall.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}