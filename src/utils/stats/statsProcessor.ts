import { Match, TeamStats } from '@/types/football';
import { logger } from '../logger';

export const calculateWinPercentage = (matches: Match[]): number => {
  if (!matches.length) return 0;
  
  const wins = matches.filter(match => {
    const isHomeTeam = match.homeTeam.name === matches[0].homeTeam.name;
    const homeScore = match.score.fullTime.home;
    const awayScore = match.score.fullTime.away;
    
    if (isHomeTeam) {
      return homeScore > awayScore;
    }
    return awayScore > homeScore;
  });

  return (wins.length / matches.length) * 100;
};

export const processTeamStats = (matches: Match[], metric: string): TeamStats => {
  logger.info('Processing team stats:', { matchCount: matches.length, metric });
  
  return {
    winPercentage: calculateWinPercentage(matches),
    totalMatches: matches.length,
    // Add more metrics as needed
  };
};