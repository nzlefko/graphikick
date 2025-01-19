export interface QueryIntent {
  type: string;
  confidence: number;
}

export interface ProcessedQuery {
  type: string;
  filters?: {
    team?: string;
    formation?: string;
    metric?: string;
  };
  season?: string;
}

export interface TeamStats {
  winPercentage: number;
  totalMatches: number;
  // Add more stats as needed
}