import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { MatchItem } from './matchingTable.types';
import PageWrapper from 'components/shared/layouts/pageWrapper';
import MatchingTableStudent from './MatchStudent';
import styles from './StudentPage.scss';


interface LocationState {
  items: MatchItem[];
}

const MatchingTableStudentPage: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const [matchItems, setMatchItems] = useState<MatchItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  useEffect(() => {
    // Check if items exist in location state
    if (location.state && location.state.items) {
      setMatchItems(location.state.items);
      setScore({ correct: 0, total: location.state.items.length });
    } else {
      // Redirect if no items were provided
      history.push('/matching/instructor');
    }
  }, [location, history]);

  const handleAnswerChange = (id: string, answer: string) => {
    if (submitted) return;
    
    const updatedItems = matchItems.map(item => 
      item.id === id ? { ...item, studentAnswer: answer } : item
    );
    setMatchItems(updatedItems);
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const unanswered = matchItems.filter(item => !item.studentAnswer);
    if (unanswered.length > 0) {
      alert(`Please answer all questions before submitting. You have ${unanswered.length} unanswered questions.`);
      return;
    }
    
    // Calculate score
    const correctAnswers = matchItems.filter(item => item.studentAnswer === item.correctAnswer);
    setScore({
      correct: correctAnswers.length,
      total: matchItems.length
    });
    
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    // Reset student answers and submission state
    const resetItems = matchItems.map(item => ({ ...item, studentAnswer: '' }));
    setMatchItems(resetItems);
    setSubmitted(false);
  };

  return (
    <PageWrapper>
      <div className={styles['matching-table-student-wrapper']}>
        <h2 className={styles['section-title']}>Match Pairs</h2>
        
        <div className={styles['"instructions']}>
          <p>Match each item on the left with the correct option on the right.</p>
          <p>You can select by pressing the number keys or clicking directly on the items.</p>
        </div>
        
        <MatchingTableStudent 
          items={matchItems}
          onAnswerChange={handleAnswerChange}
          readOnly={submitted}
        />

        {!submitted ? (
          <button className={styles['submit-btn']} onClick={handleSubmit}>
            Submit Answers
          </button>
        ) : (
          <>
            <div className={styles['score-feedback']}>
              You scored <span className={styles['score']}>{score.correct}</span> out of <span className={styles['total']}>{score.total}</span>
              {score.correct === score.total && (
                <div>Perfect score! 🎉</div>
              )}
            </div>
            <div className={styles['try-again-btn']}>
              <button onClick={handleTryAgain}>Try Again</button>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default MatchingTableStudentPage;