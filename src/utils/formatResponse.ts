import { language } from '@/types/football';

export const formatTextResponse = (data: any[], type: string, language: language): string => {
  if (!Array.isArray(data) || data.length === 0) {
    return language === 'he' ? "לא נמצאו תוצאות" : "No results found";
  }

  switch (type) {
    case 'standings': {
      const topTeam = data[0];
      const secondTeam = data[1];
      return language === 'he' 
        ? `${topTeam.team.name} מובילה את הטבלה עם ${topTeam.points} נקודות, במקום השני ${secondTeam.team.name} עם ${secondTeam.points} נקודות`
        : `${topTeam.team.name} leads the table with ${topTeam.points} points, followed by ${secondTeam.team.name} with ${secondTeam.points} points`;
    }
    
    case 'scorers': {
      const topScorer = data[0];
      const secondScorer = data[1];
      return language === 'he'
        ? `${topScorer.player.name} מוביל את טבלת הכובשים עם ${topScorer.goals} שערים, אחריו ${secondScorer.player.name} עם ${secondScorer.goals} שערים`
        : `${topScorer.player.name} leads the scoring chart with ${topScorer.goals} goals, followed by ${secondScorer.player.name} with ${secondScorer.goals} goals`;
    }
    
    case 'matches': {
      const recentMatch = data[0];
      const nextMatch = data[1];
      const homeScore = recentMatch.score.fullTime.home ?? '-';
      const awayScore = recentMatch.score.fullTime.away ?? '-';
      
      return language === 'he'
        ? `המשחק האחרון: ${recentMatch.homeTeam.name} ${homeScore} - ${awayScore} ${recentMatch.awayTeam.name}. המשחק הבא: ${nextMatch.homeTeam.name} נגד ${nextMatch.awayTeam.name}`
        : `Latest match: ${recentMatch.homeTeam.name} ${homeScore} - ${awayScore} ${recentMatch.awayTeam.name}. Next match: ${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name}`;
    }

    case 'team': {
      const team = Array.isArray(data) ? data[0] : data;
      return language === 'he'
        ? `מידע על ${team.name}: אצטדיון - ${team.venue}, צבעי המועדון - ${team.clubColors}, שנת ייסוד - ${team.founded}`
        : `${team.name} info: Stadium - ${team.venue}, Club Colors - ${team.clubColors}, Founded - ${team.founded}`;
    }
    
    case 'competitions': {
      const count = data.length;
      return language === 'he'
        ? `נמצאו ${count} תחרויות זמינות`
        : `Found ${count} available competitions`;
    }
    
    default:
      return language === 'he' ? "התקבלו תוצאות" : "Results received";
  }
};