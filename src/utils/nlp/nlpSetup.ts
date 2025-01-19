// Simple pattern matching for football queries
export const queryPatterns = {
  teamStats: [
    /win percentage/i,
    /performance/i,
    /stats/i,
    /statistics/i
  ],
  formation: [
    /formation/i,
    /lineup/i,
    /tactical setup/i,
    /\d-\d-\d/i // Matches formation patterns like 4-3-3
  ],
  team: [
    /arsenal/i,
    /manchester/i,
    /chelsea/i,
    /liverpool/i,
    // Add more team patterns as needed
  ]
};

export const extractEntities = (query: string) => {
  const entities: {
    type?: string;
    team?: string;
    formation?: string;
    metric?: string;
  } = {};

  // Detect query type
  if (queryPatterns.teamStats.some(pattern => pattern.test(query))) {
    entities.type = 'team-stats';
    entities.metric = 'win percentage';
  } else if (queryPatterns.formation.some(pattern => pattern.test(query))) {
    entities.type = 'formation-analysis';
  }

  // Extract formation if present (e.g., 4-3-3)
  const formationMatch = query.match(/\d-\d-\d/);
  if (formationMatch) {
    entities.formation = formationMatch[0];
  }

  // Extract team names
  queryPatterns.team.forEach(pattern => {
    const match = query.match(pattern);
    if (match) {
      entities.team = match[0];
    }
  });

  return entities;
};