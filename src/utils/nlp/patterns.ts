export const seasonPatterns = {
  fullYear: /\b20\d{2}\b/,
  shortYear: /\b\d{2}\/\d{2}\b/,
  hyphenated: /\b\d{2}-\d{2}\b/,
  thisSeasonPattern: /(this|current)\s+season/i,
  lastSeasonPattern: /last\s+season/i
} as const;

export const queryPatterns = {
  standings: /\b(table|standings?|positions?|rankings?)\b/i,
  scorers: /\b(top\s+scorers?|goals?|scorers?|goal\s+scorers?)\b/i,
  matches: /\b(match(es)?|fixtures?|results?|games?)\b/i,
  team: /\b(teams?|squads?|players?|rosters?)\b/i,
  competitions: /\b(competitions?|leagues?|tournaments?)\b/i
} as const;

export type QueryType = keyof typeof queryPatterns;