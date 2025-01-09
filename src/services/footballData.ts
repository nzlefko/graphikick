import { League, Player, Team } from '@/types/football';

const FOOTBALL_DATA_BASE_URL = 'https://raw.githubusercontent.com/openfootball/football.json/master';

export const fetchLeagueData = async (leaguePath: string, season?: string): Promise<League> => {
  try {
    // Default to current season if none specified
    const seasonPath = season || '2023-24';
    const response = await fetch(`${FOOTBALL_DATA_BASE_URL}/${seasonPath}/${leaguePath}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch league data for season ${seasonPath}`);
    }
    const data = await response.json();
    return transformLeagueData(data, seasonPath);
  } catch (error) {
    console.error('Error fetching league data:', error);
    throw new Error(`Failed to load league data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const transformLeagueData = (rawData: any, season: string): League => {
  const teams: Team[] = [];
  const teamsMap = new Map<string, Team>();

  // Initialize teams from the matches data
  rawData.matches.forEach((match: any) => {
    const { team1, team2, score } = match;
    
    // Add team1 if not exists
    if (!teamsMap.has(team1)) {
      teamsMap.set(team1, {
        name: team1,
        points: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0
      });
    }
    
    // Add team2 if not exists
    if (!teamsMap.has(team2)) {
      teamsMap.set(team2, {
        name: team2,
        points: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0
      });
    }

    // Only process completed matches where both scores exist in the score object
    if (score && typeof score.ft?.[0] === 'number' && typeof score.ft?.[1] === 'number') {
      const score1 = score.ft[0];
      const score2 = score.ft[1];
      
      const team1Data = teamsMap.get(team1)!;
      const team2Data = teamsMap.get(team2)!;

      // Update statistics for both teams
      team1Data.played += 1;
      team2Data.played += 1;
      
      // Update goals
      team1Data.goalsFor += score1;
      team1Data.goalsAgainst += score2;
      team2Data.goalsFor += score2;
      team2Data.goalsAgainst += score1;

      if (score1 > score2) {
        team1Data.won += 1;
        team2Data.lost += 1;
        team1Data.points += 3;
      } else if (score2 > score1) {
        team2Data.won += 1;
        team1Data.lost += 1;
        team2Data.points += 3;
      } else {
        team1Data.drawn += 1;
        team2Data.drawn += 1;
        team1Data.points += 1;
        team2Data.points += 1;
      }
    }
  });

  // Convert Map to array and sort by points
  const sortedTeams = Array.from(teamsMap.values()).sort((a, b) => 
    b.points - a.points || 
    (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)
  );

  // Note: OpenFootball doesn't provide top scorers data, so we'll keep using sample data for now
  const topScorers: Player[] = [
    {
      name: "Erling Haaland",
      goals: 17,
      team: "Manchester City",
      position: "Forward"
    },
    {
      name: "Ollie Watkins",
      goals: 13,
      team: "Aston Villa",
      position: "Forward"
    }
  ];

  return {
    name: "Premier League",
    season,
    teams: sortedTeams,
    topScorers
  };
};

export const parseQuery = (query: string): { type: string; league?: string; season?: string } => {
  const lowercaseQuery = query.toLowerCase();
  
  // Extract and validate season format (YYYY-YY)
  const seasonMatch = query.match(/\d{4}-\d{2}/);
  let season = undefined;
  
  if (seasonMatch) {
    const fullYear = parseInt(seasonMatch[0].slice(0, 4));
    const shortYear = parseInt(seasonMatch[0].slice(5, 7));
    
    // Validate that the short year is the next year after the full year
    if (shortYear === (fullYear + 1) % 100) {
      season = seasonMatch[0];
    } else {
      throw new Error('Invalid season format. Please use format YYYY-YY where YY is the next year (e.g., 2016-17)');
    }
  }
  
  // Check for top scorers queries in both languages
  if (lowercaseQuery.includes("מלך שערים") || 
      lowercaseQuery.includes("כובש") || 
      lowercaseQuery.includes("top scorer") || 
      lowercaseQuery.includes("scorer")) {
    return { type: "topScorers", league: "Premier League", season };
  }
  
  // Check for standings queries in both languages
  if (lowercaseQuery.includes("טבלה") || 
      lowercaseQuery.includes("דירוג") || 
      lowercaseQuery.includes("standing") || 
      lowercaseQuery.includes("table")) {
    return { type: "standings", league: "Premier League", season };
  }
  
  return { type: "unknown" };
};

export const getFootballData = async (queryParams: { type: string; league?: string; season?: string }) => {
  try {
    const leagueData = await fetchLeagueData('en.1.json', queryParams.season);
    
    switch (queryParams.type) {
      case "topScorers":
        return leagueData.topScorers;
      case "standings":
        return leagueData.teams;
      default:
        throw new Error("לא הצלחתי להבין את השאילתה. אנא נסה שוב.");
    }
  } catch (error) {
    console.error('Error in getFootballData:', error);
    throw error;
  }
};