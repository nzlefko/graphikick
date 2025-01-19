import { SeasonConfig, FootballError } from '@/types/footballOperations';
import { fetchFootballData } from '@/services/api';

export class SeasonValidator {
  private static config: SeasonConfig | null = null;

  static async initialize(): Promise<void> {
    try {
      const response = await fetchFootballData('/leagues/seasons');
      const seasons = response.data?.response || [];
      
      if (seasons.length > 0) {
        this.config = {
          minYear: Math.min(...seasons),
          maxYear: Math.max(...seasons),
          currentSeason: new Date().getFullYear().toString()
        };
      }
    } catch (error) {
      console.error('Failed to initialize season config:', error);
      // Fallback to default values
      this.config = {
        minYear: 2021,
        maxYear: 2023,
        currentSeason: '2023'
      };
    }
  }

  static async validateSeason(season: string): Promise<string> {
    if (!this.config) {
      await this.initialize();
    }

    const seasonNumber = parseInt(season);
    if (
      isNaN(seasonNumber) || 
      seasonNumber < this.config!.minYear || 
      seasonNumber > this.config!.maxYear
    ) {
      throw new FootballError(
        `Season must be between ${this.config!.minYear} and ${this.config!.maxYear}`,
        'INVALID_SEASON',
        { season, validRange: this.config }
      );
    }

    return season;
  }

  static getCurrentSeason(): string {
    return this.config?.currentSeason || '2023';
  }
}