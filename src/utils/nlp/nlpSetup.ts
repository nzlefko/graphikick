import natural from 'natural';

export const tokenizer = new natural.WordTokenizer();
export const classifier = new natural.BayesClassifier();

// Train the classifier with sample queries
classifier.addDocument('what is the win percentage', 'team-stats');
classifier.addDocument('how many games did they win', 'team-stats');
classifier.addDocument('show me the formation', 'formation-analysis');
classifier.addDocument('what formation do they use', 'formation-analysis');

classifier.train();