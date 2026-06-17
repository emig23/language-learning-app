import { useNavigate } from 'react-router-dom';
import styles from '../styles/landing.module.css';

const FEATURES = [
  {
    icon: '🧠',
    title: 'Learn by doing',
    desc: 'Translate real sentences from day one. No boring vocab drills.',
  },
  {
    icon: '📈',
    title: 'Track your progress',
    desc: 'Streaks, milestones and stats to keep you moving forward.',
  },
  {
    icon: '🌍',
    title: 'Learn different languages',
    desc: 'Multiple languages to learn and expand your skills.',
  },
];

const LANGUAGES = [
  { flag: 'es', name: 'Spanish' },
  { flag: 'fr', name: 'French' },
  { flag: 'it', name: 'Italian', soon: true },
  { flag: 'de', name: 'German', soon: true },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>

      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navLogo}>𝕍</span>
          <span className={styles.navName}>Voca</span>
        </div>
        <div className={styles.navActions}>
          <button className={styles.navLogin} onClick={() => navigate('/auth?tab=login')}>
            Log in
          </button>
          <button className={styles.navSignup} onClick={() => navigate('/auth?tab=register')}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Learn. Practice. Speak.<br />
            <span className={styles.heroAccent}>Your language journey starts here</span>
          </h1>
          <p className={styles.heroSub}>
            Voca teaches multiple languages through real sentences,
            instant feedback and lessons tailored for you.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/auth?tab=register')}>
              Start for free
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate('/auth?tab=login')}>
              I have an account
            </button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.lessonPreview}>
            <p className={styles.previewLabel}>Translate this sentence</p>
            <p className={styles.previewSentence}>El gato es pequeño.</p>
            <div className={styles.previewInput}>The cat is small.</div>
            <div className={styles.previewFeedback}>✓ Correct!</div>
          </div>
          <div className={styles.floatingBadge} style={{ top: '10px', right: '-16px' }}>
            🔥 3 day streak
          </div>
          <div className={styles.floatingBadge} style={{ bottom: '24px', left: '-16px' }}>
            ✓ Lesson complete
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Diverse language selection</h2>
        <div className={styles.langGrid}>
          {LANGUAGES.map(l => (
            <div key={l.name} className={`${styles.langCard} ${l.soon ? styles.langSoon : ''}`}>
              <img
                className={styles.langFlag}
                src={`https://flagcdn.com/48x36/${l.flag}.png`}
                alt={l.name}
              />
              <span className={styles.langName}>{l.name}</span>
              {l.soon && <span className={styles.soonTag}>Soon</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Voca?</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.navLogo}>𝕍</span>
        <span className={styles.footerText}>© 2026 Voca. Built for learners.</span>
      </footer>

    </div>
  );
}