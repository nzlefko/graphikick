import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import { language } from '@/types/football';

interface VisualizationToggleProps {
  language: language;
  onToggle: () => void;
}

const VisualizationToggle = ({ language, onToggle }: VisualizationToggleProps) => {
  return (
    <div className="flex justify-center mt-4">
      <Button
        onClick={onToggle}
        variant="outline"
        className="gap-2 bg-white/90 hover:bg-white"
      >
        <LineChart className="h-4 w-4" />
        {language === 'he' ? "הצג ויזואליזציה" : "Show Visualization"}
      </Button>
    </div>
  );
};

export default VisualizationToggle;