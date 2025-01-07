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
        { name: 'הלנד', goals: 20 },
        { name: 'קיין', goals: 18 },
        { name: 'סלאח', goals: 15 },
        { name: 'סון', goals: 13 },
        { name: 'ווטקינס', goals: 12 },
      ]);
      
      toast({
        title: "השאילתה בוצעה בהצלחה",
        description: "מציג תוצאות עבור: " + query,
      });
    } catch (err) {
      setError("השאילתה נכשלה. אנא נסה שוב.");
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "השאילתה נכשלה. אנא נסה שוב.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-secondary">מחקר סטטיסטיקות כדורגל</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            שאל שאלות על סטטיסטיקות כדורגל בשפה טבעית וצפה בתוצאות מוויזואליות
          </p>
        </div>

        <QueryInput onSubmit={handleQuery} isLoading={isLoading} />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-primary">טוען תוצאות...</div>
          </div>
        ) : (
          <ResultsDisplay data={data} error={error} />
        )}
      </div>
    </div>
  );
};

export default Index;