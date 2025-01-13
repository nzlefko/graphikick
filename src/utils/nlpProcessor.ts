export const processQuery = async (query: string) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim().toLowerCase();
  console.info("Processing query:", { cleanQuery });

  // Simple keyword-based classification
  let type = 'unknown';
  
  // Check for standings/table related queries
  if (cleanQuery.includes('standing') || 
      cleanQuery.includes('table') || 
      cleanQuery.includes('position') ||
      cleanQuery.includes('rank')) {
    type = 'standings';
  }
  // Check for scorer related queries
  else if (cleanQuery.includes('scorer') || 
           cleanQuery.includes('goal') || 
           cleanQuery.includes('scoring') ||
           cleanQuery.includes('goals')) {
    type = 'scorers';
  }
  // Check for match related queries
  else if (cleanQuery.includes('match') || 
           cleanQuery.includes('game') || 
           cleanQuery.includes('fixture') || 
           cleanQuery.includes('result') ||
           cleanQuery.includes('score')) {
    type = 'matches';
  }
  // Check for team related queries
  else if (cleanQuery.includes('team') || 
           cleanQuery.includes('squad') || 
           cleanQuery.includes('club')) {
    type = 'team';
  }
  // Check for competition related queries
  else if (cleanQuery.includes('league') || 
           cleanQuery.includes('competition')) {
    type = 'competitions';
  }

  // Extract year if present
  const yearMatch = cleanQuery.match(/\b20\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : '2023';

  // Extract league if present (default to Premier League)
  const league = cleanQuery.includes('la liga') ? 'PD' : 
                cleanQuery.includes('bundesliga') ? 'BL1' : 
                cleanQuery.includes('serie a') ? 'SA' : 
                'PL';

  console.info("Query processed:", { type, league, year });

  return {
    type,
    league,
    season: year,
    limit: 10
  };
};