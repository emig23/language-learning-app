import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/lesson.module.css';

// TODO: fetch real sentences from your backend by lesson id
const MOCK_SENTENCES = [
  { id: 1, sentence: 'El perro bebe agua.',          translation: 'The dog drinks water.',         difficulty: 'beginner' },
  { id: 2, sentence: 'La niña come comida buena.',   translation: 'The girl eats good food.',      difficulty: 'beginner' },
  { id: 3, sentence: 'El gato es pequeño.',          translation: 'The cat is small.',             difficulty: 'beginner' },
  { id: 4, sentence: 'La mujer va a la escuela.',    translation: 'The woman goes to school.',     difficulty: 'beginner' },
  { id: 5, sentence: 'El hombre tiene un libro.',    translation: 'The man has a book.',           difficulty: 'beginner' },
];

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = MOCK_SENTENCES[index];
  const progress = ((index) / MOCK_SENTENCES.length) * 100;

  const handleCheck = () => {
    if (!input.trim()) return;
    const correct = input.trim().toLowerCase() === current.translation.toLowerCase();
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= MOCK_SENTENCES.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setInput('');
      setFeedback(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (feedback === null && input.trim()) {
        handleCheck();
      } else if (feedback !== null) {
        handleNext();
      }
    }
  };

  if (done) {
    const percent = Math.round((score / MOCK_SENTENCES.length) * 100);
    return (
      <div className={styles.page}>
        <div className={styles.results}>
          <div className={styles.resultsCard}>
            <div className={styles.resultsIcon}>🎉</div>
            <h1 className={styles.resultsTitle}>Lesson Complete!</h1>
            <div className={styles.scoreRow}>
              <div className={styles.scoreStat}>
                <p className={styles.scoreNum}>{score}/{MOCK_SENTENCES.length}</p>
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
              <button className={styles.btnPrimary} onClick={() => { setDone(false); setIndex(0); setInput(''); setFeedback(null); setScore(0); }}>
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

      {/* Top bar */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>← Exit</button>
        <div className={styles.progressArea}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.counter}>{index + 1} of {MOCK_SENTENCES.length}</span>
        </div>
        <div className={styles.scorePill}>★ {score}</div>
      </header>

      {/* Centered lesson area */}
      <div className={styles.lessonArea}>

        <div className={styles.card}>
          <span className={styles.cardBadge}>Translate</span>
          <h2 className={styles.sentence}>{current.sentence}</h2>
          <p className={styles.hint}>Write the English translation below</p>
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
                  <p className={styles.answer}>{current.translation}</p>
                </div>
              )}
            </div>
          )}

          {feedback === null ? (
            <button className={styles.btnPrimary} onClick={handleCheck} disabled={!input.trim()}>
              Check Answer
            </button>
          ) : (
            <button className={styles.btnPrimary} onClick={handleNext}>
              {index + 1 >= MOCK_SENTENCES.length ? 'See Results' : 'Continue →'}
            </button>
          )}

          <p className={styles.shortcut}>Press <kbd>Enter</kbd> to submit</p>
        </div>

      </div>
    </div>
  );
}