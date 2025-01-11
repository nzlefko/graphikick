import { pipeline } from '@huggingface/transformers';
import { parseQuery } from './queryParser';

let questionAnswerer: any = null;

export const initializeNLP = async () => {
  try {
    console.log('Initializing NLP model...');
    questionAnswerer = await pipeline(
      'question-answering',
      'Xenova/distilbert-base-cased-distilled-squad',
      { device: 'wasm' }
    );
    console.log('NLP model initialized successfully');
  } catch (error) {
    console.error('Error initializing NLP model:', error);
    throw error;
  }
};

export const processQuery = async (query: string) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim();
  
  // Context for football-related queries
  const context = `
    This is a football statistics system. You can ask about:
    - League standings and table positions
    - Top scorers and goal statistics
    - Match results and fixtures
    - Team information and squad details
    - Competition details
    Available leagues include Premier League (PL).
    You can specify seasons using years (e.g., 2023).
  `.trim();

  try {
    if (!questionAnswerer) {
      await initializeNLP();
    }

    // Ensure both inputs are strings and properly formatted
    if (typeof cleanQuery !== 'string' || typeof context !== 'string') {
      throw new Error('Invalid input types for question answering');
    }

    // Log the inputs for debugging
    console.log('Processing query:', { cleanQuery, context });

    const result = await questionAnswerer({
      question: cleanQuery,
      context: context,
      topK: 1, // Limit to top result
      maxLength: 512, // Limit response length
    });

    console.log('NLP processing result:', result);

    if (!result || !result.answer) {
      throw new Error('Invalid response from NLP model');
    }

    // Extract key information from the model's answer
    const answer = result.answer.toString().toLowerCase();
    
    // Map the answer to query parameters
    let type = 'unknown';
    if (answer.includes('stand') || answer.includes('table') || answer.includes('position')) {
      type = 'standings';
    } else if (answer.includes('scorer') || answer.includes('goal')) {
      type = 'scorers';
    } else if (answer.includes('match') || answer.includes('result')) {
      type = 'matches';
    } else if (answer.includes('team') || answer.includes('squad')) {
      type = 'team';
    } else if (answer.includes('competition') || answer.includes('league')) {
      type = 'competitions';
    }

    // Extract season if present (4-digit year)
    const seasonMatch = cleanQuery.match(/\d{4}/);
    const season = seasonMatch ? seasonMatch[0] : undefined;

    return {
      type,
      league: 'PL', // Default to Premier League
      season,
    };
  } catch (error) {
    console.error('Error processing query with NLP:', error);
    // Fallback to keyword-based parsing
    return parseQuery(query, 'en');
  }
};