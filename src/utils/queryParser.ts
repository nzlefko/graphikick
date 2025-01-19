import { queryKeywords, defaultLeagues, seasonPatterns, QueryKeywords } from '../data/queryKeywords';
import { logger } from './logger';

interface ParsedQuery {
  type: string;
  league?: string;
  season?: string;
  team?: string;
}

const getCurrentSeason = (): string => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  return currentMonth >= 7 ? currentYear.toString() : (currentYear - 1).toString();
};

const extractSeason = (query: string): string => {
  const currentSeason = getCurrentSeason();
  const cleanQuery = query.toLowerCase();

  // Handle relative season terms
  if (seasonPatterns.relative.thisSeason.test(cleanQuery)) {
    return currentSeason;
  }
  if (seasonPatterns.relative.lastSeason.test(cleanQuery)) {
    return (parseInt(currentSeason) - 1).toString();
  }

  // Check for explicit season patterns
  for (const [key, pattern] of Object.entries(seasonPatterns)) {
    if (key !== 'relative') {
      const match = cleanQuery.match(pattern);
      if (match) {
        let year = match[0];
        if (year.includes('/') || year.includes('-')) {
          const [startYear] = year.split(/[/-]/);
          year = `20${startYear}`;
        }
        
        // Validate season range (2021-2023 for free API plan)
        const seasonYear = parseInt(year);
        if (seasonYear < 2021 || seasonYear > 2023) {
          throw new Error(`Season ${year} is not supported. Please try a season between 2021 and 2023. Query: "${query}"`);
        }
        
        return year;
      }
    }
  }

  return currentSeason;
};

const determineQueryType = (query: string, language: 'he' | 'en'): string => {
  if (!queryKeywords[language]) {
    logger.error(`Unsupported language: ${language}`);
    throw new Error(`Language '${language}' is not supported. Available languages: ${Object.keys(queryKeywords).join(', ')}`);
  }

  const cleanQuery = query.toLowerCase();
  let bestMatch = { type: '', score: 0 };

  const keywords: QueryKeywords = queryKeywords[language];
  
  for (const [type, patterns] of Object.entries(keywords)) {
    const score = patterns.reduce((acc, pattern) => {
      // Use word boundary regex to avoid partial matches
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      return acc + (regex.test(cleanQuery) ? 1 : 0);
    }, 0);

    if (score > bestMatch.score) {
      bestMatch = { type, score };
    }
  }

  if (bestMatch.score === 0) {
    const errorMessage = language === 'he'
      ? `לא הצלחתי להבין את השאילתה "${query}". נסה לשאול על:\n- טבלת הליגה\n- מלך השערים\n- תוצאות משחקים\n- מידע על קבוצה\n- ליגות זמינות`
      : `Could not understand the query "${query}". Try asking about:\n- League standings\n- Top scorers\n- Match results\n- Team information\n- Available competitions`;
    
    logger.error('Query type detection failed', { query, language });
    throw new Error(errorMessage);
  }

  logger.debug('Query type detected', { type: bestMatch.type, score: bestMatch.score, query });
  return bestMatch.type;
};

export const parseQuery = (query: string, language: 'he' | 'en'): ParsedQuery => {
  if (!query || typeof query !== 'string') {
    const errorMessage = language === 'he'
      ? 'השאילתה חייבת להיות מחרוזת לא ריקה'
      : 'Query must be a non-empty string';
    throw new Error(errorMessage);
  }

  const cleanQuery = query.trim();
  logger.info('Processing query', { query: cleanQuery, language });

  try {
    const type = determineQueryType(cleanQuery, language);
    const season = extractSeason(cleanQuery);
    
    const result: ParsedQuery = {
      type,
      league: defaultLeagues[language],
      season
    };

    logger.info('Query parsed successfully', result);
    return result;

  } catch (error) {
    logger.error('Error parsing query', { query, language, error });
    throw error;
  }
};