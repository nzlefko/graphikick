import { pipeline } from '@huggingface/transformers';

let questionAnswerer: any = null;

export const initializeNLP = async () => {
  try {
    console.log('Initializing NLP model...');
    questionAnswerer = await pipeline(
      'question-answering',
      'Xenova/distilbert-base-cased-distilled-squad',
      { device: 'webgpu' }
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
      question: query,
      context: context,
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
    const { parseQuery } = await import('./queryParser');
    return parseQuery(query, 'en');
  }
};