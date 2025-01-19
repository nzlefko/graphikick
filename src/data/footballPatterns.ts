export const leaguePatterns = {
  'PD': {
    names: ['la liga', 'spanish league', 'spain', 'primera division', 'laliga'],
    country: 'Spain',
    weight: 1
  },
  'BL1': {
    names: ['bundesliga', 'german league', 'germany', 'deutsche liga'],
    country: 'Germany',
    weight: 1
  },
  'SA': {
    names: ['serie a', 'italian league', 'italy', 'calcio'],
    country: 'Italy',
    weight: 1
  },
  'FL1': {
    names: ['ligue 1', 'french league', 'france', 'ligue1'],
    country: 'France',
    weight: 1
  },
  'PL': {
    names: ['premier league', 'english league', 'england', 'epl'],
    country: 'England',
    weight: 1
  },
  '383': {
    names: ['ligat haal', 'israeli league', 'israel', 'ligat ha\'al', 'israeli premier league'],
    country: 'Israel',
    weight: 1
  }
};

export const queryTypePatterns = {
  standings: {
    patterns: [
      'standing', 'table', 'position', 'rank', 'league table',
      'who is leading', 'who leads', 'top of', 'bottom of',
      'relegated', 'promotion', 'points', 'מיקום', 'טבלה',
      'league position', 'current standings', 'team rankings'
    ],
    weight: 1
  },
  scorers: {
    patterns: [
      'top scorer', 'goal scorer', 'most goals', 'leading scorer',
      'who scored', 'best striker', 'golden boot', 'מלך שערים',
      'כובש', 'שערים', 'top goalscorer', 'scoring charts',
      'goal tally', 'scoring leader', 'goal king'
    ],
    weight: 1.2
  },
  matches: {
    patterns: [
      'match', 'game', 'fixture', 'score', 'result', 'played',
      'when', 'next game', 'last game', 'upcoming', 'schedule',
      'משחק', 'תוצאה', 'מתי', 'head to head', 'h2h',
      'matchday', 'gameweek', 'round', 'fixture list'
    ],
    weight: 1
  },
  team: {
    patterns: [
      'team info', 'squad', 'roster', 'players', 'club',
      'who plays for', 'team sheet', 'lineup', 'formation',
      'סגל', 'שחקנים', 'הרכב', 'team news', 'club info',
      'first team', 'starting eleven', 'bench', 'reserves'
    ],
    weight: 1.1
  },
  competitions: {
    patterns: [
      'league', 'competition', 'tournament', 'championships',
      'available leagues', 'which leagues', 'ליגות', 'תחרויות',
      'divisions', 'cups', 'competitions list'
    ],
    weight: 0.9
  }
};