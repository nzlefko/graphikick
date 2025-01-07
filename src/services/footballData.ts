import { League, Player, Team } from '@/types/football';

// This is sample data - we'll replace it with actual OpenFootball data
export const sampleLeague: League = {
  name: "Premier League",
  season: "2023/24",
  teams: [
    {
      name: "Manchester City",
      points: 63,
      played: 27,
      won: 19,
      drawn: 6,
      lost: 2,
      goalsFor: 63,
      goalsAgainst: 26
    },
    {
      name: "Liverpool",
      points: 60,
      played: 27,
      won: 18,
      drawn: 6,
      lost: 3,
      goalsFor: 63,
      goalsAgainst: 25
    }
  ],
  topScorers: [
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
  ]
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
  // In the future, this will fetch from the actual OpenFootball dataset
  // For now, we'll return sample data
  switch (queryParams.type) {
    case "topScorers":
      return sampleLeague.topScorers;
    case "standings":
      return sampleLeague.teams;
    default:
      throw new Error("לא הצלחתי להבין את השאילתה. אנא נסה שוב.");
  }
};