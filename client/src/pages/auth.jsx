import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/auth.module.css';

const FEATURES = [
  { icon: '🧠', text: 'Learn through real sentence translation' },
  { icon: '📊', text: 'Track streaks, milestones & progress' },
  { icon: '🌍', text: 'Spanish, French & more coming soon' },
  { icon: '⚡', text: 'Bite-sized lessons that fit your day' },
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        const user = await login(form.email, form.password);
        navigate(user.language ? '/dashboard' : '/select-language');
      } else {
        await register(form.email, form.password, form.name);
        navigate('/select-language');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      {/* Left panel — branding */}
      <div className={styles.leftPanel}>
        <div className={styles.leftGlow} />
        <div className={styles.leftContent}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>𝕍</span>
            <span className={styles.brandName}>Voca</span>
          </div>
          <h2 className={styles.leftTitle}>
            Start speaking a<br />
            new language <span className={styles.leftAccent}>today</span>
          </h2>
          <p className={styles.leftSub}>
            Start building real skills, one sentence at a time.
          </p>
          <div className={styles.featureList}>
            {FEATURES.map(f => (
              <div key={f.text} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
          <div className={styles.leftFlags}>
            <img src="https://flagcdn.com/32x24/es.png" alt="Spanish" className={styles.leftFlag} />
            <img src="https://flagcdn.com/32x24/fr.png" alt="French" className={styles.leftFlag} />
            <img src="https://flagcdn.com/32x24/it.png" alt="Italian" className={styles.leftFlag} style={{ opacity: 0.4 }} />
            <img src="https://flagcdn.com/32x24/de.png" alt="German" className={styles.leftFlag} style={{ opacity: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>

          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>
              {tab === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className={styles.formSubtitle}>
              {tab === 'login'
                ? 'Log in to continue your learning journey'
                : 'Start learning a new language for free'}
            </p>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.activeTab : ''}`}
              onClick={() => setTab('login')}
            >Log in</button>
            <button
              className={`${styles.tab} ${tab === 'register' ? styles.activeTab : ''}`}
              onClick={() => setTab('register')}
            >Sign up</button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className={styles.field}>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="What should we call you?"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className={styles.error}>
                <span>⚠</span> {error}
              </div>
            )}

            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? 'Loading...' : tab === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchText}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className={styles.switchLink}
              onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            >
              {tab === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </div>
      </div>

    </div>
  );
}