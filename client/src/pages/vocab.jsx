import { useState, useMemo } from 'react';
import { useAuth } from '../context/authContext';
import styles from '../styles/vocab.module.css';

import spanishWords from '../data/spanish.json';
import frenchWords from '../data/french.json';

const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced'];

export default function Vocab() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const allWords = user?.language === 'french' ? frenchWords : spanishWords;

  const filtered = useMemo(() => {
    let words = allWords;
    if (filter !== 'all') {
      words = words.filter(w => w.difficulty === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      words = words.filter(w =>
        w.term.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q)
      );
    }
    return words;
  }, [allWords, filter, search]);

  const counts = useMemo(() => {
    const c = { all: allWords.length, beginner: 0, intermediate: 0, advanced: 0 };
    allWords.forEach(w => { if (c[w.difficulty] !== undefined) c[w.difficulty]++; });
    return c;
  }, [allWords]);

  const lang = user?.language
    ? user.language.charAt(0).toUpperCase() + user.language.slice(1)
    : 'Language';

  return (
    <div className={styles.page}>

      <header className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Vocabulary</h1>
          <p className={styles.pageSubtitle}>{allWords.length} words in {lang}</p>
        </div>
      </header>

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          {['all', ...DIFFICULTY_ORDER].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={styles.filterCount}>{counts[f]}</span>
            </button>
          ))}
        </div>
        <input
          className={styles.search}
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Word list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No words found matching your search.</p>
        </div>
      ) : (
        <div className={styles.wordGrid}>
          {filtered.map((word, i) => (
            <div key={i} className={styles.wordCard}>
              <div className={styles.wordTop}>
                <h3 className={styles.term}>{word.term}</h3>
                <span className={`${styles.diffBadge} ${styles[word.difficulty]}`}>
                  {word.difficulty}
                </span>
              </div>
              <p className={styles.translation}>{word.translation}</p>
              <div className={styles.wordMeta}>
                <span className={styles.pos}>{word.partOfSpeech}</span>
                {word.gender && <span className={styles.gender}>{word.gender}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}