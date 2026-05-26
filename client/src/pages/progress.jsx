import { useAuth } from '../context/authContext';
import styles from '../styles/progress.module.css';

const MOCK_STREAK_DAYS = [true, true, true, false, false, false, false]; // last 7 days
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MILESTONES = [
  { label: 'First Lesson',     achieved: true,  icon: '🎯' },
  { label: '3 Day Streak',     achieved: true,  icon: '🔥' },
  { label: '10 Lessons Done',  achieved: false, icon: '📚' },
  { label: '7 Day Streak',     achieved: false, icon: '⚡' },
  { label: 'First 100 Words',  achieved: false, icon: '💬' },
];

export default function Progress() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Progress</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔥 Streak</h2>
        <div className={styles.streakCalendar}>
          {DAYS.map((day, i) => (
            <div key={day} className={styles.dayCol}>
              <div className={`${styles.dayDot} ${MOCK_STREAK_DAYS[i] ? styles.active : ''}`} />
              <span className={styles.dayLabel}>{day}</span>
            </div>
          ))}
        </div>
        <p className={styles.streakNote}>3 day streak — keep it going!</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🏅 Milestones</h2>
        <div className={styles.milestones}>
          {MILESTONES.map(m => (
            <div key={m.label} className={`${styles.milestone} ${m.achieved ? styles.achieved : ''}`}>
              <span className={styles.milestoneIcon}>{m.icon}</span>
              <span className={styles.milestoneLabel}>{m.label}</span>
              {m.achieved && <span className={styles.check}>✓</span>}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📖 Currently Studying</h2>
        <div className={styles.studyingCard}>
          <span className={styles.studyingFlag}>
            {user?.language === 'french' ? '🇫🇷' : '🇪🇸'}
          </span>
          <div>
            <p className={styles.studyingLang}>
              {user?.language ? user.language.charAt(0).toUpperCase() + user.language.slice(1) : 'None'}
            </p>
            <p className={styles.studyingStats}>3 lessons completed · 15 words learned</p>
          </div>
        </div>
      </section>
    </div>
  );
}
