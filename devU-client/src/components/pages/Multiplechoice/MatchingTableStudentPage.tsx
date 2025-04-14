import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { MatchItem } from './matchingTable.types';
import PageWrapper from 'components/shared/layouts/pageWrapper';
import './matchingTable.scss';

interface LocationState {
  items: MatchItem[];
}

const MatchingTableStudentPage: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const [matchItems, setMatchItems] = useState<MatchItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  
  useEffect(() => {
    // Check if items exist in location state
    if (location.state && location.state.items) {
      setMatchItems(location.state.items);
      // Extract and shuffle options
      const options = [...new Set(location.state.items.map(item => item.correctAnswer))];
      setAvailableOptions(options.sort(() => 0.5 - Math.random()));
      setScore({ correct: 0, total: location.state.items.length });
    } else {
      // Redirect if no items were provided
      history.push('/matching/instructor');
    }
  }, [location, history]);

  const handleSelectChange = (id: string, answer: string) => {
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

  const getStatusClass = (item: MatchItem): string => {
    if (!submitted || !item.studentAnswer) return '';
    return item.studentAnswer === item.correctAnswer ? 'correct' : 'incorrect';
  };

  return (
    <PageWrapper>
      <div className="matching-table-student-wrapper">
        <h2>Matching Exercise</h2>
        
        <div className="instructions">
          Match each item from the left column with the correct option from the dropdown menu.
        </div>
        
        <div className="matching-table-container">
          <table className="matching-table">
            <thead>
              <tr>
                <th className="prompt-column">Question</th>
                <th className="response-column">Your Answer</th>
                {submitted && <th className="status-column">Result</th>}
              </tr>
            </thead>
            <tbody>
              {matchItems.map((item) => (
                <tr key={item.id} className={getStatusClass(item)}>
                  <td className="prompt-cell">{item.prompt}</td>
                  <td className="response-cell">
                    <select
                      value={item.studentAnswer}
                      onChange={(e) => handleSelectChange(item.id, e.target.value)}
                      disabled={submitted}
                      className="answer-select"
                    >
                      <option value="">Select an answer</option>
                      {availableOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  {submitted && (
                    <td className="status-cell">
                      {item.studentAnswer === item.correctAnswer ? (
                        <span className="status-icon correct">✓ Correct</span>
                      ) : (
                        <>
                          <span className="status-icon incorrect">✗ Incorrect</span>
                          <div className="correct-answer">
                            Correct answer: {item.correctAnswer}
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!submitted ? (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Answers
          </button>
        ) : (
          <>
            <div className="score-feedback">
              You scored <span className="score">{score.correct}</span> out of <span className="total">{score.total}</span>
            </div>
            <div className="try-again-btn">
              <button onClick={handleTryAgain}>Try Again</button>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default MatchingTableStudentPage;