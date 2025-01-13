import { useState } from "react";
import QueryInput from "@/components/QueryInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import Header from "@/components/Header";
import VisualizationToggle from "@/components/VisualizationToggle";
import { useToast } from "@/hooks/use-toast";
import { getFootballData, processQuery } from "@/services/footballData";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTextResponse } from "@/utils/formatResponse";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [textResponse, setTextResponse] = useState<string>("");
  const { toast } = useToast();
  const { language, toggleLanguage } = useLanguage();

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setShowVisualization(false);
    setTextResponse("");
    
    try {
      const queryParams = await processQuery(query);
      const results = await getFootballData(queryParams);
      
      if (results) {
        setData(results);
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
    } finally {
      setIsLoading(false);
    }
  };

  const canShowVisualization = data && data.length > 0;

  return (
    <div className="min-h-screen bg-[#9b87f5] py-12 px-4" dir={language === 'he' ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-8">
        <Header language={language} toggleLanguage={toggleLanguage} />
        
        <QueryInput onSubmit={handleQuery} isLoading={isLoading} language={language} />

        {textResponse && (
          <div className="bg-white/90 p-4 rounded-lg shadow-sm animate-fade-in text-center">
            <p className="text-lg text-gray-700">{textResponse}</p>
          </div>
        )}

        {canShowVisualization && !showVisualization && (
          <VisualizationToggle 
            language={language} 
            onToggle={() => setShowVisualization(true)} 
          />
        )}

        {showVisualization && (
          <ResultsDisplay data={data} error={error} language={language} />
        )}
      </div>
    </div>
  );
};

export default Index;