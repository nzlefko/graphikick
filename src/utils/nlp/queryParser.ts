import { logger } from '../logger';
import { seasonPatterns, queryPatterns, QueryType } from './patterns';
import { t, changeLanguage } from './localization';
import { LRUCache } from 'lru-cache';

const queryCache = new LRUCache<string, ParsedQuery>({
  max: 100,
  ttl: 1000 * 60 * 5 // Cache for 5 minutes
});

interface ParsedQuery {
  type: QueryType;
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

const extractSeason = (query: string, language: string): string => {
  const currentSeason = getCurrentSeason();
  const cleanQuery = query.toLowerCase();

  // Handle relative season terms
  if (seasonPatterns.thisSeasonPattern.test(cleanQuery)) {
    return currentSeason;
  }
  if (seasonPatterns.lastSeasonPattern.test(cleanQuery)) {
    return (parseInt(currentSeason) - 1).toString();
  }

  // Check for explicit season patterns
  for (const [key, pattern] of Object.entries(seasonPatterns)) {
    if (key === 'thisSeasonPattern' || key === 'lastSeasonPattern') continue;
    
    const match = cleanQuery.match(pattern);
    if (match) {
      let year = match[0];
      if (year.includes('/') || year.includes('-')) {
        const [startYear] = year.split(/[/-]/);
        year = `20${startYear}`;
      }
      
      const seasonYear = parseInt(year);
      if (seasonYear < 2021 || seasonYear > 2023) {
        throw new Error(t('errors.invalidSeason', { season: year, lng: language }));
      }
      
      return year;
    }
  }

  return currentSeason;
};

const determineQueryType = (query: string): QueryType => {
  const cleanQuery = query.toLowerCase();
  let bestMatch: { type: QueryType; score: number } = { type: 'standings', score: 0 };

  for (const [type, pattern] of Object.entries(queryPatterns)) {
    const matches = cleanQuery.match(pattern);
    if (matches) {
      const score = matches.length;
      if (score > bestMatch.score) {
        bestMatch = { type: type as QueryType, score };
      }
    }
  }

  if (bestMatch.score === 0) {
    throw new Error(t('errors.unknownQueryType'));
  }

  return bestMatch.type;
};

export const parseQuery = (query: string, language: 'he' | 'en'): ParsedQuery => {
  if (!query || typeof query !== 'string') {
    throw new Error(t('errors.invalidQuery', { lng: language }));
  }

  // Check cache first
  const cacheKey = `${query}-${language}`;
  const cached = queryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Set language for i18next
  changeLanguage(language);

  const cleanQuery = query.trim();
  logger.info('Processing query', { query: cleanQuery, language });

  try {
    const result: ParsedQuery = {
      type: determineQueryType(cleanQuery),
      season: extractSeason(cleanQuery, language)
    };

    // Cache the result
    queryCache.set(cacheKey, result);
    logger.info('Query parsed successfully', result);
    return result;

  } catch (error) {
    logger.error('Error parsing query', { query, language, error });
    throw error;
  }
};