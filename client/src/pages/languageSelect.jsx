import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/languageSelect.module.css';

const LANGUAGES = [
  { code: 'spanish', label: 'Spanish', flag: '🇪🇸', description: 'Spoken by 500M+ people worldwide' },
  { code: 'french',  label: 'French',  flag: '🇫🇷', description: 'The language of art, cuisine & diplomacy' },
];

export default function LanguageSelect() {
  const { setLanguage, user } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (code) => {
    setLanguage(code);
    navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Welcome, {user?.name}!</h1>
        <p>Which language do you want to learn?</p>
      </div>
      <div className={styles.grid}>
        {LANGUAGES.map(lang => (
          <button key={lang.code} className={styles.card} onClick={() => handleSelect(lang.code)}>
            <span className={styles.flag}>{lang.flag}</span>
            <h2>{lang.label}</h2>
            <p>{lang.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}