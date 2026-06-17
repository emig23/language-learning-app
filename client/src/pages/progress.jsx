import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import styles from '../styles/progress.module.css';
const API_URL = import.meta.env.VITE_API_URL || '';

export default function Progress() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/progress/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [token]);

  const lang = user?.language
    ? user.language.charAt(0).toUpperCase() + user.language.slice(1)
    : 'None';

  if (loading) {
    return (
      <div className={styles.page}>
        <p style={{ color: 'var(--text-secondary)', padding: '40px' }}>Loading progress...</p>
      </div>
    );
  }

  const streak = stats?.streak || 0;
  const lessonsCompleted = stats?.lessonsCompleted || 0;
  const totalPoints = stats?.totalPoints || 0;
  const wordsLearned = stats?.wordsLearned || 0;
  const milestones = stats?.milestones || [];
  const recent = stats?.recent || [];
  const weeklyActivity = stats?.weeklyActivity || [];

  // Format date for recent lessons
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  return (
    <div className={styles.page}>

      <header className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Progress</h1>
          <p className={styles.pageSubtitle}>Track your learning journey</p>
        </div>
      </header>

      <div className={styles.overviewRow}>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>🔥</span>
          <div>
            <p className={styles.overviewValue}>{streak} days</p>
            <p className={styles.overviewLabel}>Current Streak</p>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>★</span>
          <div>
            <p className={styles.overviewValue}>{totalPoints}</p>
            <p className={styles.overviewLabel}>Total Points</p>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>📖</span>
          <div>
            <p className={styles.overviewValue}>{lessonsCompleted}</p>
            <p className={styles.overviewLabel}>Lessons Done</p>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.overviewIcon}>💬</span>
          <div>
            <p className={styles.overviewValue}>{wordsLearned}</p>
            <p className={styles.overviewLabel}>Words Learned</p>
          </div>
        </div>
      </div>

      <div className={styles.columns}>
        <div className={styles.colLeft}>

          {/* Weekly streak */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Weekly Streak</h2>
              <span className={styles.cardBadge}>{weeklyActivity.filter(d => d.active).length}/7 days</span>
            </div>
            <div className={styles.streakGrid}>
              {weeklyActivity.map(d => (
                <div key={d.day} className={styles.streakDay}>
                  <div className={`${styles.streakCircle} ${d.active ? styles.streakActive : ''}`}>
                    {d.active ? '✓' : ''}
                  </div>
                  <span className={`${styles.streakLabel} ${d.active ? styles.streakLabelActive : ''}`}>{d.day}</span>
                  {d.active && <span className={styles.streakMinutes}>{d.count} lesson{d.count !== 1 ? 's' : ''}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Milestones</h2>
              <span className={styles.cardBadge}>{milestones.filter(m => m.achieved).length}/{milestones.length} unlocked</span>
            </div>
            <div className={styles.milestoneList}>
              {milestones.map(m => (
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
                          <div className={styles.milestoneBarFill} style={{ width: `${(m.progress / m.target) * 100}%` }} />
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

        <div className={styles.colRight}>

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
                <p className={styles.studyingStats}>{lessonsCompleted} lessons · {wordsLearned} words</p>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Lessons</h2>
            <div className={styles.recentList}>
              {recent.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '12px 0' }}>No lessons completed yet. Start your first one!</p>
              ) : (
                recent.map((lesson, i) => (
                  <div key={i} className={styles.recentItem}>
                    <div className={styles.recentLeft}>
                      <div className={`${styles.recentDot} ${lesson.perfect ? styles.recentPerfect : ''}`}>
                        {lesson.perfect ? '★' : '•'}
                      </div>
                      <div>
                        <p className={styles.recentTitle}>Lesson {lesson.lessonId}</p>
                        <p className={styles.recentDate}>{formatDate(lesson.completedAt)}</p>
                      </div>
                    </div>
                    <span className={`${styles.recentScore} ${lesson.perfect ? styles.recentScorePerfect : ''}`}>
                      {lesson.score}/{lesson.totalQuestions}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}