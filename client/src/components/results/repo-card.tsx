import { Github, Star, Code2, ExternalLink } from "lucide-react";

interface RepoProps {
  repo: {
    name: string;
    html_url: string;
    stars: number;
    description: string | null;
  };
}

export function RepoCard({ repo }: RepoProps) {
  // Format stars with 'k' if over 1000
  const formattedStars = repo.stars > 999 
    ? (repo.stars / 1000).toFixed(1) + 'k' 
    : repo.stars.toString();

  return (
    <a 
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="glass-card group block rounded-xl p-5 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="flex items-center gap-2 truncate">
          <Github className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
          <h4 className="font-bold text-base text-white group-hover:text-accent transition-colors truncate">
            {repo.name}
          </h4>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] mb-4">
        {repo.description || "No description provided."}
      </p>

      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-accent font-medium bg-accent/10 px-2 py-1 rounded-md">
          <Star className="w-3.5 h-3.5 fill-accent/40" />
          {formattedStars}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Code2 className="w-3.5 h-3.5" />
          Repository
        </div>
      </div>
    </a>
  );
}
