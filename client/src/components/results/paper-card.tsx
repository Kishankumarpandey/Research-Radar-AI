import { FileText, Calendar, ArrowUpRight, Sparkles } from "lucide-react";
import { format, parseISO } from "date-fns";

interface PaperProps {
  paper: {
    id: string;
    title: string;
    summary: string;
    aiSummary?: string;
    published: string;
    link: string;
    impactScore?: number;
  };
}

export function PaperCard({ paper }: PaperProps) {
  // Try to parse the date gracefully
  let formattedDate = paper.published;
  try {
    const date = parseISO(paper.published);
    formattedDate = format(date, 'MMM d, yyyy');
  } catch (e) {
    // Keep original string if parse fails
  }

  return (
    <div className="glass-card group rounded-xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {paper.impactScore !== undefined && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-accent/20 border border-accent/30 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold font-mono text-accent">Impact: {paper.impactScore}</span>
        </div>
      )}

      <div className="flex justify-between items-start gap-4 mb-3 pr-24">
        <h4 className="font-bold text-base leading-tight text-white group-hover:text-primary transition-colors line-clamp-2">
          {paper.title}
        </h4>
        <a
          href={paper.link}
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          title="Open in arXiv"
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="mb-4 flex-1">
        {paper.aiSummary && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> AI Summary
            </p>
            <p className="text-sm text-white/90 leading-relaxed italic">"{paper.aiSummary}"</p>
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {paper.summary}
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground/80 mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          arXiv
        </div>
        <div className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          PDF
        </div>
      </div>
    </div>
  );
}
