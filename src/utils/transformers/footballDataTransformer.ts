import { Match, TeamStanding, TopScorer, Team, Competition } from '@/types/football';

export class FootballDataTransformer {
  static transformStandings(data: any[]): TeamStanding[] {
    return data.map(standing => ({
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
  }

  static transformScorers(data: any[]): TopScorer[] {
    return data.map(item => ({
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
  }

  static transformMatches(data: any[]): Match[] {
    return data.map(match => ({
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
  }

  static transformTeam(teamData: any, squadData: any[]): Team {
    return {
      id: teamData.team.id,
      name: teamData.team.name,
      venue: teamData.venue.name,
      clubColors: teamData.team.colors?.player || 'Not available',
      founded: teamData.team.founded,
      squad: squadData.map(player => ({
        id: player.id,
        name: player.name,
        position: player.position
      }))
    };
  }

  static transformCompetitions(data: any[]): Competition[] {
    return data.map(comp => ({
      id: comp.league.id,
      name: comp.league.name,
      area: {
        name: comp.country.name
      }
    }));
  }
}