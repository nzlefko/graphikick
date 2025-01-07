export interface Player {
  name: string;
  goals: number;
  team: string;
  position?: string;
}

export interface Team {
  name: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface League {
  name: string;
  season: string;
  teams: Team[];
  topScorers: Player[];
}