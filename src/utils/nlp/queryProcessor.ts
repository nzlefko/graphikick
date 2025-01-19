import { tokenizer, classifier } from './nlpSetup';
import { QueryIntent, ProcessedQuery } from '@/types/query';
import { logger } from '../logger';

interface ExtractedEntities {
  teams?: string[];
  formations?: string[];
  metrics?: string[];
  timeframe?: string;
}

const FORMATIONS = ['4-3-3', '4-4-2', '3-5-2', '3-4-3', '4-2-3-1'];
const METRICS = ['win percentage', 'goals', 'clean sheets', 'possession'];

export const extractEntities = (query: string): ExtractedEntities => {
  const tokens = tokenizer.tokenize(query.toLowerCase());
  const entities: ExtractedEntities = {};

  // Extract formations using pattern matching
  entities.formations = FORMATIONS.filter(formation => 
    query.toLowerCase().includes(formation.toLowerCase())
  );

  // Extract metrics
  entities.metrics = METRICS.filter(metric => 
    query.toLowerCase().includes(metric.toLowerCase())
  );

  // Extract teams (simplified - would need a comprehensive team database)
  const teamMatches = query.match(/\b[A-Z][a-z]+ ?(?:[A-Z][a-z]+)?\b/g);
  if (teamMatches) {
    entities.teams = teamMatches;
  }

  logger.debug('Extracted entities:', entities);
  return entities;
};

export const processComplexQuery = async (query: string): Promise<ProcessedQuery> => {
  const entities = extractEntities(query);
  
  if (!entities.teams?.length && !entities.formations?.length && !entities.metrics?.length) {
    throw new Error('Could not identify any specific teams, formations, or metrics in your query. Try being more specific, for example: "What\'s Arsenal\'s win percentage with 4-3-3?"');
  }

  const result: ProcessedQuery = {
    type: determineQueryType(entities),
    filters: {
      team: entities.teams?.[0],
      formation: entities.formations?.[0],
      metric: entities.metrics?.[0],
    },
    season: new Date().getFullYear().toString()
  };

  logger.info('Processed complex query:', result);
  return result;
};

const determineQueryType = (entities: ExtractedEntities): string => {
  if (entities.metrics?.includes('win percentage')) {
    return 'team-stats';
  }
  if (entities.formations?.length) {
    return 'formation-analysis';
  }
  return 'team';
};