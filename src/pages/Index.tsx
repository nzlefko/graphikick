import { useState } from "react";
import QueryInput from "@/components/QueryInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import Header from "@/components/Header";
import VisualizationToggle from "@/components/VisualizationToggle";
import { useToast } from "@/hooks/use-toast";
import { getFootballData, processQuery } from "@/services/footballData";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTextResponse } from "@/utils/formatResponse";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Team, TeamStanding, TopScorer, Match, Competition } from "@/types/football";

type FootballData = Array<Team | TeamStanding | TopScorer | Match | Competition>;

const competitions = [
  { id: '39', name: 'Premier League', country: 'England' },
  { id: '140', name: 'La Liga', country: 'Spain' },
  { id: '78', name: 'Bundesliga', country: 'Germany' },
  { id: '135', name: 'Serie A', country: 'Italy' },
  { id: '61', name: 'Ligue 1', country: 'France' },
  { id: '383', name: 'Ligat ha\'Al', country: 'Israel' },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<FootballData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [textResponse, setTextResponse] = useState<string>("");
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const { toast } = useToast();
  const { language, toggleLanguage } = useLanguage();

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setShowVisualization(false);
    setTextResponse("");
    
    try {
      const queryParams = await processQuery(query);
      // Override the league with the selected competition
      queryParams.league = selectedCompetition || queryParams.league;
      const results = await getFootballData(queryParams);
      
      if (results) {
        setData(results as FootballData);
        const formattedResponse = formatTextResponse(results, queryParams.type, language);
        setTextResponse(formattedResponse);
      } else {
        throw new Error(language === 'he' ? "תוצאות לא תקינות" : "Invalid results");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 
        language === 'he' ? "השאילתה נכשלה. אנא נסה שוב." : "Query failed. Please try again.";
      setError(errorMessage);
      setTextResponse(errorMessage);
      toast({
        variant: "destructive",
        title: language === 'he' ? "שגיאה" : "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompetitionSelect = (competitionId: string) => {
    setSelectedCompetition(competitionId);
    setData(null);
    setError(null);
    setTextResponse("");
    setShowVisualization(false);
  };

  return (
    <div className="min-h-screen bg-[#9b87f5] py-12 px-4" dir={language === 'he' ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-8">
        <Header language={language} toggleLanguage={toggleLanguage} />
        
        {!selectedCompetition ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-white mb-8">
              {language === 'he' ? "בחר ליגה" : "Select a Competition"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitions.map((competition) => (
                <Card 
                  key={competition.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleCompetitionSelect(competition.id)}
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg">{competition.name}</h3>
                    <p className="text-gray-500">{competition.country}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCompetition(null)}
                className="mb-4"
              >
                {language === 'he' ? "חזור לבחירת ליגה" : "Back to Competition Selection"}
              </Button>
              <p className="text-white font-semibold">
                {competitions.find(c => c.id === selectedCompetition)?.name}
              </p>
            </div>

            <QueryInput onSubmit={handleQuery} isLoading={isLoading} language={language} />

            {textResponse && (
              <div className="bg-white/90 p-4 rounded-lg shadow-sm animate-fade-in text-center">
                <p className="text-lg text-gray-700">{textResponse}</p>
              </div>
            )}

            {data && !showVisualization && (
              <VisualizationToggle 
                language={language} 
                onToggle={() => setShowVisualization(true)} 
              />
            )}

            {showVisualization && (
              <ResultsDisplay data={data} error={error} language={language} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;