import React from 'react';
import { MatchItem } from './matchingTable.types';
import styles from './InstructorPage.scss';


interface MatchingTableInstructorProps {
  matchItems: MatchItem[];
  onItemChange: (index: number, field: keyof MatchItem, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
}

const MatchingTableInstructor: React.FC<MatchingTableInstructorProps> = ({
  matchItems,
  onItemChange,
  onAddRow,
  onRemoveRow
}) => {
  return (
    <div className={styles['matching-input-form']}>
      <h3 className={styles['questions-header']}>Questions & Answers</h3>
      
      <div className={styles['matching-inputs-container']}>
        {matchItems.map((item, index) => (
          <div key={item.id} className={styles['matching-input-row']}>
            <input
              type="text"
              className={styles['input']}
              placeholder="Enter prompt/question"
              value={item.prompt}
              onChange={(e) => onItemChange(index, 'prompt', e.target.value)}
              aria-label={`Question ${index + 1}`}
            />
            <input
              type="text"
              className={styles['input']}
              placeholder="Enter correct answer"
              value={item.correctAnswer}
              onChange={(e) => onItemChange(index, 'correctAnswer', e.target.value)}
              aria-label={`Answer ${index + 1}`}
            />
            <button
              className={styles['btnDelete']}
              onClick={() => onRemoveRow(index)}
              disabled={matchItems.length <= 1}
              title="Remove row"
              aria-label="Remove row"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <button className={styles['btnSecondary']} onClick={onAddRow}>
          + Add Row
        </button>
      </div>
      
      <div className={styles['note']}>
        <p>
          <strong>Note:</strong> Students will be presented with all correct answers as options and will need to match them with the corresponding prompts.
        </p>
      </div>
    </div>
  );
};

export default MatchingTableInstructor;