import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  // Check if data is standings (has points property)
  const isStandings = data.length > 0 && 'points' in data[0];

  if (isStandings) {
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
            {data.map((team, index) => (
              <TableRow key={team.name}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell className="text-center">{team.played}</TableCell>
                <TableCell className="text-center">{team.won}</TableCell>
                <TableCell className="text-center">{team.drawn}</TableCell>
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
  }

  // For other types of data (like top scorers), show the line chart
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">
        {language === 'he' ? "ויזואליזציית תוצאות" : "Results Visualization"}
      </h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
};

export default ResultsDisplay;