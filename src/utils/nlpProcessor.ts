export const processQuery = async (query: string) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim().toLowerCase();
  console.info("Processing query:", { cleanQuery });

  // Initialize parameters with defaults
  let type = 'unknown';
  let league = 'PL'; // Default to Premier League
  let season = new Date().getFullYear().toString(); // Default to current year
  let team = undefined;

  // Extract year/season
  const yearMatch = cleanQuery.match(/\b20\d{2}\b/);
  if (yearMatch) {
    season = yearMatch[0];
  } else if (cleanQuery.includes('last season')) {
    season = (parseInt(season) - 1).toString();
  }

  // Enhanced league detection
  const leaguePatterns = {
    'PD': ['la liga', 'spanish league', 'spain'],
    'BL1': ['bundesliga', 'german league', 'germany'],
    'SA': ['serie a', 'italian league', 'italy'],
    'FL1': ['ligue 1', 'french league', 'france'],
    'PL': ['premier league', 'english league', 'england']
  };

  for (const [code, patterns] of Object.entries(leaguePatterns)) {
    if (patterns.some(pattern => cleanQuery.includes(pattern))) {
      league = code;
      break;
    }
  }

  // Enhanced query type detection with more patterns
  const queryPatterns = {
    standings: [
      'standing', 'table', 'position', 'rank', 'league table',
      'who is leading', 'who leads', 'top of', 'bottom of',
      'relegated', 'promotion', 'points', 'מיקום', 'טבלה'
    ],
    scorers: [
      'top scorer', 'goal scorer', 'most goals', 'leading scorer',
      'who scored', 'best striker', 'golden boot', 'מלך שערים',
      'כובש', 'שערים'
    ],
    matches: [
      'match', 'game', 'fixture', 'score', 'result', 'played',
      'when', 'next game', 'last game', 'upcoming', 'schedule',
      'משחק', 'תוצאה', 'מתי'
    ],
    team: [
      'team info', 'squad', 'roster', 'players', 'club',
      'who plays for', 'team sheet', 'lineup', 'formation',
      'סגל', 'שחקנים', 'הרכב'
    ],
    competitions: [
      'league', 'competition', 'tournament', 'championships',
      'available leagues', 'which leagues', 'ליגות', 'תחרויות'
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

  // Extract team names (basic implementation - can be expanded)
  const commonTeams = {
    'manchester united': 'MUFC',
    'manchester city': 'MCFC',
    'liverpool': 'LIV',
    'chelsea': 'CHE',
    'arsenal': 'ARS',
    'tottenham': 'TOT',
    'barcelona': 'BAR',
    'real madrid': 'RMA',
    'bayern munich': 'BAY',
    'paris saint-germain': 'PSG',
    'juventus': 'JUV',
    'milan': 'MIL'
  };

  for (const [teamName, teamCode] of Object.entries(commonTeams)) {
    if (cleanQuery.includes(teamName)) {
      team = teamCode;
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
    throw new Error('Could not understand the query. Please try asking about standings, top scorers, matches, teams, or competitions.');
  }

  return {
    type,
    league,
    season,
    team,
    limit: 10
  };
};