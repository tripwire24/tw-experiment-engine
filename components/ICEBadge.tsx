
import React from 'react';

interface ICEBadgeProps {
  impact: number;
  confidence: number;
  ease: number;
}

export const ICEBadge: React.FC<ICEBadgeProps> = ({ impact, confidence, ease }) => {
  // Using Average (I+C+E)/3 for a 1-10 scale score
  const score = (impact + confidence + ease) / 3;
  const formattedScore = score.toFixed(1);
  
  // Neon Color coding
  let bgClass = 'bg-slate-800 text-slate-400 border-slate-700';
  
  if (score >= 8) bgClass = 'bg-neon-green/10 text-neon-green border-neon-green/30 shadow-[0_0_8px_rgba(77,255,181,0.2)] font-bold';
  else if (score >= 6) bgClass = 'bg-neon-blue/10 text-neon-blue border-neon-blue/30';
  else if (score >= 4) bgClass = 'bg-neon-orange/10 text-neon-orange border-neon-orange/30';

  return (
    <div className={`flex items-center gap-2 px-2 py-0.5 rounded text-[10px] border ${bgClass}`} title={`Impact: ${impact}, Confidence: ${confidence}, Ease: ${ease}`}>
      <span className="uppercase tracking-widest opacity-70 font-bold">ICE</span>
      <span className="font-mono">{formattedScore}</span>
    </div>
  );
};
