import { League, Player, Team } from '@/types/football';

const FOOTBALL_DATA_BASE_URL = 'https://raw.githubusercontent.com/openfootball/football.json/master/2023-24';

export const fetchLeagueData = async (leaguePath: string): Promise<League> => {
  try {
    const response = await fetch(`${FOOTBALL_DATA_BASE_URL}/${leaguePath}`);
    if (!response.ok) {
      throw new Error('Failed to fetch league data');
    }
    const data = await response.json();
    return transformLeagueData(data);
  } catch (error) {
    console.error('Error fetching league data:', error);
    throw new Error('Failed to load league data');
  }
};

const transformLeagueData = (rawData: any): League => {
  // OpenFootball data structure has matches array
  const teams: Team[] = [];
  const teamsMap = new Map<string, Team>();

  // Initialize teams from the matches data
  rawData.matches.forEach((match: any) => {
    const { team1, team2, score1, score2 } = match;
    
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

    // Only process completed matches
    if (score1 !== null && score2 !== null) {
      const team1Data = teamsMap.get(team1)!;
      const team2Data = teamsMap.get(team2)!;

      // Update statistics for both teams
      team1Data.played += 1;
      team2Data.played += 1;
      
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
    season: "2023/24",
    teams: sortedTeams,
    topScorers
  };
};

export const parseQuery = (query: string): { type: string; league?: string; season?: string } => {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes("מלך שערים") || lowercaseQuery.includes("כובש")) {
    return { type: "topScorers", league: "Premier League" };
  }
  
  if (lowercaseQuery.includes("טבלה") || lowercaseQuery.includes("דירוג")) {
    return { type: "standings", league: "Premier League" };
  }
  
  return { type: "unknown" };
};

export const getFootballData = async (queryParams: { type: string; league?: string; season?: string }) => {
  try {
    const leagueData = await fetchLeagueData('en.1.json');
    
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
