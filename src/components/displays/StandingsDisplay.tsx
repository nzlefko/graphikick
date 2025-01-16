import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TeamStanding } from '@/types/football';

interface StandingsDisplayProps {
  data: TeamStanding[];
  language: 'he' | 'en';
}

const StandingsDisplay = ({ data, language }: StandingsDisplayProps) => {
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
};

export default StandingsDisplay;