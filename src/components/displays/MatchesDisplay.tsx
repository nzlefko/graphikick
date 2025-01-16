import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Match } from '@/types/football';

interface MatchesDisplayProps {
  data: Match[];
}

const MatchesDisplay = ({ data }: MatchesDisplayProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((match) => (
        <Card key={match.id}>
          <CardHeader>
            <CardTitle className="text-sm">
              {new Date(match.utcDate).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{match.homeTeam.name}</span>
                <span>{match.score.fullTime.home ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span>{match.awayTeam.name}</span>
                <span>{match.score.fullTime.away ?? '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatchesDisplay;