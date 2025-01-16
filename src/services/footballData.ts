import { processQuery } from '@/utils/nlpProcessor';
import { fetchFootballData } from './api';

const SEASON = '2023';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const dataCache: { [key: string]: { data: any; timestamp: number } } = {};

const getCachedData = (cacheKey: string) => {
  const cached = dataCache[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached data for:', cacheKey);
    return cached.data;
  }
  return null;
};

const setCachedData = (cacheKey: string, data: any) => {
  dataCache[cacheKey] = {
    data,
    timestamp: Date.now()
  };
};

export const getFootballData = async (queryParams: { 
  type: string; 
  league?: string; 
  season?: string;
  team?: string;
}) => {
  try {
    console.log('Getting football data with params:', queryParams);
    const cacheKey = `${queryParams.type}-${queryParams.league}-${queryParams.season}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    switch (queryParams.type) {
      case "standings":
        const standingsResponse = await fetchFootballData(
          '/standings',
          { 
            league: queryParams.league || '39',
            season: queryParams.season || SEASON
          }
        );
        console.log('Raw standings response:', standingsResponse.data);
        const standings = standingsResponse.data?.response?.[0]?.league?.standings?.[0];
        
        if (!standings) {
          throw new Error(`No standings found for ${queryParams.season || SEASON} season. Try a different season or league.`);
        }
        
        const transformedStandings = standings.map((standing: any) => ({
          position: standing.rank,
          team: {
            id: standing.team.id,
            name: standing.team.name
          },
          playedGames: standing.all.played,
          won: standing.all.win,
          draw: standing.all.draw,
          lost: standing.all.lose,
          points: standing.points,
          goalsFor: standing.all.goals.for,
          goalsAgainst: standing.all.goals.against
        }));
        
        setCachedData(cacheKey, transformedStandings);
        return transformedStandings;
        
      case "scorers":
        const scorersResponse = await fetchFootballData(
          '/players/topscorers',
          { 
            league: queryParams.league || '39',
            season: queryParams.season || SEASON
          }
        );
        
        if (!scorersResponse.data?.response?.length) {
          throw new Error(`No top scorers data found for ${queryParams.season || SEASON} season. Try a different season or league.`);
        }
        
        const transformedScorers = scorersResponse.data.response.map((item: any) => ({
          player: {
            id: item.player.id,
            name: item.player.name
          },
          team: {
            id: item.statistics[0].team.id,
            name: item.statistics[0].team.name
          },
          goals: item.statistics[0].goals.total
        }));
        
        setCachedData(cacheKey, transformedScorers);
        return transformedScorers;
        
      case "matches":
        const currentYear = new Date().getFullYear();
        const matchesResponse = await fetchFootballData(
          '/fixtures',
          { 
            league: queryParams.league || '39',
            season: queryParams.season || SEASON,
            status: 'FT',
            from: `${currentYear}-01-01`,
            to: `${currentYear}-12-31`
          }
        );
        
        if (!matchesResponse.data?.response?.length) {
          throw new Error(`No matches found for the specified period. Try a different timeframe or league.`);
        }
        
        const transformedMatches = matchesResponse.data.response.map((match: any) => ({
          id: match.fixture.id,
          utcDate: match.fixture.date,
          homeTeam: {
            name: match.teams.home.name
          },
          awayTeam: {
            name: match.teams.away.name
          },
          score: {
            fullTime: {
              home: match.goals.home,
              away: match.goals.away
            }
          }
        }));
        
        setCachedData(cacheKey, transformedMatches);
        return transformedMatches;
        
      case "team":
        if (!queryParams.team) {
          throw new Error("Team ID is required for team information queries.");
        }
        
        const teamResponse = await fetchFootballData(
          '/teams',
          { id: queryParams.team }
        );
        
        if (!teamResponse.data?.response?.[0]) {
          throw new Error(`Team information not found. Please check the team ID and try again.`);
        }
        
        const teamData = teamResponse.data.response[0];
        const squadResponse = await fetchFootballData(
          '/players/squads',
          { team: queryParams.team }
        );
        
        const squad = squadResponse.data?.response?.[0]?.players || [];
        const transformedTeam = {
          id: teamData.team.id,
          name: teamData.team.name,
          venue: teamData.venue.name,
          clubColors: teamData.team.colors?.player || 'Not available',
          founded: teamData.team.founded,
          squad: squad.map((player: any) => ({
            id: player.id,
            name: player.name,
            position: player.position
          }))
        };
        
        setCachedData(cacheKey, transformedTeam);
        return transformedTeam;
        
      case "competitions":
        const competitionsResponse = await fetchFootballData('/leagues');
        
        if (!competitionsResponse.data?.response?.length) {
          throw new Error("Unable to fetch competitions list. Please try again later.");
        }
        
        const transformedCompetitions = competitionsResponse.data.response.map((comp: any) => ({
          id: comp.league.id,
          name: comp.league.name,
          area: {
            name: comp.country.name
          }
        }));
        
        setCachedData(cacheKey, transformedCompetitions);
        return transformedCompetitions;
        
      default:
        throw new Error("Invalid query type. Please try asking about standings, top scorers, matches, teams, or competitions.");
    }
  } catch (error) {
    console.error('Error in getFootballData:', error);
    throw error;
  }
};

export { processQuery };