import StandingsDisplay from './displays/StandingsDisplay';
import ScorersDisplay from './displays/ScorersDisplay';
import MatchesDisplay from './displays/MatchesDisplay';
import CompetitionsDisplay from './displays/CompetitionsDisplay';
import TeamDisplay from './displays/TeamDisplay';
import { Team, TeamStanding, TopScorer, Match, Competition } from '@/types/football';

interface ResultsDisplayProps {
  data: any[] | null;
  error: string | null;
  language: 'he' | 'en';
}

const ResultsDisplay = ({ data, error, language }: ResultsDisplayProps) => {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg animate-fade-in">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Helper function to determine data type
  const getDataType = (data: any[]) => {
    if (data.length === 0) return 'empty';
    const firstItem = data[0];
    
    if ('position' in firstItem && 'points' in firstItem) return 'standings';
    if ('goals' in firstItem && 'player' in firstItem) return 'scorers';
    if ('homeTeam' in firstItem && 'awayTeam' in firstItem) return 'matches';
    if ('name' in firstItem && 'area' in firstItem) return 'competitions';
    if ('squad' in firstItem || ('venue' in firstItem && 'clubColors' in firstItem)) return 'team';
    
    return 'unknown';
  };

  const dataType = Array.isArray(data) ? getDataType(data) : 'team';

  switch (dataType) {
    case 'standings':
      return <StandingsDisplay data={data as TeamStanding[]} language={language} />;
    case 'scorers':
      return <ScorersDisplay data={data as TopScorer[]} language={language} />;
    case 'matches':
      return <MatchesDisplay data={data as Match[]} />;
    case 'competitions':
      return <CompetitionsDisplay data={data as Competition[]} />;
    case 'team':
      const teamData = Array.isArray(data) ? data[0] : data as Team;
      return <TeamDisplay data={teamData} language={language} />;
    case 'empty':
      return (
        <div className="p-4 bg-yellow-50 text-yellow-600 rounded-lg">
          {language === 'he' ? "לא נמצאו תוצאות" : "No results found"}
        </div>
      );
    default:
      return (
        <div className="p-4 bg-red-50 text-red-500 rounded-lg">
          {language === 'he' ? "פורמט נתונים לא מוכר" : "Unknown data format"}
        </div>
      );
  }
};

export default ResultsDisplay;