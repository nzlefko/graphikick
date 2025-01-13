import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { language } from '@/types/football';

interface HeaderProps {
  language: language;
  toggleLanguage: () => void;
}

const Header = ({ language, toggleLanguage }: HeaderProps) => {
  return (
    <>
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
        <h1 className="text-4xl font-bold text-white">
          {language === 'he' ? "גרפיקיק" : "GraphiKick"}
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          {language === 'he' 
            ? "שאל שאלות על סטטיסטיקות כדורגל בשפה טבעית וצפה בתוצאות"
            : "Ask questions about football statistics in natural language and view results"}
        </p>
      </div>
    </>
  );
};

export default Header;