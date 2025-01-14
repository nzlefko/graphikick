export const processQuery = async (query: string) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim().toLowerCase();
  console.info("Processing query:", { cleanQuery });

  // More specific keyword matching
  let type = 'unknown';
  let league = 'PL'; // Default to Premier League
  let season = '2023'; // Default season
  let team = undefined;

  // Extract year if present
  const yearMatch = cleanQuery.match(/\b20\d{2}\b/);
  if (yearMatch) {
    season = yearMatch[0];
  }

  // Extract league if present
  if (cleanQuery.includes('la liga')) {
    league = 'PD';
  } else if (cleanQuery.includes('bundesliga')) {
    league = 'BL1';
  } else if (cleanQuery.includes('serie a')) {
    league = 'SA';
  }

  // Check for standings/table related queries
  if (cleanQuery.includes('standing') || 
      cleanQuery.includes('table') || 
      cleanQuery.includes('position') ||
      cleanQuery.includes('rank') ||
      cleanQuery.includes('league table')) {
    type = 'standings';
  }
  // Check for scorer related queries with more specific matching
  else if (cleanQuery.includes('top scorer') || 
           cleanQuery.includes('goal scorer') || 
           cleanQuery.includes('most goals') ||
           cleanQuery.includes('leading scorer') ||
           cleanQuery.includes('מלך שערים')) {
    type = 'scorers';
  }
  // Check for match related queries with more specific matching
  else if (cleanQuery.includes('last match') || 
           cleanQuery.includes('recent game') || 
           cleanQuery.includes('match result') || 
           cleanQuery.includes('score') ||
           cleanQuery.includes('fixture') ||
           cleanQuery.includes('תוצאות')) {
    type = 'matches';
  }
  // Check for team related queries
  else if (cleanQuery.includes('team info') || 
           cleanQuery.includes('squad') || 
           cleanQuery.includes('club details') ||
           cleanQuery.includes('team roster')) {
    type = 'team';
    
    // Try to extract team name from common Premier League teams
    const teams = {
      'manchester united': 'MUFC',
      'manchester city': 'MCFC',
      'liverpool': 'LIV',
      'chelsea': 'CHE',
      'arsenal': 'ARS',
      'tottenham': 'TOT',
      // Add more teams as needed
    };

    for (const [teamName, teamCode] of Object.entries(teams)) {
      if (cleanQuery.includes(teamName)) {
        team = teamCode;
        break;
      }
    }
  }
  // Check for competition related queries
  else if (cleanQuery.includes('league') || 
           cleanQuery.includes('competition') ||
           cleanQuery.includes('tournament')) {
    type = 'competitions';
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