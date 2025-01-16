import { processQuery } from '@/utils/nlpProcessor';
import { fetchFootballData } from './api';

const SEASON = '2023';

export const getFootballData = async (queryParams: { 
  type: string; 
  league?: string; 
  season?: string;
  team?: string;
}) => {
  try {
    console.log('Getting football data with params:', queryParams);
    
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
        const standings = standingsResponse.data?.response?.[0]?.league?.standings?.[0] || [];
        console.log('Extracted standings:', standings);
        
        return standings.map((standing: any) => ({
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
        
      case "scorers":
        const scorersResponse = await fetchFootballData(
          '/players/topscorers',
          { 
            league: queryParams.league || '39',
            season: queryParams.season || SEASON
          }
        );
        return scorersResponse.data?.response?.map((item: any) => ({
          player: {
            id: item.player.id,
            name: item.player.name
          },
          team: {
            id: item.statistics[0].team.id,
            name: item.statistics[0].team.name
          },
          goals: item.statistics[0].goals.total
        })) || [];
        
      case "matches":
        const matchesResponse = await fetchFootballData(
          '/fixtures',
          { 
            league: queryParams.league || '39',
            season: queryParams.season || SEASON,
            status: 'FT',  // Only get finished matches
            from: '2024-01-01',  // Get matches from start of 2024
            to: '2024-12-31'     // Until end of 2024
          }
        );
        return matchesResponse.data?.response?.map((match: any) => ({
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
        })) || [];
        
      case "team":
        const teamResponse = await fetchFootballData(
          '/teams',
          { 
            id: queryParams.team
          }
        );
        const teamData = teamResponse.data?.response?.[0];
        if (!teamData) return null;
        
        // Get team squad
        const squadResponse = await fetchFootballData(
          '/players/squads',
          { team: queryParams.team }
        );
        const squad = squadResponse.data?.response?.[0]?.players || [];
        
        return {
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
        
      case "competitions":
        const competitionsResponse = await fetchFootballData(
          '/leagues'
        );
        return competitionsResponse.data?.response?.map((comp: any) => ({
          id: comp.league.id,
          name: comp.league.name,
          area: {
            name: comp.country.name
          }
        })) || [];
        
      default:
        throw new Error("Invalid query type");
    }
  } catch (error) {
    console.error('Error in getFootballData:', error);
    throw error;
  }
};

export { processQuery };