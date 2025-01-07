import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const QueryInput = ({ onSubmit, isLoading }: QueryInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto" dir="auto">
      <div className="flex gap-2">
        <Input
          placeholder="שאל על סטטיסטיקות כדורגל (לדוגמה: 'הראה לי את מלך השערים בליגה האנגלית 2023')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-right"
        />
        <Button type="submit" disabled={isLoading}>
          <Search className="w-4 h-4 mr-2" />
          חיפוש
        </Button>
      </div>
    </form>
  );
};

export default QueryInput;