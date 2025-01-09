// API configuration
const FOOTBALL_API_KEY = 'YOUR_API_KEY'; // Note: In production, this should be in an environment variable
const FOOTBALL_API_BASE_URL = 'https://api.football-data.org/v4';

interface FootballResponse {
  data: any;
  error?: string;
}

// Fetch data from Football-Data.org API
const fetchFootballData = async (endpoint: string): Promise<FootballResponse> => {
  try {
    const response = await fetch(`${FOOTBALL_API_BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': FOOTBALL_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching football data:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch data' 
    };
  }
};

export const parseQuery = (query: string, language: 'he' | 'en'): { 
  type: string; 
  league?: string; 
  season?: string;
  team?: string;
} => {
  const lowercaseQuery = query.toLowerCase();
  
  // Extract season (YYYY-YY format)
  const seasonMatch = query.match(/\d{4}-\d{2}/);
  let season = undefined;
  
  if (seasonMatch) {
    const fullYear = parseInt(seasonMatch[0].slice(0, 4));
    const shortYear = parseInt(seasonMatch[0].slice(5, 7));
    if (shortYear === (fullYear + 1) % 100) {
      season = seasonMatch[0];
    }
  }

  // Hebrew keywords
  const hebrewStandingsKeywords = ['טבלה', 'דירוג', 'טבלת ליגה', 'מיקום', 'דירוג קבוצות'];
  const hebrewScorerKeywords = ['מלך שערים', 'מלך השערים', 'כובש', 'מבקיע', 'שערים', 'מבקיעים'];
  const hebrewMatchesKeywords = ['משחקים', 'תוצאות', 'מחזור'];
  const hebrewTeamKeywords = ['קבוצה', 'שחקנים', 'סגל'];
  const hebrewCompetitionsKeywords = ['ליגות', 'תחרויות', 'טורנירים'];

  // English keywords
  const matchesKeywords = ['matches', 'fixtures', 'results', 'games'];
  const teamKeywords = ['team', 'squad', 'players'];
  const competitionsKeywords = ['competitions', 'leagues', 'tournaments'];

  // Check query type
  if (hebrewStandingsKeywords.some(kw => lowercaseQuery.includes(kw)) || 
      lowercaseQuery.includes('standing') || 
      lowercaseQuery.includes('table')) {
    return { type: "standings", league: "PL", season };
  }
  
  if (hebrewScorerKeywords.some(kw => lowercaseQuery.includes(kw)) || 
      lowercaseQuery.includes('scorer')) {
    return { type: "scorers", league: "PL", season };
  }
  
  if (hebrewMatchesKeywords.some(kw => lowercaseQuery.includes(kw)) || 
      matchesKeywords.some(kw => lowercaseQuery.includes(kw))) {
    return { type: "matches", league: "PL", season };
  }
  
  if (hebrewTeamKeywords.some(kw => lowercaseQuery.includes(kw)) || 
      teamKeywords.some(kw => lowercaseQuery.includes(kw))) {
    return { type: "team", league: "PL", season };
  }
  
  if (hebrewCompetitionsKeywords.some(kw => lowercaseQuery.includes(kw)) || 
      competitionsKeywords.some(kw => lowercaseQuery.includes(kw))) {
    return { type: "competitions" };
  }
  
  throw new Error(
    language === 'he' 
      ? "לא הצלחתי להבין את השאילתה. נסה לשאול על טבלה, מלך שערים, משחקים, קבוצות או תחרויות"
      : "Could not understand the query. Try asking about standings, top scorers, matches, teams, or competitions"
  );
};

export const getFootballData = async (queryParams: { 
  type: string; 
  league?: string; 
  season?: string;
  team?: string;
}) => {
  try {
    switch (queryParams.type) {
      case "standings":
        const standingsResponse = await fetchFootballData(
          `/competitions/${queryParams.league}/standings${queryParams.season ? `?season=${queryParams.season}` : ''}`
        );
        return standingsResponse.data?.standings?.[0]?.table || [];
        
      case "scorers":
        const scorersResponse = await fetchFootballData(
          `/competitions/${queryParams.league}/scorers${queryParams.season ? `?season=${queryParams.season}` : ''}`
        );
        return scorersResponse.data?.scorers || [];
        
      case "matches":
        const matchesResponse = await fetchFootballData(
          `/competitions/${queryParams.league}/matches${queryParams.season ? `?season=${queryParams.season}` : ''}`
        );
        return matchesResponse.data?.matches || [];
        
      case "team":
        const teamResponse = await fetchFootballData(
          `/teams/${queryParams.team}`
        );
        return teamResponse.data || null;
        
      case "competitions":
        const competitionsResponse = await fetchFootballData(
          '/competitions'
        );
        return competitionsResponse.data?.competitions || [];
        
      default:
        throw new Error("Invalid query type");
    }
  } catch (error) {
    console.error('Error in getFootballData:', error);
    throw error;
  }
};