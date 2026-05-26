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
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = MOCK_SENTENCES[index];

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

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.results}>
          <div className={styles.resultsIcon}>🎉</div>
          <h1>Lesson Complete!</h1>
          <p className={styles.scoreText}>{score} / {MOCK_SENTENCES.length} correct</p>
          <button className={styles.btn} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>←</button>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((index) / MOCK_SENTENCES.length) * 100}%` }}
          />
        </div>
        <span className={styles.counter}>{index + 1}/{MOCK_SENTENCES.length}</span>
      </header>

      <div className={styles.card}>
        <p className={styles.prompt}>Translate this sentence:</p>
        <h2 className={styles.sentence}>{current.sentence}</h2>
      </div>

      <div className={styles.inputArea}>
        <textarea
          className={styles.input}
          placeholder="Type the English translation..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={feedback !== null}
          rows={3}
        />

        {feedback && (
          <div className={`${styles.feedback} ${styles[feedback]}`}>
            {feedback === 'correct' ? (
              <p>✓ Correct!</p>
            ) : (
              <>
                <p>✗ Not quite.</p>
                <p className={styles.answer}>Answer: <strong>{current.translation}</strong></p>
              </>
            )}
          </div>
        )}

        {feedback === null ? (
          <button className={styles.btn} onClick={handleCheck} disabled={!input.trim()}>
            Check
          </button>
        ) : (
          <button className={styles.btn} onClick={handleNext}>
            {index + 1 >= MOCK_SENTENCES.length ? 'Finish' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
}