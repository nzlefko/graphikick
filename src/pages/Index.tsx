import { useState } from "react";
import QueryInput from "@/components/QueryInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample response
      setData([
        { name: 'Haaland', goals: 20 },
        { name: 'Kane', goals: 18 },
        { name: 'Salah', goals: 15 },
        { name: 'Son', goals: 13 },
        { name: 'Watkins', goals: 12 },
      ]);
      
      toast({
        title: "Query processed successfully",
        description: "Displaying results for: " + query,
      });
    } catch (err) {
      setError("Failed to process query. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your query. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-secondary">Football Stats Explorer</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ask questions about football statistics in natural language and see the results visualized
          </p>
        </div>

        <QueryInput onSubmit={handleQuery} isLoading={isLoading} />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-primary">Loading results...</div>
          </div>
        ) : (
          <ResultsDisplay data={data} error={error} />
        )}
      </div>
    </div>
  );
};

export default Index;