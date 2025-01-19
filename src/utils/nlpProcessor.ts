import { leaguePatterns, queryTypePatterns } from '../data/footballPatterns';
import { logger } from './logger';

interface ProcessedQuery {
  type: string;
  league: string;
  season: string;
  team?: string;
  limit?: number;
}

const getCurrentSeason = (): string => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // If we're in the latter half of the year, use the current year
  // Otherwise, use the previous year as the season
  return currentMonth >= 7 ? currentYear.toString() : (currentYear - 1).toString();
};

const extractSeason = (query: string): string => {
  const currentSeason = getCurrentSeason();
  const cleanQuery = query.toLowerCase();

  // Handle relative season queries
  if (cleanQuery.includes('this season')) {
    return currentSeason;
  }
  if (cleanQuery.includes('last season')) {
    return (parseInt(currentSeason) - 1).toString();
  }

  // Look for explicit year patterns
  const yearPatterns = [
    /\b20\d{2}\b/,           // Full year (e.g., 2023)
    /\b\d{2}\/\d{2}\b/,      // Season format (e.g., 22/23)
    /\b\d{2}-\d{2}\b/        // Alternative season format (e.g., 22-23)
  ];

  for (const pattern of yearPatterns) {
    const match = cleanQuery.match(pattern);
    if (match) {
      let year = match[0];
      if (year.includes('/') || year.includes('-')) {
        const [startYear] = year.split(/[/-]/);
        year = `20${startYear}`;
      }
      
      // Validate season range
      const seasonYear = parseInt(year);
      if (seasonYear < 2021 || seasonYear > 2023) {
        throw new Error(`Season ${year} is not supported. Please try a season between 2021 and 2023. Query: "${query}"`);
      }
      
      return year;
    }
  }

  return currentSeason;
};

const detectLeague = (query: string): string => {
  const cleanQuery = query.toLowerCase();
  let bestMatch = { code: 'PL', score: 0 }; // Default to Premier League

  for (const [code, league] of Object.entries(leaguePatterns)) {
    const score = league.names.reduce((acc, pattern) => {
      return acc + (cleanQuery.includes(pattern) ? league.weight : 0);
    }, 0);

    if (score > bestMatch.score) {
      bestMatch = { code, score };
    }
  }

  logger.debug('League detection result', { query, detected: bestMatch });
  return bestMatch.code;
};

const determineQueryType = (query: string): string => {
  const cleanQuery = query.toLowerCase();
  let bestMatch = { type: 'unknown', score: 0 };

  for (const [type, config] of Object.entries(queryTypePatterns)) {
    const score = config.patterns.reduce((acc, pattern) => {
      return acc + (cleanQuery.includes(pattern) ? config.weight : 0);
    }, 0);

    if (score > bestMatch.score) {
      bestMatch = { type, score };
    }
  }

  logger.debug('Query type detection result', { query, detected: bestMatch });
  return bestMatch.type;
};

export const processQuery = async (query: string): Promise<ProcessedQuery> => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim().toLowerCase();
  logger.info('Processing query', { cleanQuery });

  try {
    const type = determineQueryType(cleanQuery);
    const league = detectLeague(cleanQuery);
    const season = extractSeason(cleanQuery);

    if (type === 'unknown') {
      throw new Error(
        `Could not understand the query "${query}". Try asking about:\n` +
        '- League standings or table\n' +
        '- Top scorers or goal statistics\n' +
        '- Match results or fixtures\n' +
        '- Team information or squad details\n' +
        '- Available competitions'
      );
    }

    const result: ProcessedQuery = {
      type,
      league,
      season,
      limit: 10
    };

    logger.info('Query processed successfully', result);
    return result;

  } catch (error) {
    logger.error('Error processing query', { query, error });
    throw error;
  }
};
