import { pipeline } from '@huggingface/transformers';
import { parseQuery } from './queryParser';

let questionAnswerer: any = null;

export const initializeNLP = async () => {
  try {
    console.log('Initializing NLP model...');
    questionAnswerer = await pipeline(
      'question-answering',
      'Xenova/distilbert-base-cased-distilled-squad',
      { device: 'wasm' } // Changed to WASM for better compatibility
    );
    console.log('NLP model initialized successfully');
  } catch (error) {
    console.error('Error initializing NLP model:', error);
    throw error;
  }
};

export const processQuery = async (query: string): Promise<{
  type: string;
  league?: string;
  season?: string;
  team?: string;
}> => {
  if (!questionAnswerer) {
    await initializeNLP();
  }

  // Ensure query is a string and not undefined/null
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  // Context for the model to understand football-related queries
  const context = `
    You can ask about football statistics including:
    - League standings (table positions)
    - Top scorers
    - Match results
    - Team information
    - Competition details
    The available leagues include Premier League (PL).
    You can specify seasons using years like 2023.
  `;

  try {
    const result = await questionAnswerer({
      question: query.trim(),
      context: context.trim(),
    });

    console.log('NLP processing result:', result);

    // Extract key information from the model's answer
    const answer = result.answer.toLowerCase();
    
    // Determine query type based on the model's understanding
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
    const seasonMatch = query.match(/\d{4}/);
    const season = seasonMatch ? seasonMatch[0] : undefined;

    // Default to Premier League for now
    const league = 'PL';

    return {
      type,
      league,
      season,
    };
  } catch (error) {
    console.error('Error processing query with NLP:', error);
    // Fallback to the original keyword-based parsing
    return parseQuery(query, 'en');
  }
};