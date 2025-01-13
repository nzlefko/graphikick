import { language } from '@/types/football';

export const formatTextResponse = (data: any[], type: string, language: language): string => {
  if (!Array.isArray(data) || data.length === 0) {
    return language === 'he' ? "לא נמצאו תוצאות" : "No results found";
  }

  switch (type) {
    case 'standings':
      const topTeam = data[0];
      return language === 'he' 
        ? `${topTeam.team.name} מובילה את הטבלה עם ${topTeam.points} נקודות`
        : `${topTeam.team.name} leads the table with ${topTeam.points} points`;
    
    case 'scorers':
      const topScorer = data[0];
      return language === 'he'
        ? `${topScorer.player.name} הוא מלך השערים עם ${topScorer.goals} שערים`
        : `${topScorer.player.name} is the top scorer with ${topScorer.goals} goals`;
    
    case 'matches':
      const recentMatch = data[0];
      return language === 'he'
        ? `המשחק האחרון: ${recentMatch.homeTeam.name} ${recentMatch.score.fullTime.home ?? '-'} - ${recentMatch.score.fullTime.away ?? '-'} ${recentMatch.awayTeam.name}`
        : `Latest match: ${recentMatch.homeTeam.name} ${recentMatch.score.fullTime.home ?? '-'} - ${recentMatch.score.fullTime.away ?? '-'} ${recentMatch.awayTeam.name}`;
    
    default:
      return language === 'he' ? "התקבלו תוצאות" : "Results received";
  }
};