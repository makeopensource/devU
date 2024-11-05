import React, { useState } from 'react';

import formStyles from './coursesFormPage.scss'

function AutomateDates() {
  const [season, setSeason] = useState('');
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const currentYear = new Date().getFullYear();

  // Define the session options based on the selected season
  const getSessionOptions = (season: string) => {
    switch (season) {
      case 'Fall':
      case 'Spring':
        return [
          { value: '15 week', label: '15 week' },
          { value: '7 week', label: '7 week' },
          { value: 'Custom', label: 'Custom' }
        ];
      case 'Winter':
        return [
          { value: '15 days', label: '15 days' },
          { value: '14 days', label: '14 days' },
          { value: '10 days', label: '10 days' },
          { value: 'Custom', label: 'Custom' }
        ];
      case 'Summer':
        return [
          { value: 'Summer Session I (J)', label: 'Summer Session I (J)' },
          { value: 'Summer Session II (K)', label: 'Summer Session II (K)' },
          { value: 'Summer Session III (M)', label: 'Summer Session III (M)' },
          { value: '9 Weeks (L)', label: '9 Weeks (L)' },
          { value: '10 Weeks (A)', label: '10 Weeks (A)' },
          { value: '12 Weeks (I)', label: '12 Weeks (I)' },
          { value: 'Custom', label: 'Custom' }
        ];
      default:
        return [];
    }
  };

  // Define default values based on season
  const getDefaultSession = (season: string) => {
    switch (season) {
      case 'Fall':
      case 'Spring':
        return '15 week';
      case 'Winter':
        return '15 days';
      case 'Summer':
        return 'Summer Session I (J)';
      default:
        return '';
    }
  };

  // Handle changes to season and update session options
  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSeason = event.target.value;
    setSeason(selectedSeason);
    setSession(getDefaultSession(selectedSeason));
  };

  return (
    <div className={formStyles.semesterOptions}>
      {/* Season Dropdown */}
      <div className={formStyles.fieldContainer}>
        <label htmlFor="season">Season</label>
        <select id="season" value={season} onChange={handleSeasonChange}>
          <option value="">Select Season</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
        </select>
      </div>

      {/* Year Dropdown */}
      <div className={formStyles.fieldContainer}>
        <label htmlFor="year">Year</label>
        <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          {Array.from({ length: 7 }, (_, i) => currentYear + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Session Dropdown */}
      <div className={formStyles.fieldContainer}>
        <label htmlFor="session">Session</label>
        <select id="session" value={session} onChange={(e) => setSession(e.target.value)}>
          {getSessionOptions(season).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
    </div>
  );
}

export default AutomateDates;
