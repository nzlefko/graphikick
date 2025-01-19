export interface QueryKeywords {
  standings: string[];
  scorers: string[];
  matches: string[];
  team: string[];
  competitions: string[];
}

export interface QueryPatterns {
  [key: string]: QueryKeywords;
}

export const queryKeywords: QueryPatterns = {
  he: {
    standings: ['טבלה', 'דירוג', 'טבלת ליגה', 'מיקום', 'דירוג קבוצות'],
    scorers: ['מלך שערים', 'מלך השערים', 'כובש', 'מבקיע', 'שערים', 'מבקיעים'],
    matches: ['משחקים', 'תוצאות', 'מחזור', 'משחק'],
    team: ['קבוצה', 'שחקנים', 'סגל', 'הרכב'],
    competitions: ['ליגות', 'תחרויות', 'טורנירים']
  },
  en: {
    standings: ['table', 'standings', 'position', 'ranking', 'league table'],
    scorers: ['top scorer', 'scorers', 'goals', 'scorer', 'goal scorer'],
    matches: ['matches', 'fixtures', 'results', 'games', 'match'],
    team: ['team', 'squad', 'players', 'roster'],
    competitions: ['competitions', 'leagues', 'tournaments']
  }
};

export const defaultLeagues = {
  he: '383', // Israeli League
  en: 'PL'  // Premier League
};

export const seasonPatterns = {
  fullYear: /\b20\d{2}\b/,
  shortYear: /\b\d{2}\/\d{2}\b/,
  hyphenated: /\b\d{2}-\d{2}\b/,
  relative: {
    thisSeason: /(this|current)\s+season/i,
    lastSeason: /last\s+season/i
  }
};