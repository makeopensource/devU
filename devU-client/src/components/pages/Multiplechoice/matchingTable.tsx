import React, { useState, useEffect, useRef } from 'react';
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
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  // Add keyboard event listener
  useEffect(() => {
    if (readOnly) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      // Check if key is a number
      if (/^[0-9]$/.test(key)) {
        const index = parseInt(key, 10);
        
        // If an active prompt is selected, match it with the option
        if (activePrompt) {
          const optionIndex = index;
          if (optionIndex < availableOptions.length) {
            const selectedOption = availableOptions[optionIndex];
            handleMatchSelection(activePrompt, selectedOption);
            setActivePrompt(null);
          }
        } else {
          // Otherwise, select the prompt
          const promptIndex = index;
          if (promptIndex < matchItems.length) {
            setActivePrompt(matchItems[promptIndex].id);
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePrompt, availableOptions, matchItems, readOnly]);

  const isCorrect = (item: MatchItem): boolean => {
    return item.studentAnswer === item.correctAnswer;
  };

  const handlePromptClick = (itemId: string) => {
    if (readOnly) return;
    
    if (activePrompt === itemId) {
      // Deselect if clicking the same prompt
      setActivePrompt(null);
    } else {
      setActivePrompt(itemId);
    }
  };

  const handleOptionClick = (option: string) => {
    if (readOnly || !activePrompt) return;
    
    handleMatchSelection(activePrompt, option);
    setActivePrompt(null);
  };

  const handleMatchSelection = (itemId: string, option: string) => {
    // Update the selected options
    const newSelectedOptions = { ...selectedOptions };
    
    // If this option was already assigned to another item, remove that assignment
    Object.keys(newSelectedOptions).forEach(key => {
      if (newSelectedOptions[key] === option && key !== itemId) {
        delete newSelectedOptions[key];
      }
    });
    
    // Assign this option to the target item
    newSelectedOptions[itemId] = option;
    setSelectedOptions(newSelectedOptions);
    
    // Update the match items and call the change handler
    const updatedItems = matchItems.map(item => 
      item.id === itemId ? { ...item, studentAnswer: option } : item
    );
    setMatchItems(updatedItems);
    
    if (onAnswerChange) {
      onAnswerChange(itemId, option);
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
    <div className="matching-table-container" ref={containerRef}>
      <div className="matching-table-wrapper">
        <div className="matching-columns">
          <div className="prompts-column">
            <div className="column-header">Prompt</div>
            {matchItems.map((item, index) => {
              const isMatched = !!selectedOptions[item.id];
              const itemClass = `prompt-item ${activePrompt === item.id ? 'active' : ''} ${isMatched ? 'matched' : ''}`;
              
              return (
                <div 
                  key={item.id}
                  className={itemClass}
                  onClick={() => handlePromptClick(item.id)}
                >
                  <div className="item-number">{index}</div>
                  <div className="item-content">{item.prompt}</div>
                  {isMatched && !readOnly && (
                    <button 
                      className="remove-answer-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAnswer(item.id);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="options-column">
            <div className="column-header">Response</div>
            {availableOptions.map((option, index) => {
              const isUsed = Object.values(selectedOptions).includes(option);
              
              return (
                <div 
                  key={option}
                  className={`option-item ${isUsed ? 'used' : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="item-number">{index}</div>
                  <div className="item-content">{option}</div>
                </div>
              );
            })}
          </div>
          
          {isInstructorView && (
            <div className="status-column">
              <div className="column-header">Status</div>
              {matchItems.map((item) => (
                <div key={`status-${item.id}`} className="status-item">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {!readOnly && (
        <div className="matching-instructions">
          <p>Select a number on the left, then select a number on the right to match them. You can also click items directly.</p>
        </div>
      )}
    </div>
  );
};

export default MatchingTable;