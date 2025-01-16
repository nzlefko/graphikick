export const processQuery = async (query: string) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim().toLowerCase();
  console.info("Processing query:", { cleanQuery });

  // Initialize parameters with defaults
  let type = 'unknown';
  let league = 'PL';
  let season = new Date().getFullYear().toString();
  let team = undefined;

  // Enhanced league detection with synonyms and variations
  const leaguePatterns = {
    'PD': ['la liga', 'spanish league', 'spain', 'primera division', 'laliga'],
    'BL1': ['bundesliga', 'german league', 'germany', 'deutsche liga'],
    'SA': ['serie a', 'italian league', 'italy', 'calcio'],
    'FL1': ['ligue 1', 'french league', 'france', 'ligue1'],
    'PL': ['premier league', 'english league', 'england', 'epl'],
    '383': ['ligat haal', 'israeli league', 'israel', 'ligat ha\'al', 'israeli premier league']
  };

  for (const [code, patterns] of Object.entries(leaguePatterns)) {
    if (patterns.some(pattern => cleanQuery.includes(pattern))) {
      league = code;
      break;
    }
  }

  // Enhanced query type detection with football-specific terminology
  const queryPatterns = {
    standings: [
      'standing', 'table', 'position', 'rank', 'league table',
      'who is leading', 'who leads', 'top of', 'bottom of',
      'relegated', 'promotion', 'points', 'מיקום', 'טבלה',
      'league position', 'current standings', 'team rankings'
    ],
    scorers: [
      'top scorer', 'goal scorer', 'most goals', 'leading scorer',
      'who scored', 'best striker', 'golden boot', 'מלך שערים',
      'כובש', 'שערים', 'top goalscorer', 'scoring charts',
      'goal tally', 'scoring leader', 'goal king'
    ],
    matches: [
      'match', 'game', 'fixture', 'score', 'result', 'played',
      'when', 'next game', 'last game', 'upcoming', 'schedule',
      'משחק', 'תוצאה', 'מתי', 'head to head', 'h2h',
      'matchday', 'gameweek', 'round', 'fixture list'
    ],
    team: [
      'team info', 'squad', 'roster', 'players', 'club',
      'who plays for', 'team sheet', 'lineup', 'formation',
      'סגל', 'שחקנים', 'הרכב', 'team news', 'club info',
      'first team', 'starting eleven', 'bench', 'reserves'
    ],
    competitions: [
      'league', 'competition', 'tournament', 'championships',
      'available leagues', 'which leagues', 'ליגות', 'תחרויות',
      'divisions', 'cups', 'competitions list'
    ]
  };

  // Find the most relevant query type based on pattern matching
  let maxMatches = 0;
  for (const [patternType, patterns] of Object.entries(queryPatterns)) {
    const matches = patterns.filter(pattern => cleanQuery.includes(pattern)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      type = patternType;
    }
  }

  // Extract year/season with support for various formats
  const yearPatterns = [
    /\b20\d{2}\b/, // Full year (e.g., 2023)
    /\b\d{2}\/\d{2}\b/, // Season format (e.g., 22/23)
    /\b\d{2}-\d{2}\b/ // Alternative season format (e.g., 22-23)
  ];

  for (const pattern of yearPatterns) {
    const match = cleanQuery.match(pattern);
    if (match) {
      if (match[0].includes('/') || match[0].includes('-')) {
        // Convert season format to full year
        const years = match[0].split(/[/-]/);
        season = `20${years[0]}`;
      } else {
        season = match[0];
      }
      break;
    }
  }

  // Time-based query detection
  if (cleanQuery.includes('next') || cleanQuery.includes('upcoming')) {
    type = 'matches';
  } else if (cleanQuery.includes('history') || cleanQuery.includes('previous')) {
    type = 'matches';
  }

  console.info("Query processed:", { type, league, season, team });

  if (type === 'unknown') {
    throw new Error(
      'Could not understand the query. Try asking about:\n' +
      '- League standings or table\n' +
      '- Top scorers or goal statistics\n' +
      '- Match results or fixtures\n' +
      '- Team information or squad details\n' +
      '- Available competitions'
    );
  }

  return {
    type,
    league,
    season,
    team,
    limit: 10
  };
};