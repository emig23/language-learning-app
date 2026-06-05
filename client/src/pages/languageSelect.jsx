import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/languageSelect.module.css';

const LANGUAGES = [
  {
    code: 'spanish',
    label: 'Spanish',
    flag: 'es',
    native: 'Español',
    description: 'Spoken by 500M+ people worldwide',
    learners: '30M+ learners',
    difficulty: 'Beginner friendly',
    color: '#e8547a',
    facts: ['2nd most spoken language', 'Official in 21 countries', 'Easy grammar for English speakers'],
  },
  {
    code: 'french',
    label: 'French',
    flag: 'fr',
    native: 'Français',
    description: 'The language of art, cuisine & diplomacy',
    learners: '20M+ learners',
    difficulty: 'Moderate',
    color: '#c45ecf',
    facts: ['Spoken on 5 continents', 'Official UN language', 'Gateway to European culture'],
  },
];

export default function LanguageSelect() {
  const { setLanguage, user } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleSelect = (code) => {
    setLanguage(code);
    navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />

      <nav className={styles.nav}>
        <span className={styles.navLogo}>𝕃 Lingua</span>
      </nav>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.welcomeBadge}>👋 Welcome aboard</div>
          <h1 className={styles.title}>
            Hey {user?.name}, what do<br />
            you want to <span className={styles.accent}>learn?</span>
          </h1>
          <p className={styles.subtitle}>
            Choose your first language. You can add more later.
          </p>
        </div>

        <div className={styles.grid}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className={`${styles.card} ${hovered === lang.code ? styles.cardHovered : ''}`}
              onClick={() => handleSelect(lang.code)}
              onMouseEnter={() => setHovered(lang.code)}
              onMouseLeave={() => setHovered(null)}
              style={{ '--card-color': lang.color }}
            >
              <div className={styles.cardGlow} />

              <div className={styles.cardTop}>
                <img
                  className={styles.flag}
                  src={`https://flagcdn.com/64x48/${lang.flag}.png`}
                  alt={lang.label}
                />
                <div className={styles.diffBadge}>{lang.difficulty}</div>
              </div>

              <div className={styles.cardMid}>
                <h2 className={styles.langLabel}>{lang.label}</h2>
                <p className={styles.langNative}>{lang.native}</p>
                <p className={styles.langDesc}>{lang.description}</p>
              </div>

              <div className={styles.cardStats}>
                <span className={styles.stat}>👥 {lang.learners}</span>
              </div>

              <ul className={styles.facts}>
                {lang.facts.map(f => (
                  <li key={f} className={styles.fact}>
                    <span className={styles.factDot} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className={styles.cardCta}>
                Start learning {lang.label} →
              </div>
            </button>
          ))}
        </div>

        <p className={styles.hint}>More languages coming soon — Italian, German & more.</p>
      </div>
    </div>
  );
}