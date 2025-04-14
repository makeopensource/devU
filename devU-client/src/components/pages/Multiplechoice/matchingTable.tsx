
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
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [draggedOption, setDraggedOption] = useState<string | null>(null);

  useEffect(() => {
    setMatchItems(items);
    
    // Initialize available options from all correct answers
    const allOptions = [...new Set(items.map(item => item.correctAnswer))];
    setAvailableOptions(allOptions.sort(() => 0.5 - Math.random())); // Shuffle options
    
    // Initialize selected options from existing student answers
    const currentSelections: {[key: string]: string} = {};
    items.forEach(item => {
      if (item.studentAnswer) {
        currentSelections[item.id] = item.studentAnswer;
      }
    });
    setSelectedOptions(currentSelections);
  }, [items]);

  const isCorrect = (item: MatchItem): boolean => {
    return item.studentAnswer === item.correctAnswer;
  };

  const getStatusClass = (item: MatchItem): string => {
    if (!isInstructorView || !item.studentAnswer) return '';
    return isCorrect(item) ? 'correct' : 'incorrect';
  };

  // Handle drag start from options
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, option: string) => {
    setDraggedOption(option);
    e.dataTransfer.setData('text/plain', option);
    e.currentTarget.classList.add('dragging');
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dragging');
  };

  // Handle drag over for drop zones
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  // Handle drag leave for drop zones
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dragover');
  };

  // Handle drop on answer cells
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    if (draggedOption && !readOnly) {
      // Update the selected options
      const newSelectedOptions = { ...selectedOptions };
      
      // If this option was already assigned to another item, remove that assignment
      Object.keys(newSelectedOptions).forEach(key => {
        if (newSelectedOptions[key] === draggedOption && key !== itemId) {
          delete newSelectedOptions[key];
        }
      });
      
      // Assign this option to the target item
      newSelectedOptions[itemId] = draggedOption;
      setSelectedOptions(newSelectedOptions);
      
      // Update the match items and call the change handler
      const updatedItems = matchItems.map(item => 
        item.id === itemId ? { ...item, studentAnswer: draggedOption } : item
      );
      setMatchItems(updatedItems);
      
      if (onAnswerChange) {
        onAnswerChange(itemId, draggedOption);
      }
    }
  };

  // Remove an answer from an item
  const handleRemoveAnswer = (itemId: string) => {
    if (readOnly) return;
    
    const updatedItems = matchItems.map(item => 
      item.id === itemId ? { ...item, studentAnswer: '' } : item
    );
    setMatchItems(updatedItems);
    
    const newSelectedOptions = { ...selectedOptions };
    delete newSelectedOptions[itemId];
    setSelectedOptions(newSelectedOptions);
    
    if (onAnswerChange) {
      onAnswerChange(itemId, '');
    }
  };

  return (
    <div className="matching-table-container">
      <div className="matching-table-wrapper">
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
                    <div className="selected-answer">
                      {item.studentAnswer || 'Not answered'}
                    </div>
                  ) : (
                    <div 
                      className={`answer-dropzone ${selectedOptions[item.id] ? 'filled' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, item.id)}
                    >
                      {selectedOptions[item.id] ? (
                        <div className="selected-answer">
                          {selectedOptions[item.id]}
                          <button 
                            className="remove-answer-btn"
                            onClick={() => handleRemoveAnswer(item.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="empty-answer">Drag answer here</div>
                      )}
                    </div>
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

      {!readOnly && (
        <div className="options-container">
          <h3>Available Answers</h3>
          <div className="options-list">
            {availableOptions.map((option) => (
              <div 
                key={option}
                className={`option-item ${Object.values(selectedOptions).includes(option) ? 'used' : ''}`}
                draggable={!Object.values(selectedOptions).includes(option) || true}
                onDragStart={(e) => handleDragStart(e, option)}
                onDragEnd={handleDragEnd}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingTable;