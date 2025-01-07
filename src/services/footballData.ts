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
  const teams: Team[] = rawData.standings[0].map((standing: any) => ({
    name: standing.team.name,
    points: standing.points,
    played: standing.played,
    won: standing.won,
    drawn: standing.drawn,
    lost: standing.lost,
    goalsFor: standing.goals_for,
    goalsAgainst: standing.goals_against
  }));

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
    teams,
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
