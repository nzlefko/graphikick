import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TopScorer } from '@/types/football';

interface ScorersDisplayProps {
  data: TopScorer[];
  language: 'he' | 'en';
}

const ScorersDisplay = ({ data, language }: ScorersDisplayProps) => {
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
};

export default ScorersDisplay;