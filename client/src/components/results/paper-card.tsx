import { FileText, Calendar, ArrowUpRight } from "lucide-react";
import { format, parseISO } from "date-fns";

interface PaperProps {
  paper: {
    id: string;
    title: string;
    summary: string;
    published: string;
    link: string;
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
      
      <div className="flex justify-between items-start gap-4 mb-3">
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

      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
        {paper.summary}
      </p>

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
