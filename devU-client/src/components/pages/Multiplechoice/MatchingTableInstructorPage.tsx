
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MatchingTableInstructor from './MatchingTableInstructor';
import { MatchItem } from './matchingTable.types';
import PageWrapper from 'components/shared/layouts/pageWrapper';
import './matchingTable.scss';

const MatchingTableInstructorPage: React.FC = () => {
    const [matchItems, setMatchItems] = useState<MatchItem[]>([
        { id: Date.now().toString(), prompt: '', correctAnswer: '', options: [], studentAnswer: '' },
        { id: (Date.now() + 1).toString(), prompt: '', correctAnswer: '', options: [], studentAnswer: '' },
    ]);

    const history = useHistory();
    let idCounter = matchItems.length + 1;

    const handleItemChange = (index: number, field: keyof MatchItem, value: string) => {
        const updated = [...matchItems];
        updated[index][field] = value as any;
        setMatchItems(updated);
    };

    const handleAddRow = () => {
        setMatchItems([
            ...matchItems,
            {
                id: (Date.now() + idCounter++).toString(),
                prompt: '',
                correctAnswer: '',
                options: [],
                studentAnswer: '',
            },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        // Don't allow removing the last row
        if (matchItems.length <= 1) return;

        const updated = [...matchItems];
        updated.splice(index, 1);
        setMatchItems(updated);
    };

    const handleSubmitQuestion = () => {
        // Filter out empty rows
        const filledItems = matchItems.filter(
            (item) => item.prompt.trim() && item.correctAnswer.trim()
        );

        if (filledItems.length < 2) {
            alert('Please enter at least two valid rows with both prompt and correct answer');
            return;
        }

        // Create all options array for each item
        const allOptions = filledItems.map((item) => item.correctAnswer);
        const itemsWithOptions = filledItems.map((item) => ({
            ...item,
            options: allOptions,
        }));

        // Navigate to student view with the items
        history.push({
            pathname: '/matching-table/student',
            state: { items: itemsWithOptions },
        });
    };

    return (
        <PageWrapper>
            <div className="matching-instructor-wrapper">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Matching Table Question</h2>

                <MatchingTableInstructor
                    matchItems={matchItems}
                    onItemChange={handleItemChange}
                    onAddRow={handleAddRow}
                    onRemoveRow={handleRemoveRow}
                />

                <div className="submit-container">
                    <button
                        className="btnPrimary submit-question-btn"
                        onClick={handleSubmitQuestion}
                        disabled={matchItems.filter((item) => item.prompt && item.correctAnswer).length < 2}
                    >
                        Submit & Preview As Student
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default MatchingTableInstructorPage;