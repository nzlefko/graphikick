import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsDisplayProps {
  data: any[] | null;
  error: string | null;
  language: 'he' | 'en';
}

const ResultsDisplay = ({ data, error, language }: ResultsDisplayProps) => {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg animate-fade-in">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Helper function to determine data type
  const getDataType = (data: any[]) => {
    if (data.length === 0) return 'empty';
    const firstItem = data[0];
    
    if ('position' in firstItem && 'points' in firstItem) return 'standings';
    if ('goals' in firstItem && 'player' in firstItem) return 'scorers';
    if ('homeTeam' in firstItem && 'awayTeam' in firstItem) return 'matches';
    if ('name' in firstItem && 'area' in firstItem) return 'competitions';
    if ('squad' in firstItem) return 'team';
    
    return 'unknown';
  };

  const dataType = getDataType(data);

  switch (dataType) {
    case 'standings':
      return (
        <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">
            {language === 'he' ? "טבלת הליגה" : "League Table"}
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>{language === 'he' ? "קבוצה" : "Team"}</TableHead>
                <TableHead className="text-center">{language === 'he' ? "משחקים" : "MP"}</TableHead>
                <TableHead className="text-center">{language === 'he' ? "נצחונות" : "W"}</TableHead>
                <TableHead className="text-center">{language === 'he' ? "תיקו" : "D"}</TableHead>
                <TableHead className="text-center">{language === 'he' ? "הפסדים" : "L"}</TableHead>
                <TableHead className="text-center">{language === 'he' ? "שערי זכות" : "GF"}</TableHead>
                <TableHead className="text-center">{language === 'he' ? "שערי חובה" : "GA"}</TableHead>
                <TableHead className="text-center">{language === 'he' ? "נקודות" : "Pts"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((team) => (
                <TableRow key={team.team.id}>
                  <TableCell className="font-medium">{team.position}</TableCell>
                  <TableCell>{team.team.name}</TableCell>
                  <TableCell className="text-center">{team.playedGames}</TableCell>
                  <TableCell className="text-center">{team.won}</TableCell>
                  <TableCell className="text-center">{team.draw}</TableCell>
                  <TableCell className="text-center">{team.lost}</TableCell>
                  <TableCell className="text-center">{team.goalsFor}</TableCell>
                  <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                  <TableCell className="text-center font-bold">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );

    case 'scorers':
      return (
        <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">
            {language === 'he' ? "מלך השערים" : "Top Scorers"}
          </h3>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.map(scorer => ({
                name: scorer.player.name,
                goals: scorer.goals
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="goals" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );

    case 'matches':
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

    case 'competitions':
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((competition) => (
            <Card key={competition.id}>
              <CardHeader>
                <CardTitle>{competition.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{competition.area.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case 'team':
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
            {data.squad?.map((player: any) => (
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

    case 'empty':
      return (
        <div className="p-4 bg-yellow-50 text-yellow-600 rounded-lg">
          {language === 'he' ? "לא נמצאו תוצאות" : "No results found"}
        </div>
      );

    default:
      return (
        <div className="p-4 bg-red-50 text-red-500 rounded-lg">
          {language === 'he' ? "פורמט נתונים לא מוכר" : "Unknown data format"}
        </div>
      );
  }
};

export default ResultsDisplay;