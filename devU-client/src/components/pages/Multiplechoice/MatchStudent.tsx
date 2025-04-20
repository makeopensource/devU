import React, { useState, useEffect, useRef } from 'react';
import styles from './StudentPage.scss';

import { MatchItem } from './matchingTable.types';

interface MatchingTableProps {
  items: MatchItem[];
  onAnswerChange?: (id: string, answer: string) => void;
  readOnly?: boolean;
}

const MatchingTableStudent: React.FC<MatchingTableProps> = ({
  items = [],
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
    const allOptions = [...new Set(items.map(item => item.correctAnswer))];
    setAvailableOptions(allOptions.sort(() => 0.5 - Math.random()));
    const currentSelections: {[key: string]: string} = {};
    items.forEach(item => {
      if (item.studentAnswer) {
        currentSelections[item.id] = item.studentAnswer;
      }
    });
    setSelectedOptions(currentSelections);
  }, [items]);

  useEffect(() => {
    if (readOnly) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        const index = parseInt(key, 10);
        if (activePrompt) {
          const optionIndex = index;
          if (optionIndex < availableOptions.length) {
            const selectedOption = availableOptions[optionIndex];
            handleMatchSelection(activePrompt, selectedOption);
            setActivePrompt(null);
          }
        } else {
          const promptIndex = index;
          if (promptIndex < matchItems.length) {
            setActivePrompt(matchItems[promptIndex].id);
          }
        }
      } else if (key === 'Escape') {
        setActivePrompt(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activePrompt, availableOptions, matchItems, readOnly]);

  const handlePromptClick = (itemId: string) => {
    if (readOnly) return;
    setActivePrompt(activePrompt === itemId ? null : itemId);
  };

  const handleOptionClick = (option: string) => {
    if (readOnly || !activePrompt) return;
    handleMatchSelection(activePrompt, option);
    setActivePrompt(null);
  };

  const handleMatchSelection = (itemId: string, option: string) => {
    const newSelectedOptions = { ...selectedOptions };
    
    // Remove option from any other prompt that might be using it
    Object.keys(newSelectedOptions).forEach(key => {
      if (newSelectedOptions[key] === option && key !== itemId) {
        delete newSelectedOptions[key];
      }
    });
    
    newSelectedOptions[itemId] = option;
    setSelectedOptions(newSelectedOptions);
    
    const updatedItems = matchItems.map(item => 
      item.id === itemId ? { ...item, studentAnswer: option } : item
    );
    setMatchItems(updatedItems);
    
    if (onAnswerChange) {
      onAnswerChange(itemId, option);
    }
  };

  const handleRemoveAnswer = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className={styles['matching-table-container']} ref={containerRef}>
      <div className={styles['matching-columns']}>
        <div className={styles['prompts-column']}>
          <div className={styles['column-header']}>Prompt</div>
          {matchItems.map((item, index) => {
            const isMatched = !!selectedOptions[item.id];
            const isActive = activePrompt === item.id;
            const itemClass = `prompt-item ${isActive ? 'active' : ''} ${isMatched ? 'matched' : ''}`;
            
            return (
              <div key={item.id} className={itemClass}onClick={() => handlePromptClick(item.id)}>
                <div className={styles['item-number']}>{index}</div>
                <div className={styles['item-content']}>{item.prompt}</div>
                {isMatched && !readOnly && (
                  <button 
                    className={styles['remove-answer-btn']}
                    onClick={(e) => handleRemoveAnswer(item.id, e)}
                    aria-label="Remove match"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        <div className={styles['options-column']}>
          <div className={styles['column-header']}>Response</div>
          {availableOptions.map((option, index) => {
            const isUsed = Object.values(selectedOptions).includes(option);
            
            return (
              <div 
                key={option} 
                className={`option-item ${isUsed ? 'used' : ''}`} 
                onClick={() => handleOptionClick(option)}
              >
                <div className={styles['item-number']}>{index}</div>
                <div className={styles['item-content']}>{option}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {!readOnly && (
        <div className={styles['matching-instructions']}>
          <p>Select a number on the left, then select a number on the right to match them. You can also click items directly.</p>
        </div>
      )}
    </div>
  );
};

export default MatchingTableStudent;