import React, { useState, useEffect } from 'react';
import './matchingTable.scss';

interface MatchItem {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  studentAnswer: string;
}

interface MatchingTableProps {
  items: MatchItem[];
  isInstructorView?: boolean;
  onAnswerChange?: (id: string, answer: string) => void;
  readOnly?: boolean;
}

const MatchingTable: React.FC<MatchingTableProps> = ({
  items = [],
  isInstructorView = false,
  onAnswerChange,
  readOnly = false
}) => {
  const [matchItems, setMatchItems] = useState<MatchItem[]>(items);
  const allOptions = [...new Set(items.flatMap(item => item.options))];

  useEffect(() => {
    setMatchItems(items);
  }, [items]);

  const handleSelectionChange = (id: string, selectedValue: string) => {
    const updatedItems = matchItems.map(item => 
      item.id === id ? { ...item, studentAnswer: selectedValue } : item
    );
    
    setMatchItems(updatedItems);
    
    if (onAnswerChange) {
      onAnswerChange(id, selectedValue);
    }
  };

  const isCorrect = (item: MatchItem): boolean => {
    return item.studentAnswer === item.correctAnswer;
  };

  const getStatusClass = (item: MatchItem): string => {
    if (!isInstructorView || !item.studentAnswer) return '';
    return isCorrect(item) ? 'correct' : 'incorrect';
  };

  return (
    <div className="matching-table-container">
      <table className="matching-table">
        <thead>
          <tr>
            <th className="prompt-column">Prompt</th>
            <th className="response-column">Response</th>
            {isInstructorView && <th className="status-column">Status</th>}
          </tr>
        </thead>
        <tbody>
          {matchItems.map((item) => (
            <tr key={item.id} className={getStatusClass(item)}>
              <td className="prompt-cell">{item.prompt}</td>
              <td className="response-cell">
                {readOnly ? (
                  <div className="selected-answer">{item.studentAnswer || 'Not answered'}</div>
                ) : (
                  <select
                    value={item.studentAnswer || ''}
                    onChange={(e) => handleSelectionChange(item.id, e.target.value)}
                    className="answer-select"
                  >
                    <option value="">Select an answer</option>
                    {allOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              {isInstructorView && (
                <td className="status-cell">
                  {item.studentAnswer ? (
                    isCorrect(item) ? (
                      <span className="status-icon correct">✓</span>
                    ) : (
                      <>
                        <span className="status-icon incorrect">✗</span>
                        <span className="correct-answer">
                          Correct: {item.correctAnswer}
                        </span>
                      </>
                    )
                  ) : (
                    <span className="status-unanswered">Not answered</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchingTable;