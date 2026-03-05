import { useState, FormEvent } from "react";
import { Search, ArrowRight, Zap } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isLarge?: boolean;
}

export function SearchBar({ onSearch, initialQuery = "", isLarge = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group z-10">
      <div className={`absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-focus-within:opacity-100 ${isLarge ? 'group-hover:opacity-50' : 'group-hover:opacity-30'}`} />
      
      <div className="relative flex items-center bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 focus-within:border-primary/50 focus-within:box-glow">
        <div className="pl-6 pr-3 text-muted-foreground group-focus-within:text-primary transition-colors">
          {isLarge ? <Zap className="w-6 h-6" /> : <Search className="w-5 h-5" />}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Analyze topics (e.g. 'Large Language Models', 'Quantum Computing')..."
          className={`w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-muted-foreground/60 transition-all ${isLarge ? 'py-6 text-xl' : 'py-4 text-base'}`}
          autoComplete="off"
          spellCheck="false"
        />
        
        <button
          type="submit"
          disabled={query.trim().length < 2}
          className="mr-3 px-4 py-2 bg-white/5 hover:bg-primary text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:hover:bg-white/5 disabled:cursor-not-allowed flex items-center gap-2 group/btn"
        >
          <span className="hidden sm:inline font-semibold">Analyze</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {isLarge && (
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2 text-xs font-mono text-muted-foreground">
          Trending:
          <button type="button" onClick={() => {setQuery("RAG"); onSearch("RAG");}} className="hover:text-primary transition-colors">"RAG"</button>,
          <button type="button" onClick={() => {setQuery("Agentic Workflows"); onSearch("Agentic Workflows");}} className="hover:text-primary transition-colors">"Agentic Workflows"</button>,
          <button type="button" onClick={() => {setQuery("Mamba Architecture"); onSearch("Mamba Architecture");}} className="hover:text-primary transition-colors">"Mamba Architecture"</button>
        </div>
      )}
    </form>
  );
}
