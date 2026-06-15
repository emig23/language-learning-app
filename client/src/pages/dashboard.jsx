import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/dashboard.module.css';

import spanishSentences from '../data/spanishSentences.json';
import frenchSentences from '../data/frenchSentences.json';

const DIFFICULTY_COLOR = {
  beginner:     'var(--accent-teal)',
  intermediate: 'var(--accent-orange)',
  advanced:     'var(--accent-secondary)',
};

const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced'];

function buildLessons(sentences, completedMap) {
  const grouped = {};
  sentences.forEach(s => {
    if (!grouped[s.difficulty]) grouped[s.difficulty] = [];
    grouped[s.difficulty].push(s);
  });

  const lessons = [];
  let id = 1;

  DIFFICULTY_ORDER.forEach(diff => {
    const pool = grouped[diff] || [];
    for (let i = 0; i < pool.length; i += 5) {
      const chunk = pool.slice(i, i + 5);
      if (chunk.length === 0) continue;
      const lessonNum = Math.floor(i / 5) + 1;
      const lessonId = String(id++);
      const completed = completedMap[lessonId];
      lessons.push({
        id: lessonId,
        title: `${diff.charAt(0).toUpperCase() + diff.slice(1)} - Lesson ${lessonNum}`,
        difficulty: diff,
        sentences: chunk,
        sentenceCount: chunk.length,
        progress: completed ? 100 : 0,
        locked: false,
      });
    }
  });

  const beginnerDone = lessons.filter(l => l.difficulty === 'beginner').every(l => l.progress === 100);
  const intermediateDone = lessons.filter(l => l.difficulty === 'intermediate').every(l => l.progress === 100);

  lessons.forEach(l => {
    if (l.difficulty === 'intermediate' && !beginnerDone) l.locked = true;
    if (l.difficulty === 'advanced' && !intermediateDone) l.locked = true;
  });

  return lessons;
}

function ProgressCircle({ percent, size = 52, stroke = 5, color = 'white' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const center = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={center} cy={center} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
      <circle cx={center} cy={center} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`} />
      <text x={center} y={center + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{percent}%</text>
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
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [completedMap, setCompletedMap] = useState({});
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!token || !user?.language) return;

    fetch(`/progress?language=${user.language}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCompletedMap(data.completedLessons || {}))
      .catch(err => console.error('Failed to load progress:', err));

    fetch('/progress/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err));
  }, [token, user?.language]);

  const sentences = user?.language === 'french' ? frenchSentences : spanishSentences;
  const lessons = useMemo(() => buildLessons(sentences, completedMap), [sentences, completedMap]);

  const completedLessons = lessons.filter(l => l.progress === 100).length;
  const inProgress = lessons.filter(l => l.progress > 0 && l.progress < 100).length;
  const totalPoints = stats?.totalPoints || 0;
  const streak = stats?.streak || 0;
  const lang = user?.language
    ? user.language.charAt(0).toUpperCase() + user.language.slice(1)
    : 'a language';

  const weeklyActivity = stats?.weeklyActivity || [
    { day: 'Mon', active: false, count: 0 },
    { day: 'Tue', active: false, count: 0 },
    { day: 'Wed', active: false, count: 0 },
    { day: 'Thu', active: false, count: 0 },
    { day: 'Fri', active: false, count: 0 },
    { day: 'Sat', active: false, count: 0 },
    { day: 'Sun', active: false, count: 0 },
  ];
  const maxCount = Math.max(1, ...weeklyActivity.map(d => d.count));
  const weekTotal = weeklyActivity.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className={styles.page}>

      <header className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back, {user?.name}. Keep it up!</p>
        </div>
        <div className={styles.streakPill}>
          <span>🔥</span>
          <span>{streak} day streak</span>
        </div>
      </header>

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

      <div className={styles.columns}>
        <div className={styles.colLeft}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Lessons</h2>
          </div>
          <div className={styles.lessonList}>
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                className={`${styles.lessonCard} ${lesson.locked ? styles.locked : ''}`}
                onClick={() => !lesson.locked && navigate(`/lesson/${lesson.id}`, { state: { sentences: lesson.sentences } })}
                disabled={lesson.locked}
              >
                <div className={styles.lessonIndex}>
                  {lesson.locked ? '🔒' : lesson.progress === 100 ? '✓' : i + 1}
                </div>
                <div className={styles.lessonBody}>
                  <div className={styles.lessonMeta}>
                    <p className={styles.lessonTitle}>{lesson.title}</p>
                    <div className={styles.lessonTags}>
                      <span className={styles.diffTag} style={{ color: DIFFICULTY_COLOR[lesson.difficulty], borderColor: DIFFICULTY_COLOR[lesson.difficulty] }}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  {!lesson.locked && <ProgressBar percent={lesson.progress} />}
                </div>
                <div className={styles.lessonAction}>
                  {lesson.locked ? (
                    <span className={styles.lockedLabel}>Locked</span>
                  ) : lesson.progress === 100 ? (
                    <span className={styles.doneBadge}>Done</span>
                  ) : (
                    <span className={styles.startBadge}>Start</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.colRight}>
          <div className={styles.courseCard}>
            <div className={styles.courseGlow} />
            <div className={styles.courseContent}>
              <div className={styles.courseInfo}>
                <p className={styles.courseLabel}>Current Course</p>
                <h3 className={styles.courseLang}>{lang}</h3>
                <p className={styles.courseStat}>{completedLessons}/{lessons.length} lessons completed</p>
              </div>
              <ProgressCircle percent={lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0} size={72} stroke={6} />
            </div>
          </div>

          <div className={styles.activityCard}>
            <div className={styles.activityHeader}>
              <h3 className={styles.activityTitle}>This Week</h3>
              <span className={styles.activityTotal}>
                {weekTotal} {weekTotal === 1 ? 'lesson' : 'lessons'}
              </span>
            </div>
            <div className={styles.activityGrid}>
              {weeklyActivity.map(d => (
                <div key={d.day} className={styles.activityDay}>
                  {d.active && <span className={styles.activityCount}>{d.count}</span>}
                  <div className={styles.activityBar} style={{
                    height: d.active ? `${Math.max(15, (d.count / maxCount) * 100)}%` : '6%',
                    background: d.active ? 'var(--accent-primary)' : 'var(--border)',
                  }} />
                  <span className={`${styles.activityLabel} ${d.active ? styles.activityLabelActive : ''}`}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <p className={styles.tipTitle}>Tip of the day</p>
              <p className={styles.tipText}>Try translating sentences out loud — it helps with pronunciation and recall.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}