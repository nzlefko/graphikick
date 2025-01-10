import { supabase } from "@/integrations/supabase/client";

interface FootballResponse {
  data: any;
  error?: string;
}

export const fetchFootballData = async (endpoint: string): Promise<FootballResponse> => {
  try {
    console.log('Fetching football data for endpoint:', endpoint);
    
    const { data, error } = await supabase.functions.invoke('football-api', {
      body: { endpoint },
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error('No data received from API');
      throw new Error('No data received from API');
    }

    console.log('Received data:', data);
    return { data: data.data };
  } catch (error) {
    console.error('Error fetching football data:', error);
    throw error;
  }
};