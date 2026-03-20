import React from "react";
import { Download } from "lucide-react";
import type { AnalyzeResponse } from "@/hooks/use-radar";

export function ExportButton({ data, className }: { data: AnalyzeResponse; className?: string }) {
    const handleExport = () => {
        let md = `# Technology Intelligence Report: ${data.query}\n\n`;
        md += `## Future Technology Outlook\n> ${data.futureOutlook || 'Data unavailable.'}\n\n`;

        md += `## Technology Radar\n`;
        const r = data.radar;
        if (r) {
            md += `**Rising**: ${r.rising.join(', ') || 'None'}\n`;
            md += `**Emerging**: ${r.emerging.join(', ') || 'None'}\n`;
            md += `**Stable**: ${r.stable.join(', ') || 'None'}\n`;
            md += `**Declining**: ${r.declining.join(', ') || 'None'}\n\n`;
        }

        if (data.skillRoadmap && data.skillRoadmap.length > 0) {
            md += `## Skill Path for Engineers\n`;
            data.skillRoadmap.forEach((s, i) => {
                md += `### ${i + 1}. ${s.stage}\n`;
                md += `- ${s.skills.join('\n- ')}\n`;
            });
            md += "\n";
        }

        if (data.strategicIntelligence) {
            md += `## Strategic Intelligence\n`;
            md += `### Risk Profile\n`;
            md += `- **Maturity:** ${data.strategicIntelligence.riskProfile.maturity}\n`;
            md += `- **Research Uncertainty:** ${data.strategicIntelligence.riskProfile.uncertainty}\n`;
            md += `- **Market Risk:** ${data.strategicIntelligence.riskProfile.marketRisk}\n\n`;
            md += `### Adoption Timeline\n> ${data.strategicIntelligence.adoptionTimeline}\n\n`;
            md += `### Strategic Recommendations\n`;
            md += `**For Engineers:** ${data.strategicIntelligence.recommendations.engineers}\n\n`;
            md += `**For Startups:** ${data.strategicIntelligence.recommendations.startups}\n\n`;
            md += `**For Investors:** ${data.strategicIntelligence.recommendations.investors}\n\n`;
        }

        if (data.opportunities && data.opportunities.length > 0) {
            md += `## Startup Opportunities\n`;
            data.opportunities.forEach((o: any, i: number) => {
                md += `### Idea ${i + 1}: ${o.idea}\n`;
                md += `**Problem**: ${o.problem}\n`;
                md += `**Solution**: ${o.solution}\n\n`;
            });
        }

        if (data.topLabs || data.topOrgs) {
            md += `## Active Intelligence\n`;
            if (data.topLabs) md += `**Top Research Labs:**\n- ${data.topLabs.join('\n- ')}\n\n`;
            if (data.topOrgs) md += `**Top Open Source Orgs:**\n- ${data.topOrgs.join('\n- ')}\n\n`;
        }

        if (data.competitiveEcosystem) {
            md += `## Competitive Ecosystem\n`;
            md += `**Top Companies:**\n- ${data.competitiveEcosystem.topCompanies.join('\n- ')}\n\n`;
            md += `**Top Startups:**\n- ${data.competitiveEcosystem.topStartups.join('\n- ')}\n\n`;
            md += `**Top Open Source Organizations:**\n- ${data.competitiveEcosystem.topOrgs.join('\n- ')}\n\n`;
        }

        if (data.industrySignals && data.industrySignals.length > 0) {
            md += `## Industry Signals\n`;
            if (data.investmentSignal) md += `**Investment Signal:** ${data.investmentSignal}\n\n`;
            data.industrySignals.forEach((s) => { md += `> ${s}\n\n`; });
        }

        if (data.prototype) {
            md += `## Prototype Architecture (Market Potential: ${data.prototype.marketPotential}/100)\n`;
            md += `**Product Concept:**\n${data.prototype.productConcept}\n\n`;
            md += `**Target Users:**\n${data.prototype.targetUsers}\n\n`;
            md += `**Tech Stack:**\n- ${data.prototype.techStack.join('\n- ')}\n\n`;
            md += `**MVP Roadmap Steps:**\n`;
            data.prototype.mvpSteps.forEach((s, i) => { md += `${i + 1}. ${s}\n`; });
            md += `\n**Architecture Core:**\n${data.prototype.architectureDiagram.join(' -> ')}\n\n`;
        }

        md += `## Timeline Data\n`;
        md += `| Year | Papers | Repos |\n|---|---|---|\n`;
        (data.timeline || []).forEach(t => {
            md += `| ${t.year} | ${t.papers} | ${t.repos} |\n`;
        });

        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.query.toLowerCase().replace(/\s+/g, '-')}-intelligence-report.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleExport}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors font-semibold text-sm text-white ${className}`}
        >
            <Download className="w-4 h-4" /> Export Intelligence Report
        </button>
    );
}
