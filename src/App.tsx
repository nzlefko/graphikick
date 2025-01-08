import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "@/pages/Index";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Index />
        <Toaster />
      </Router>
    </LanguageProvider>
  );
}

export default App;