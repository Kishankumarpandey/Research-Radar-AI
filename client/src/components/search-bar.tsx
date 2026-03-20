import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react";
import { Search, ArrowRight, Zap, Clock, X, TrendingUp } from "lucide-react";
import { useSearchHistory } from "@/hooks/use-radar";

// ─── Trending Topics ──────────────────────────────────────────────────────────
// Curated hot topics that get updated with emerging tech trends
const TRENDING_TOPICS = [
  "Large Language Models",
  "Quantum Computing",
  "RISC-V Processors",
  "Agentic Workflows",
  "Diffusion Models",
  "Neuromorphic Chips",
];

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isLarge?: boolean;
}

export function SearchBar({ onSearch, initialQuery = "", isLarge = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { history, addToHistory, clearHistory } = useSearchHistory();

  // ─── Keyboard Shortcut: Ctrl+K / Cmd+K to focus search ───────────────────
  useEffect(() => {
    const handleKeydown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      }
      if (e.key === "Escape") {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  // ─── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      addToHistory(trimmed);
      onSearch(trimmed);
      setShowDropdown(false);
    }
  };

  const handleSelectQuery = (q: string) => {
    setQuery(q);
    addToHistory(q);
    onSearch(q);
    setShowDropdown(false);
  };

  // Show dropdown when focused and there's history or query
  const shouldShowDropdown = showDropdown && (history.length > 0 || !query);

  return (
    <div ref={containerRef} className="w-full relative z-20">
      <form onSubmit={handleSubmit} className="w-full relative group">
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-focus-within:opacity-100 ${isLarge ? 'group-hover:opacity-50' : 'group-hover:opacity-30'}`} />

        <div className="relative flex items-center bg-card/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-visible shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-500 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-[0_0_30px_rgba(var(--primary),0.2)]">
          <div className="pl-6 pr-3 text-muted-foreground group-focus-within:text-primary transition-colors shrink-0">
            {isLarge ? <Zap className="w-8 h-8 text-primary/80" /> : <Search className="w-5 h-5" />}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Analyze topics (e.g. 'Large Language Models', 'Quantum Computing')…"
            className={`w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-muted-foreground/40 transition-all font-display ${isLarge ? 'py-8 text-2xl px-2' : 'py-5 text-lg'}`}
            autoComplete="off"
            spellCheck="false"
          />

          {/* Keyboard shortcut badge — shown when not focused */}
          <div className="hidden lg:flex items-center gap-1 mr-3 text-muted-foreground/40 text-xs font-mono shrink-0 group-focus-within:hidden">
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">K</kbd>
          </div>

          <button
            type="submit"
            disabled={query.trim().length < 2}
            className={`mr-4 px-6 py-3 bg-primary/10 hover:bg-primary text-white rounded-xl transition-all duration-300 border border-primary/20 hover:border-primary/50 disabled:opacity-30 disabled:hover:bg-primary/10 disabled:cursor-not-allowed flex items-center gap-2 group/btn shrink-0 ${isLarge ? 'text-lg py-4' : ''}`}
          >
            <span className="hidden sm:inline font-bold uppercase tracking-wider">Analyze</span>
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ─── Search History Dropdown ──────────────────────────────────── */}
        {shouldShowDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            {history.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[10px] text-muted-foreground/50 hover:text-destructive transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                </div>
                {history.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSelectQuery(q)}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Clock className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    {q}
                  </button>
                ))}
                <div className="mx-4 my-2 border-t border-white/5" />
              </div>
            )}

            <div className="px-4 pb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold flex items-center gap-1.5 pb-2">
                <TrendingUp className="w-3 h-3" /> Trending Topics
              </span>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleSelectQuery(topic)}
                    className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-mono hover:bg-primary/20 hover:border-primary/40 transition-all duration-200"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* ─── Trending chips (hero view only) ─────────────────────────────── */}
      {isLarge && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
            Trending Intelligence
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {TRENDING_TOPICS.map((tag, idx) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSelectQuery(tag)}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                style={{ animationDelay: `${idx * 0.8}s` }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
