import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from '@/types/football';

interface TeamDisplayProps {
  data: Team;
  language: 'he' | 'en';
}

const TeamDisplay = ({ data, language }: TeamDisplayProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>{language === 'he' ? "אצטדיון:" : "Stadium:"}</strong> {data.venue}</p>
            <p><strong>{language === 'he' ? "צבעים:" : "Colors:"}</strong> {data.clubColors}</p>
            <p><strong>{language === 'he' ? "שנת ייסוד:" : "Founded:"}</strong> {data.founded}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.squad?.map((player) => (
          <Card key={player.id}>
            <CardHeader>
              <CardTitle className="text-sm">{player.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{player.position}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamDisplay;