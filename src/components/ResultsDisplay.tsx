import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultsDisplayProps {
  data: any[] | null;
  error: string | null;
}

const ResultsDisplay = ({ data, error }: ResultsDisplayProps) => {
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

  // For this example, we'll use sample data
  const sampleData = [
    { name: 'Haaland', goals: 20 },
    { name: 'Kane', goals: 18 },
    { name: 'Salah', goals: 15 },
    { name: 'Son', goals: 13 },
    { name: 'Watkins', goals: 12 },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Results Visualization</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
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