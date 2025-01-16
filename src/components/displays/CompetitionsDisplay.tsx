import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Competition } from '@/types/football';

interface CompetitionsDisplayProps {
  data: Competition[];
}

const CompetitionsDisplay = ({ data }: CompetitionsDisplayProps) => {
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
};

export default CompetitionsDisplay;