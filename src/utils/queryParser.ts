// Keywords for different query types
const KEYWORDS = {
  he: {
    standings: ['טבלה', 'דירוג', 'טבלת ליגה', 'מיקום', 'דירוג קבוצות'],
    scorers: ['מלך שערים', 'מלך השערים', 'כובש', 'מבקיע', 'שערים', 'מבקיעים'],
    matches: ['משחקים', 'תוצאות', 'מחזור'],
    team: ['קבוצה', 'שחקנים', 'סגל'],
    competitions: ['ליגות', 'תחרויות', 'טורנירים']
  },
  en: {
    matches: ['matches', 'fixtures', 'results', 'games'],
    team: ['team', 'squad', 'players'],
    competitions: ['competitions', 'leagues', 'tournaments']
  }
};

export const extractSeason = (query: string): string | undefined => {
  const seasonMatch = query.match(/\d{4}/);
  return seasonMatch ? seasonMatch[0] : undefined;
};

export const determineQueryType = (query: string): string => {
  const lowercaseQuery = query.toLowerCase();
  
  // Check Hebrew keywords
  for (const [type, keywords] of Object.entries(KEYWORDS.he)) {
    if (keywords.some(kw => lowercaseQuery.includes(kw))) {
      return type;
    }
  }
  
  // Check English keywords
  for (const [type, keywords] of Object.entries(KEYWORDS.en)) {
    if (keywords.some(kw => lowercaseQuery.includes(kw))) {
      return type;
    }
  }
  
  return 'unknown';
};

export const parseQuery = (query: string, language: 'he' | 'en'): { 
  type: string; 
  league?: string; 
  season?: string;
  team?: string;
} => {
  const season = extractSeason(query);
  const type = determineQueryType(query);
  
  if (type === 'unknown') {
    throw new Error(
      language === 'he' 
        ? "לא הצלחתי להבין את השאילתה. נסה לשאול על טבלה, מלך שערים, משחקים, קבוצות או תחרויות"
        : "Could not understand the query. Try asking about standings, top scorers, matches, teams, or competitions"
    );
  }

  return {
    type,
    league: "PL", // Default to Premier League for now
    season
  };
};