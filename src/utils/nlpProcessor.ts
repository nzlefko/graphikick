import { pipeline } from '@huggingface/transformers';

let questionAnswerer: any = null;

const initializeNLP = async () => {
  console.info("Initializing NLP model...");
  try {
    questionAnswerer = await pipeline('question-answering', 'distilbert-base-cased-distilled-squad');
    console.info("NLP model initialized successfully");
  } catch (error) {
    console.error("Error initializing NLP model:", error);
    throw error;
  }
};

export const processQuery = async (query: string) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query: Query must be a non-empty string');
  }

  const cleanQuery = query.trim();
  console.info("Processing query:", { cleanQuery, context });

  try {
    if (!questionAnswerer) {
      await initializeNLP();
    }

    // Ensure both inputs are strings
    const context = `This is a football statistics system. You can ask about:
    - League standings and table positions
    - Top scorers and goal statistics
    - Match results and fixtures
    - Team information and squad details
    - Competition details
    Available leagues include Premier League (PL).
    You can specify seasons using years (e.g., 2023).`.trim();

    const result = await questionAnswerer({
      question: cleanQuery,
      context: context,
    });

    // Process the answer to determine the type of query
    const answer = result.answer.toString().toLowerCase();
    
    // Determine query type based on keywords in the answer and original query
    let type = 'unknown';
    if (answer.includes('scorer') || answer.includes('goal') || cleanQuery.includes('scorer') || cleanQuery.includes('goal')) {
      type = 'scorers';
    } else if (answer.includes('standing') || answer.includes('table') || answer.includes('position')) {
      type = 'standings';
    } else if (answer.includes('match') || answer.includes('fixture') || answer.includes('result')) {
      type = 'matches';
    } else if (answer.includes('team') || answer.includes('squad')) {
      type = 'team';
    } else if (answer.includes('competition') || answer.includes('league')) {
      type = 'competitions';
    }

    // Extract year if present
    const yearMatch = cleanQuery.match(/\b20\d{2}\b/);
    const year = yearMatch ? yearMatch[0] : '2023';

    // Extract league if present (default to Premier League)
    const league = cleanQuery.toLowerCase().includes('la liga') ? 'PD' : 
                  cleanQuery.toLowerCase().includes('bundesliga') ? 'BL1' : 
                  cleanQuery.toLowerCase().includes('serie a') ? 'SA' : 
                  'PL';

    return {
      type,
      league,
      season: year,
      limit: 10
    };
  } catch (error) {
    console.error("Error processing query with NLP:", error);
    throw error;
  }
};