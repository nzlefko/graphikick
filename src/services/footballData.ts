import { parseQuery } from '@/utils/queryParser';
import { fetchFootballData } from './api';

export { parseQuery };

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
          `/competitions/${queryParams.league}/standings${queryParams.season ? `?season=${queryParams.season}` : ''}`
        );
        return standingsResponse.data?.standings?.[0]?.table || [];
        
      case "scorers":
        const scorersResponse = await fetchFootballData(
          `/competitions/${queryParams.league}/scorers${queryParams.season ? `?season=${queryParams.season}` : ''}`
        );
        return scorersResponse.data?.scorers || [];
        
      case "matches":
        const matchesResponse = await fetchFootballData(
          `/competitions/${queryParams.league}/matches${queryParams.season ? `?season=${queryParams.season}` : ''}`
        );
        return matchesResponse.data?.matches || [];
        
      case "team":
        const teamResponse = await fetchFootballData(
          `/teams/${queryParams.team}`
        );
        return teamResponse.data || null;
        
      case "competitions":
        const competitionsResponse = await fetchFootballData(
          '/competitions'
        );
        return competitionsResponse.data?.competitions || [];
        
      default:
        throw new Error("Invalid query type");
    }
  } catch (error) {
    console.error('Error in getFootballData:', error);
    throw error;
  }
};