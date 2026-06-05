import { useAuth } from '../context/authContext';
import styles from '../styles/progress.module.css';

const STREAK_DATA = [
  { day: 'Mon', active: true,  minutes: 0 },
  { day: 'Tue', active: true,  minutes: 0 },
  { day: 'Wed', active: true,  minutes: 0 },
  { day: 'Thu', active: false, minutes: 0 },
  { day: 'Fri', active: false, minutes: 0 },
  { day: 'Sat', active: false, minutes: 0 },
  { day: 'Sun', active: false, minutes: 0 },
];

const MILESTONES = [
  { label: 'First Lesson',     achieved: false,  icon: '🎯', desc: 'Complete your first lesson' },
  { label: '3 Day Streak',     achieved: false,  icon: '🔥', desc: 'Study 3 days in a row' },
  { label: '10 Lessons Done',  achieved: false, icon: '📚', desc: 'Complete 10 lessons total', progress: 3, target: 10 },
  { label: '7 Day Streak',     achieved: false, icon: '⚡', desc: 'Study every day for a week', progress: 3, target: 7 },
  { label: 'First 100 Words',  achieved: false, icon: '💬', desc: 'Learn 100 vocabulary words', progress: 15, target: 100 },
];

const RECENT_LESSONS = [
  { title: 'Greetings & Introductions', score: '0/5', date: 'Today', perfect: true },
  { title: 'Food & Drink',              score: '3/5', date: 'Yesterday', perfect: false },
  { title: 'Greetings & Introductions', score: '4/5', date: '2 days ago', perfect: false },
];

export default function Progress() {
  const { user } = useAuth();

  const currentStreak = STREAK_DATA.filter(d => d.active).length;
  const totalMinutes = STREAK_DATA.reduce((sum, d) => sum + d.minutes, 0);
  const lang = user?.language
    ? user.language.charAt(0).toUpperCase() + user.language.slice(1)
    : 'None';

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Progress</h1>
          <p className={styles.pageSubtitle}>Track your learning journey</p>
        </div>
      </header>

      {/* Overview stats */}
      <div className={styles.overviewRow}>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>🔥</span>
          <div>
            <p className={styles.overviewValue}>{currentStreak} days</p>
            <p className={styles.overviewLabel}>Current Streak</p>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>⏱</span>
          <div>
            <p className={styles.overviewValue}>{totalMinutes} min</p>
            <p className={styles.overviewLabel}>This Week</p>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>📖</span>
          <div>
            <p className={styles.overviewValue}>3</p>
            <p className={styles.overviewLabel}>Lessons Done</p>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>💬</span>
          <div>
            <p className={styles.overviewValue}>15</p>
            <p className={styles.overviewLabel}>Words Learned</p>
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className={styles.columns}>

        {/* Left column */}
        <div className={styles.colLeft}>

          {/* Streak calendar */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Weekly Streak</h2>
              <span className={styles.cardBadge}>{currentStreak}/7 days</span>
            </div>
            <div className={styles.streakGrid}>
              {STREAK_DATA.map(d => (
                <div key={d.day} className={styles.streakDay}>
                  <div className={`${styles.streakCircle} ${d.active ? styles.streakActive : ''}`}>
                    {d.active ? '✓' : ''}
                  </div>
                  <span className={`${styles.streakLabel} ${d.active ? styles.streakLabelActive : ''}`}>
                    {d.day}
                  </span>
                  {d.active && (
                    <span className={styles.streakMinutes}>{d.minutes}m</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Milestones</h2>
              <span className={styles.cardBadge}>
                {MILESTONES.filter(m => m.achieved).length}/{MILESTONES.length} unlocked
              </span>
            </div>
            <div className={styles.milestoneList}>
              {MILESTONES.map(m => (
                <div key={m.label} className={`${styles.milestone} ${m.achieved ? styles.milestoneAchieved : ''}`}>
                  <div className={styles.milestoneLeft}>
                    <span className={styles.milestoneIcon}>{m.icon}</span>
                    <div>
                      <p className={styles.milestoneName}>{m.label}</p>
                      <p className={styles.milestoneDesc}>{m.desc}</p>
                    </div>
                  </div>
                  <div className={styles.milestoneRight}>
                    {m.achieved ? (
                      <span className={styles.milestoneCheck}>✓</span>
                    ) : (
                      <div className={styles.milestoneProgress}>
                        <div className={styles.milestoneBarTrack}>
                          <div
                            className={styles.milestoneBarFill}
                            style={{ width: `${(m.progress / m.target) * 100}%` }}
                          />
                        </div>
                        <span className={styles.milestoneCount}>{m.progress}/{m.target}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className={styles.colRight}>

          {/* Currently studying */}
          <div className={styles.studyingCard}>
            <div className={styles.studyingGlow} />
            <p className={styles.studyingLabel}>Currently Studying</p>
            <div className={styles.studyingMain}>
              <img
                className={styles.studyingFlag}
                src={`https://flagcdn.com/48x36/${user?.language === 'french' ? 'fr' : 'es'}.png`}
                alt={lang}
              />
              <div>
                <p className={styles.studyingLang}>{lang}</p>
                <p className={styles.studyingStats}>3 lessons · 15 words</p>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Lessons</h2>
            <div className={styles.recentList}>
              {RECENT_LESSONS.map((lesson, i) => (
                <div key={i} className={styles.recentItem}>
                  <div className={styles.recentLeft}>
                    <div className={`${styles.recentDot} ${lesson.perfect ? styles.recentPerfect : ''}`}>
                      {lesson.perfect ? '★' : '•'}
                    </div>
                    <div>
                      <p className={styles.recentTitle}>{lesson.title}</p>
                      <p className={styles.recentDate}>{lesson.date}</p>
                    </div>
                  </div>
                  <span className={`${styles.recentScore} ${lesson.perfect ? styles.recentScorePerfect : ''}`}>
                    {lesson.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}