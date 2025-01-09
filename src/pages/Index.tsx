import { useState } from "react";
import QueryInput from "@/components/QueryInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useToast } from "@/hooks/use-toast";
import { parseQuery, getFootballData } from "@/services/footballData";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { language, toggleLanguage } = useLanguage();

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = parseQuery(query, language);
      const results = await getFootballData(queryParams);
      
      if (results) {
        setData(results);
        toast({
          title: language === 'he' ? "השאילתה בוצעה בהצלחה" : "Query executed successfully",
          description: language === 'he' ? "מציג תוצאות עבור: " + query : "Showing results for: " + query,
        });
      } else {
        throw new Error(language === 'he' ? "תוצאות לא תקינות" : "Invalid results");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : language === 'he' ? "השאילתה נכשלה. אנא נסה שוב." : "Query failed. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: language === 'he' ? "שגיאה" : "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir={language === 'he' ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-end mb-4">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'he' ? 'English' : 'עברית'}
          </Button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-secondary">
            {language === 'he' ? "מחקר סטטיסטיקות כדורגל" : "Football Statistics Research"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'he' 
              ? "שאל שאלות על סטטיסטיקות כדורגל בשפה טבעית וצפה בתוצאות מוויזואליות"
              : "Ask questions about football statistics in natural language and view visual results"}
          </p>
        </div>

        <QueryInput onSubmit={handleQuery} isLoading={isLoading} language={language} />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-primary">
              {language === 'he' ? "טוען תוצאות..." : "Loading results..."}
            </div>
          </div>
        ) : (
          <ResultsDisplay data={data} error={error} language={language} />
        )}
      </div>
    </div>
  );
};

export default Index;