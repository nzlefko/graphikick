import { useState } from "react";
import QueryInput from "@/components/QueryInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useToast } from "@/hooks/use-toast";
import { getFootballData, processQuery } from "@/services/footballData";
import { Button } from "@/components/ui/button";
import { Languages, LineChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const { toast } = useToast();
  const { language, toggleLanguage } = useLanguage();

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setShowVisualization(false);
    
    try {
      const queryParams = await processQuery(query);
      const results = await getFootballData(queryParams);
      
      if (results) {
        setData(results);
        // Show text response first
        toast({
          title: language === 'he' ? "התקבלה תשובה" : "Answer received",
          description: formatTextResponse(results, queryParams.type),
        });
      } else {
        throw new Error(language === 'he' ? "תוצאות לא תקינות" : "Invalid results");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 
        language === 'he' ? "השאילתה נכשלה. אנא נסה שוב." : "Query failed. Please try again.";
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

  const formatTextResponse = (data: any[], type: string): string => {
    if (!Array.isArray(data) || data.length === 0) {
      return language === 'he' ? "לא נמצאו תוצאות" : "No results found";
    }

    switch (type) {
      case 'standings':
        const topTeam = data[0];
        return language === 'he' 
          ? `${topTeam.team.name} מובילה את הטבלה עם ${topTeam.points} נקודות`
          : `${topTeam.team.name} leads the table with ${topTeam.points} points`;
      
      case 'scorers':
        const topScorer = data[0];
        return language === 'he'
          ? `${topScorer.player.name} הוא מלך השערים עם ${topScorer.goals} שערים`
          : `${topScorer.player.name} is the top scorer with ${topScorer.goals} goals`;
      
      case 'matches':
        const recentMatch = data[0];
        return language === 'he'
          ? `המשחק האחרון: ${recentMatch.homeTeam.name} ${recentMatch.score.fullTime.home ?? '-'} - ${recentMatch.score.fullTime.away ?? '-'} ${recentMatch.awayTeam.name}`
          : `Latest match: ${recentMatch.homeTeam.name} ${recentMatch.score.fullTime.home ?? '-'} - ${recentMatch.score.fullTime.away ?? '-'} ${recentMatch.awayTeam.name}`;
      
      default:
        return language === 'he' ? "התקבלו תוצאות" : "Results received";
    }
  };

  const canShowVisualization = data && data.length > 0;

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
              ? "שאל שאלות על סטטיסטיקות כדורגל בשפה טבעית וצפה בתוצאות"
              : "Ask questions about football statistics in natural language and view results"}
          </p>
        </div>

        <QueryInput onSubmit={handleQuery} isLoading={isLoading} language={language} />

        {canShowVisualization && !showVisualization && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setShowVisualization(true)}
              variant="outline"
              className="gap-2"
            >
              <LineChart className="h-4 w-4" />
              {language === 'he' ? "הצג ויזואליזציה" : "Show Visualization"}
            </Button>
          </div>
        )}

        {showVisualization && (
          <ResultsDisplay data={data} error={error} language={language} />
        )}
      </div>
    </div>
  );
};

export default Index;