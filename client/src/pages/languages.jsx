import { useAuth } from '../context/authContext';
import styles from '../styles/languages.module.css';

const LANGUAGES = [
  { code: 'spanish', label: 'Spanish', flag: '🇪🇸', available: true,  description: 'Spoken by 500M+ people worldwide' },
  { code: 'french',  label: 'French',  flag: '🇫🇷', available: true,  description: 'The language of art, cuisine & diplomacy' },
  { code: 'italian', label: 'Italian', flag: '🇮🇹', available: false, description: 'Coming soon' },
  { code: 'german',  label: 'German',  flag: '🇩🇪', available: false, description: 'Coming soon' },
];

export default function Languages() {
  const { user, setLanguage } = useAuth();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Languages</h1>
      <p className={styles.subtitle}>Switch or add a language to study</p>

      <div className={styles.list}>
        {LANGUAGES.map(lang => (
          <div
            key={lang.code}
            className={`${styles.card} ${!lang.available ? styles.unavailable : ''} ${user?.language === lang.code ? styles.active : ''}`}
          >
            <span className={styles.flag}>{lang.flag}</span>
            <div className={styles.info}>
              <p className={styles.langName}>{lang.label}</p>
              <p className={styles.langDesc}>{lang.description}</p>
            </div>
            {lang.available ? (
              user?.language === lang.code ? (
                <span className={styles.activeBadge}>Active</span>
              ) : (
                <button className={styles.switchBtn} onClick={() => setLanguage(lang.code)}>
                  Switch
                </button>
              )
            ) : (
              <span className={styles.soonBadge}>Soon</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
