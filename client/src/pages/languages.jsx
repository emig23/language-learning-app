import { useAuth } from '../context/authContext';
import styles from '../styles/languages.module.css';

const LANGUAGES = [
  {
    code: 'spanish',
    label: 'Spanish',
    native: 'Español',
    flag: 'es',
    available: true,
    description: 'Spoken by 500M+ people worldwide',
    learners: '30M+',
    lessons: 24,
    color: '#e8547a',
  },
  {
    code: 'french',
    label: 'French',
    native: 'Français',
    flag: 'fr',
    available: true,
    description: 'The language of art, cuisine & diplomacy',
    learners: '20M+',
    lessons: 20,
    color: '#c45ecf',
  },
  {
    code: 'italian',
    label: 'Italian',
    native: 'Italiano',
    flag: 'it',
    available: false,
    description: 'The language of music, food & history',
    color: '#3ecfcf',
  },
  {
    code: 'german',
    label: 'German',
    native: 'Deutsch',
    flag: 'de',
    available: false,
    description: 'The language of engineering & philosophy',
    color: '#e8824a',
  },
];

export default function Languages() {
  const { user, setLanguage } = useAuth();

  const active = LANGUAGES.find(l => l.code === user?.language);
  const others = LANGUAGES.filter(l => l.code !== user?.language);

  return (
    <div className={styles.page}>

      <header className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Languages</h1>
          <p className={styles.pageSubtitle}>Manage your courses and explore new ones</p>
        </div>
      </header>

      {/* Active language */}
      {active && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Currently Learning</h2>
          <div className={styles.activeCard} style={{ '--lang-color': active.color }}>
            <div className={styles.activeGlow} />
            <div className={styles.activeContent}>
              <div className={styles.activeLeft}>
                <img
                  className={styles.activeFlag}
                  src={`https://flagcdn.com/64x48/${active.flag}.png`}
                  alt={active.label}
                />
                <div>
                  <h3 className={styles.activeLang}>{active.label}</h3>
                  <p className={styles.activeNative}>{active.native}</p>
                  <p className={styles.activeDesc}>{active.description}</p>
                </div>
              </div>
              <div className={styles.activeStats}>
                <div className={styles.activeStat}>
                  <p className={styles.activeStatValue}>{active.lessons}</p>
                  <p className={styles.activeStatLabel}>Lessons</p>
                </div>
                <div className={styles.activeStatDivider} />
                <div className={styles.activeStat}>
                  <p className={styles.activeStatValue}>{active.learners}</p>
                  <p className={styles.activeStatLabel}>Learners</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other languages */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All Languages</h2>
        <div className={styles.langGrid}>
          {others.map(lang => (
            <div
              key={lang.code}
              className={`${styles.langCard} ${!lang.available ? styles.unavailable : ''}`}
              style={{ '--lang-color': lang.color }}
            >
              <div className={styles.langCardTop}>
                <img
                  className={styles.langFlag}
                  src={`https://flagcdn.com/48x36/${lang.flag}.png`}
                  alt={lang.label}
                />
                {!lang.available && <span className={styles.soonTag}>Coming Soon</span>}
              </div>
              <div className={styles.langCardBody}>
                <h3 className={styles.langName}>{lang.label}</h3>
                <p className={styles.langNative}>{lang.native}</p>
                <p className={styles.langDesc}>{lang.description}</p>
              </div>
              <div className={styles.langCardBottom}>
                {lang.available ? (
                  <>
                    <div className={styles.langMeta}>
                      <span className={styles.langMetaItem}>📚 {lang.lessons} lessons</span>
                      <span className={styles.langMetaItem}>👥 {lang.learners}</span>
                    </div>
                    <button
                      className={styles.switchBtn}
                      onClick={() => setLanguage(lang.code)}
                    >
                      Switch to {lang.label}
                    </button>
                  </>
                ) : (
                  <div className={styles.langComingSoon}>
                    <div className={styles.comingBar} />
                    <p className={styles.comingText}>We're working on it — stay tuned!</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}