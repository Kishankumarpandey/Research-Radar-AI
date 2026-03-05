import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface TopicRadarProps {
  keywords: string[];
  trendScore: number;
}

export function TopicRadar({ keywords, trendScore }: TopicRadarProps) {
  if (!keywords || keywords.length === 0) return null;

  // Generate synthetic data centered around the trend score to make a visually appealing chart
  // This simulates different dimensions of the topic (e.g. relevance, momentum, impact)
  const data = keywords.slice(0, 6).map((keyword, i) => {
    // Generate a pseudo-random value that looks related to the trend score
    const variance = Math.sin(i * 45) * 20; 
    const score = Math.max(30, Math.min(100, trendScore + variance));
    
    return {
      subject: keyword.length > 15 ? keyword.substring(0, 12) + '...' : keyword,
      A: Math.round(score),
      fullMark: 100,
    };
  });

  // Ensure we have at least 3 points for a polygon
  while (data.length < 3) {
    data.push({ subject: `Dim ${data.length + 1}`, A: Math.round(trendScore), fullMark: 100 });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-2xl p-6 flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M50 10V90M10 50H90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          Topic Momentum Map
        </h3>
        <p className="text-sm text-muted-foreground">Multidimensional keyword resonance</p>
      </div>

      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "var(--font-mono)" }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Momentum"
              dataKey="A"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.3}
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px'
              }}
              itemStyle={{ color: 'hsl(var(--accent))' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
