import React from 'react';
import { MatchItem } from './matchingTable.types';
import './matchingTable.scss';

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
    <div className="matching-input-form">
      <h3>Create Matching Questions</h3>
      
      {matchItems.map((item, index) => (
        <div key={item.id} className="matching-input-row">
          <input
            type="text"
            className="input"
            placeholder="Enter prompt/question"
            value={item.prompt}
            onChange={(e) => onItemChange(index, 'prompt', e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Enter correct answer"
            value={item.correctAnswer}
            onChange={(e) => onItemChange(index, 'correctAnswer', e.target.value)}
          />
          <button
            className="btnDelete"
            onClick={() => onRemoveRow(index)}
            disabled={matchItems.length <= 1}
            title="Remove row"
          >
            ✕
          </button>
        </div>
      ))}
      
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <button className="btnSecondary" onClick={onAddRow}>
          + Add Row
        </button>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          <strong>Note:</strong> Students will be presented with all correct answers as options and will need to match them with the corresponding prompts.
        </p>
      </div>
    </div>
  );
};

export default MatchingTableInstructor;