import { processQuery } from '@/utils/nlp/processor';
import { fetchFootballData } from './api';
import { processTeamStats } from '@/utils/stats/statsProcessor';
import { logger } from '@/utils/logger';
import { FootballCache } from '@/utils/cache/footballCache';
import { SeasonValidator } from '@/utils/validators/seasonValidator';
import { FootballDataTransformer } from '@/utils/transformers/footballDataTransformer';
import { FootballQueryParams, FootballError } from '@/types/footballOperations';

export const getFootballData = async (queryParams: FootballQueryParams) => {
  try {
    logger.info('Getting football data with params:', queryParams);
    
    const season = await SeasonValidator.validateSeason(
      queryParams.season || SeasonValidator.getCurrentSeason()
    );

    // Check cache first
    const cachedData = FootballCache.get(queryParams);
    if (cachedData) {
      return cachedData;
    }

    switch (queryParams.type) {
      case "team-stats": {
        const matchesResponse = await fetchFootballData(
          '/fixtures',
          { 
            team: queryParams.team,
            season,
            status: 'FT'
          }
        );

        if (!matchesResponse.data?.response?.length) {
          throw new FootballError(
            `No matches found for the team in ${season} season.`,
            'NO_MATCHES_FOUND'
          );
        }

        const matches = FootballDataTransformer.transformMatches(
          matchesResponse.data.response
        );
        const stats = processTeamStats(matches, queryParams.filters?.metric || 'win percentage');
        
        FootballCache.set(queryParams, stats);
        return stats;
      }

      case "standings": {
        const response = await fetchFootballData(
          '/standings',
          { 
            league: queryParams.league || '39',
            season
          }
        );

        const standings = response.data?.response?.[0]?.league?.standings?.[0];
        if (!standings) {
          throw new FootballError(
            `No standings found for ${season} season`,
            'NO_STANDINGS_FOUND'
          );
        }

        const transformedStandings = FootballDataTransformer.transformStandings(standings);
        FootballCache.set(queryParams, transformedStandings);
        return transformedStandings;
      }

      case "scorers": {
        const response = await fetchFootballData(
          '/players/topscorers',
          { 
            league: queryParams.league || '39',
            season
          }
        );

        if (!response.data?.response?.length) {
          throw new FootballError(
            `No top scorers data found for ${season} season`,
            'NO_SCORERS_FOUND'
          );
        }

        const transformedScorers = FootballDataTransformer.transformScorers(
          response.data.response
        );
        FootballCache.set(queryParams, transformedScorers);
        return transformedScorers;
      }

      case "matches": {
        const response = await fetchFootballData(
          '/fixtures',
          { 
            league: queryParams.league || '39',
            season,
            status: 'FT',
            from: `${season}-01-01`,
            to: `${season}-12-31`
          }
        );

        if (!response.data?.response?.length) {
          throw new FootballError(
            `No matches found for season ${season}`,
            'NO_MATCHES_FOUND'
          );
        }

        const transformedMatches = FootballDataTransformer.transformMatches(
          response.data.response
        );
        FootballCache.set(queryParams, transformedMatches);
        return transformedMatches;
      }

      case "team": {
        if (!queryParams.team) {
          throw new FootballError(
            "Team ID is required for team information queries",
            'MISSING_TEAM_ID'
          );
        }

        const [teamResponse, squadResponse] = await Promise.all([
          fetchFootballData('/teams', { id: queryParams.team }),
          fetchFootballData('/players/squads', { team: queryParams.team })
        ]);

        if (!teamResponse.data?.response?.[0]) {
          throw new FootballError(
            'Team information not found',
            'TEAM_NOT_FOUND'
          );
        }

        const transformedTeam = FootballDataTransformer.transformTeam(
          teamResponse.data.response[0],
          squadResponse.data?.response?.[0]?.players || []
        );
        
        FootballCache.set(queryParams, transformedTeam);
        return transformedTeam;
      }

      case "competitions": {
        const response = await fetchFootballData('/leagues');
        
        if (!response.data?.response?.length) {
          throw new FootballError(
            'Unable to fetch competitions list',
            'NO_COMPETITIONS_FOUND'
          );
        }

        const transformedCompetitions = FootballDataTransformer.transformCompetitions(
          response.data.response
        );
        
        FootballCache.set(queryParams, transformedCompetitions);
        return transformedCompetitions;
      }

      default:
        throw new FootballError(
          "Invalid query type",
          'INVALID_QUERY_TYPE',
          { supportedTypes: ['standings', 'scorers', 'matches', 'team', 'competitions', 'team-stats'] }
        );
    }

  } catch (error) {
    logger.error('Error in getFootballData:', error);
    throw error instanceof FootballError ? error : new FootballError(
      error.message || 'An unexpected error occurred',
      'UNKNOWN_ERROR',
      error
    );
  }
};

export const handleComplexQuery = async (query: string) => {
  const processedQuery = await processQuery(query, 'en');
  return getFootballData({
    type: processedQuery.type,
    league: processedQuery.league,
    team: processedQuery.team,
    season: processedQuery.season,
    filters: {
      formation: processedQuery.filters?.formation,
      metric: processedQuery.filters?.metric
    }
  });
};

export { processQuery };