import { Team, TeamStanding, TopScorer, Match, Competition } from './football';

export type QueryType = 'standings' | 'scorers' | 'matches' | 'team' | 'competitions' | 'team-stats';

export interface FootballFilters {
  formation?: string;
  metric?: string;
}

export interface FootballQueryParams {
  type: QueryType;
  league?: string;
  season?: string;
  team?: string;
  filters?: FootballFilters;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class FootballError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'FootballError';
  }
}

export interface SeasonConfig {
  minYear: number;
  maxYear: number;
  currentSeason: string;
}