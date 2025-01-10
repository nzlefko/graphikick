import { supabase } from "@/integrations/supabase/client";

// API configuration
const getApiToken = () => {
  const token = localStorage.getItem('FOOTBALL_API_TOKEN');
  if (!token) {
    localStorage.setItem('FOOTBALL_API_TOKEN', 'e61650fe00fc47379949a684d4744ccb');
    return 'e61650fe00fc47379949a684d4744ccb';
  }
  return token;
};

interface FootballResponse {
  data: any;
  error?: string;
}

// Fetch data from Football-Data.org API via Supabase Edge Function
const fetchFootballData = async (endpoint: string): Promise<FootballResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('football-api', {
      body: { endpoint },
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data received from API');
    }

    return { data: data.data };
  } catch (error) {
    console.error('Error fetching football data:', error);
    throw error;
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