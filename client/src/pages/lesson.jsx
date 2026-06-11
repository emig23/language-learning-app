import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/lesson.module.css';

import spanishWords from '../data/spanish.json';
import frenchWords from '../data/french.json';

// Strip punctuation AND accent marks for lenient comparison
function normalize(str) {
  return str.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,!?;:'"¿¡\-()]/g, '')
    .replace(/\s+/g, ' ');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build 8-12 mixed exercises from sentences + vocab
function buildExercises(sentences, words) {
  const exercises = [];

  // Each sentence gets TWO exercises (translate + fill-in-blank)
  sentences.forEach(s => {
    // Translate
    exercises.push({
      type: 'translate',
      sentence: s.sentence,
      answer: s.translation,
    });

    // Fill in the blank
    const sentenceWords = s.sentence.replace(/[.,!?¿¡]/g, '').split(' ').filter(w => w.length > 2);
    if (sentenceWords.length > 0) {
      const blankWord = sentenceWords[Math.floor(Math.random() * sentenceWords.length)];
      const blanked = s.sentence.replace(blankWord, '____');
      exercises.push({
        type: 'fillBlank',
        display: blanked,
        hint: s.translation,
        answer: blankWord,
      });
    }
  });

  // Add 2-3 match rounds spread throughout
  const matchCount = words.length >= 4 ? Math.min(3, Math.max(2, Math.floor(exercises.length / 4))) : 0;
  for (let m = 0; m < matchCount; m++) {
    const picked = shuffle(words).slice(0, 4);
    const insertAt = Math.floor((exercises.length / (matchCount + 1)) * (m + 1));
    exercises.splice(insertAt, 0, {
      type: 'match',
      pairs: picked.map(w => ({ term: w.term, translation: w.translation })),
    });
  }

  return exercises;
}

// ─── Translate Exercise ───
function TranslateExercise({ exercise, onComplete }) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleCheck = () => {
    if (!input.trim()) return;
    const correct = normalize(input) === normalize(exercise.answer);
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) onComplete(true, false);
  };

  const handleNext = () => {
    if (feedback === 'incorrect') onComplete(false, false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (feedback === null && input.trim()) handleCheck();
      else if (feedback !== null) handleNext();
    }
  };

  return (
    <>
      <div className={styles.card}>
        <span className={styles.cardBadge}>Translate</span>
        <h2 className={styles.sentence}>{exercise.sentence}</h2>
        <p className={styles.hint}>Write the English translation</p>
      </div>
      <div className={styles.inputArea}>
        <textarea
          className={`${styles.input} ${feedback === 'correct' ? styles.inputCorrect : ''} ${feedback === 'incorrect' ? styles.inputIncorrect : ''}`}
          placeholder="Type your answer..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={feedback !== null}
          rows={2}
          autoFocus
        />
        {feedback && (
          <FeedbackBox feedback={feedback} answer={exercise.answer} />
        )}
        {feedback === null ? (
          <button className={styles.btnPrimary} onClick={handleCheck} disabled={!input.trim()}>Check Answer</button>
        ) : feedback === 'correct' ? (
          <button className={styles.btnPrimary} onClick={() => onComplete(true, true)}>Continue →</button>
        ) : (
          <button className={styles.btnPrimary} onClick={handleNext}>Continue →</button>
        )}
      </div>
    </>
  );
}

// ─── Fill in the Blank ───
function FillBlankExercise({ exercise, onComplete }) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleCheck = () => {
    if (!input.trim()) return;
    const correct = normalize(input) === normalize(exercise.answer);
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) onComplete(true, false);
  };

  const handleNext = () => {
    if (feedback === 'incorrect') onComplete(false, false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (feedback === null && input.trim()) handleCheck();
      else if (feedback !== null) handleNext();
    }
  };

  return (
    <>
      <div className={styles.card}>
        <span className={styles.cardBadgeFill}>Fill in the blank</span>
        <h2 className={styles.sentence}>{exercise.display}</h2>
        <p className={styles.hint}>English: {exercise.hint}</p>
      </div>
      <div className={styles.inputArea}>
        <input
          className={`${styles.inputSingle} ${feedback === 'correct' ? styles.inputCorrect : ''} ${feedback === 'incorrect' ? styles.inputIncorrect : ''}`}
          placeholder="Type the missing word..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={feedback !== null}
          autoFocus
        />
        {feedback && (
          <FeedbackBox feedback={feedback} answer={exercise.answer} />
        )}
        {feedback === null ? (
          <button className={styles.btnPrimary} onClick={handleCheck} disabled={!input.trim()}>Check Answer</button>
        ) : feedback === 'correct' ? (
          <button className={styles.btnPrimary} onClick={() => onComplete(true, true)}>Continue →</button>
        ) : (
          <button className={styles.btnPrimary} onClick={handleNext}>Continue →</button>
        )}
      </div>
    </>
  );
}

// ─── Match Exercise ───
function MatchExercise({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);

  const shuffledTranslations = useMemo(
    () => shuffle(exercise.pairs.map((p, i) => ({ ...p, originalIndex: i }))),
    [exercise]
  );

  const handleSelect = (side, index, originalIndex) => {
    if (matched.includes(side === 'term' ? index : originalIndex)) return;

    if (selected === null) {
      setSelected({ side, index, originalIndex });
      setWrong(null);
    } else if (selected.side === side) {
      setSelected({ side, index, originalIndex });
      setWrong(null);
    } else {
      const termIdx = side === 'term' ? index : selected.originalIndex;
      const transIdx = side === 'trans' ? originalIndex : selected.originalIndex;

      if (termIdx === transIdx) {
        const newMatched = [...matched, termIdx];
        setMatched(newMatched);
        setSelected(null);
        setWrong(null);
        if (newMatched.length === exercise.pairs.length) {
          setTimeout(() => onComplete(true, true), 500);
        }
      } else {
        setWrong({ termIdx, transIdx });
        setTimeout(() => { setWrong(null); setSelected(null); }, 800);
      }
    }
  };

  return (
    <>
      <div className={styles.card}>
        <span className={styles.cardBadgeMatch}>Match the pairs</span>
        <p className={styles.hint}>Tap a word, then tap its translation</p>
      </div>
      <div className={styles.matchGrid}>
        <div className={styles.matchCol}>
          {exercise.pairs.map((p, i) => (
            <button
              key={`t-${i}`}
              className={`${styles.matchTile}
                ${matched.includes(i) ? styles.matchDone : ''}
                ${selected?.side === 'term' && selected?.index === i ? styles.matchSelected : ''}
                ${wrong?.termIdx === i ? styles.matchWrong : ''}`}
              onClick={() => handleSelect('term', i, i)}
              disabled={matched.includes(i)}
            >
              {p.term}
            </button>
          ))}
        </div>
        <div className={styles.matchCol}>
          {shuffledTranslations.map((p, i) => (
            <button
              key={`tr-${i}`}
              className={`${styles.matchTile}
                ${matched.includes(p.originalIndex) ? styles.matchDone : ''}
                ${selected?.side === 'trans' && selected?.index === i ? styles.matchSelected : ''}
                ${wrong?.transIdx === p.originalIndex ? styles.matchWrong : ''}`}
              onClick={() => handleSelect('trans', i, p.originalIndex)}
              disabled={matched.includes(p.originalIndex)}
            >
              {p.translation}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Shared Feedback Box ───
function FeedbackBox({ feedback, answer }) {
  return (
    <div className={`${styles.feedback} ${styles[feedback]}`}>
      {feedback === 'correct' ? (
        <div className={styles.feedbackRow}>
          <span className={styles.feedbackIcon}>✓</span>
          <span>Correct!</span>
        </div>
      ) : (
        <div>
          <div className={styles.feedbackRow}>
            <span className={styles.feedbackIcon}>✗</span>
            <span>Not quite</span>
          </div>
          <p className={styles.answer}>{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Lesson Component ───
export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const sentences = location.state?.sentences || [];
  const words = user?.language === 'french' ? frenchWords : spanishWords;

  const exercises = useMemo(() => buildExercises(sentences, words), [sentences, words]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = exercises[index];
  const progress = exercises.length > 0 ? ((index) / exercises.length) * 100 : 0;

  const handleExerciseComplete = (correct, advance) => {
    if (correct) setScore(s => s + 1);
    if (advance || !correct) {
      if (index + 1 >= exercises.length) {
        setDone(true);
      } else {
        setIndex(i => i + 1);
      }
    }
  };

  // No data
  if (exercises.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.results}>
          <div className={styles.resultsCard}>
            <div className={styles.resultsIcon}>📭</div>
            <h1 className={styles.resultsTitle}>No lesson data</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Go back to the dashboard and pick a lesson.
            </p>
            <button className={styles.btnPrimary} onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results
  if (done) {
    const percent = Math.round((score / exercises.length) * 100);
    return (
      <div className={styles.page}>
        <div className={styles.results}>
          <div className={styles.resultsCard}>
            <div className={styles.resultsIcon}>🎉</div>
            <h1 className={styles.resultsTitle}>Lesson Complete!</h1>
            <div className={styles.scoreRow}>
              <div className={styles.scoreStat}>
                <p className={styles.scoreNum}>{score}/{exercises.length}</p>
                <p className={styles.scoreLabel}>Correct</p>
              </div>
              <div className={styles.scoreDivider} />
              <div className={styles.scoreStat}>
                <p className={styles.scoreNum}>{percent}%</p>
                <p className={styles.scoreLabel}>Accuracy</p>
              </div>
              <div className={styles.scoreDivider} />
              <div className={styles.scoreStat}>
                <p className={styles.scoreNum}>+{score * 10}</p>
                <p className={styles.scoreLabel}>Points</p>
              </div>
            </div>
            <div className={styles.resultsActions}>
              <button className={styles.btnPrimary} onClick={() => { setDone(false); setIndex(0); setScore(0); }}>
                Retry Lesson
              </button>
              <button className={styles.btnSecondary} onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>← Exit</button>
        <div className={styles.progressArea}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.counter}>{index + 1} of {exercises.length}</span>
        </div>
        <div className={styles.scorePill}>★ {score}</div>
      </header>

      <div className={styles.lessonArea} key={index}>
        {current.type === 'translate' && (
          <TranslateExercise exercise={current} onComplete={handleExerciseComplete} />
        )}
        {current.type === 'fillBlank' && (
          <FillBlankExercise exercise={current} onComplete={handleExerciseComplete} />
        )}
        {current.type === 'match' && (
          <MatchExercise exercise={current} onComplete={handleExerciseComplete} />
        )}
      </div>

      <p className={styles.shortcut}>Press <kbd>Enter</kbd> to submit</p>
    </div>
  );
}