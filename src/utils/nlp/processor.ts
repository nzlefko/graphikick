import { logger } from '../logger';
import { parseQuery } from './queryParser';
import { extractEntities } from './nlpSetup';
import { QueryType } from './patterns';

interface ProcessedQuery {
  type: QueryType;
  league: string;
  season: string;
  team?: string;
  filters?: {
    formation?: string;
    metric?: string;
  };
}

export const processQuery = async (query: string, language: 'he' | 'en' = 'en'): Promise<ProcessedQuery> => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim().toLowerCase();
  logger.info('Processing query', { cleanQuery, language });

  try {
    // Use both regex-based parsing and entity extraction
    const parsedQuery = parseQuery(cleanQuery, language);
    const entities = extractEntities(cleanQuery);

    // Combine results
    const result: ProcessedQuery = {
      type: entities.type as QueryType || parsedQuery.type,
      league: parsedQuery.league || 'PL', // Default to Premier League
      season: parsedQuery.season || new Date().getFullYear().toString(),
      team: entities.team,
      filters: {
        formation: entities.formation,
        metric: entities.metric
      }
    };

    logger.info('Query processed successfully', result);
    return result;

  } catch (error) {
    logger.error('Error processing query', { query, language, error });
    throw error;
  }
};