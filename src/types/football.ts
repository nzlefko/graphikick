export interface Player {
  id: number;
  name: string;
  position?: string;
}

export interface Team {
  id: number;
  name: string;
  venue?: string;
  clubColors?: string;
  founded?: number;
  squad?: Player[];
}

export interface TeamStanding {
  position: number;
  team: {
    id: number;
    name: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface TopScorer {
  player: {
    id: number;
    name: string;
  };
  team: {
    id: number;
    name: string;
  };
  goals: number;
}

export interface Match {
  id: number;
  utcDate: string;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface Competition {
  id: number;
  name: string;
  area: {
    name: string;
  };
}