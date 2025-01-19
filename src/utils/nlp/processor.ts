import { logger } from '../logger';
import { parseQuery } from './queryParser';
import natural from 'natural';
import { QueryType } from './patterns';

const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

interface ProcessedQuery {
  type: QueryType;
  league: string;
  season: string;
  team?: string;
  limit?: number;
}

// Train the classifier with sample queries
const trainClassifier = () => {
  // Standings
  classifier.addDocument('show me the league table', 'standings');
  classifier.addDocument('what is the current ranking', 'standings');
  
  // Scorers
  classifier.addDocument('who is the top scorer', 'scorers');
  classifier.addDocument('show me goal statistics', 'scorers');
  
  // Matches
  classifier.addDocument('what are the recent results', 'matches');
  classifier.addDocument('show me upcoming fixtures', 'matches');
  
  classifier.train();
};

trainClassifier();

export const processQuery = async (query: string, language: 'he' | 'en' = 'en'): Promise<ProcessedQuery> => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim().toLowerCase();
  logger.info('Processing query', { cleanQuery, language });

  try {
    // Use both regex-based parsing and NLP classification
    const parsedQuery = parseQuery(cleanQuery, language);
    const tokens = tokenizer.tokenize(cleanQuery);
    const nlpClassification = classifier.classify(cleanQuery);

    // Combine results, preferring regex matches but using NLP as fallback
    const result: ProcessedQuery = {
      type: parsedQuery.type,
      league: parsedQuery.league || 'PL', // Default to Premier League
      season: parsedQuery.season || new Date().getFullYear().toString(),
      limit: 10
    };

    logger.info('Query processed successfully', result);
    return result;

  } catch (error) {
    logger.error('Error processing query', { query, language, error });
    throw error;
  }
};