import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  language: 'he' | 'en';
}

const QueryInput = ({ onSubmit, isLoading, language }: QueryInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const placeholder = language === 'he'
    ? "שאל על סטטיסטיקות כדורגל (לדוגמה: 'הראה לי את מלך השערים בליגה האנגלית 2023')"
    : "Ask about football statistics (e.g., 'Show me the top scorer in English Premier League 2023')";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto" dir={language === 'he' ? "rtl" : "ltr"}>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={language === 'he' ? "text-right" : "text-left"}
        />
        <Button type="submit" disabled={isLoading}>
          <Search className="w-4 h-4 mr-2" />
          {language === 'he' ? "חיפוש" : "Search"}
        </Button>
      </div>
    </form>
  );
};

export default QueryInput;