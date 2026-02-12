
import React from 'react';
import { Experiment, STATUS_CONFIG, RESULT_CONFIG } from '../types';
import { ICEBadge } from './ICEBadge';
import { Archive, Lock, Activity, Target } from 'lucide-react';

// --- Sub-components ---

const CardHeader: React.FC<{ title: string; result: Experiment['result']; locked: boolean }> = ({ title, result, locked }) => {
  return (
    <div className="flex justify-between items-start mb-2 group cursor-grab active:cursor-grabbing relative z-10">
      <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 pr-1 drop-shadow-sm">{title}</h3>
      <div className="flex items-start gap-1">
        {locked && <Lock size={12} className="text-slate-500 mt-0.5" />}
        {result && (
          <span className={`shrink-0 ml-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border ${RESULT_CONFIG[result].bg} ${RESULT_CONFIG[result].color} ${RESULT_CONFIG[result].border} shadow-[0_0_10px_currentColor] opacity-90`}>
            {RESULT_CONFIG[result].label}
          </span>
        )}
      </div>
    </div>
  );
};

const CardContent: React.FC<{ description: string; market: string; type: string; tags: string[] }> = ({ description, market, type, tags }) => (
  <div className="mb-3 relative z-10">
    <p className="text-xs text-slate-400 line-clamp-2 mb-2 min-h-[2.5em] font-light">{description}</p>
    <div className="flex flex-wrap gap-1 mb-2">
      <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[9px] uppercase tracking-wider rounded border border-slate-700 flex items-center gap-1">
        <Target size={8} className="text-neon-blue" /> {market}
      </span>
      <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[9px] uppercase tracking-wider rounded border border-slate-700 flex items-center gap-1">
        <Activity size={8} className="text-neon-purple" /> {type}
      </span>
    </div>
    {tags.length > 0 && (
       <div className="flex flex-wrap gap-1">
         {tags.slice(0, 3).map(tag => (
           <span key={tag} className="text-[9px] text-neon-cyan/80 font-mono px-1 rounded">
             #{tag}
           </span>
         ))}
         {tags.length > 3 && (
            <span className="text-[9px] text-slate-500 px-1">+{tags.length - 3}</span>
         )}
       </div>
    )}
  </div>
);

const CardMetrics: React.FC<{ impact: number; confidence: number; ease: number; owner: string }> = ({ impact, confidence, ease, owner }) => {
  // Get initials
  const initials = owner.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-auto relative z-10">
      <ICEBadge impact={impact} confidence={confidence} ease={ease} />
      
      <div className="flex items-center gap-1.5" title={`Owner: ${owner}`}>
        <div className="w-5 h-5 rounded bg-slate-800 text-neon-blue flex items-center justify-center text-[9px] font-bold border border-slate-700 shadow-[0_0_5px_rgba(42,123,255,0.2)]">
          {initials}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

interface ExperimentCardProps {
  experiment: Experiment;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: (experiment: Experiment) => void;
  onArchive: (id: string) => void;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment, onDragStart, onClick, onArchive }) => {
  // Determine border color based on result if complete/learnings
  let borderClass = 'border-stroke'; // Default cyan stroke
  
  if ((experiment.status === 'complete' || experiment.status === 'learnings') && experiment.result) {
    if (experiment.result === 'won') borderClass = 'border-neon-green/50 shadow-[0_0_15px_rgba(77,255,181,0.15)]';
    else if (experiment.result === 'lost') borderClass = 'border-neon-red/50';
  }

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, experiment.id)}
      onClick={() => onClick(experiment)}
      className={`relative group tron-panel tron-sheen p-3 flex flex-col active:scale-[0.98] select-none ${borderClass} hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300`}
    >
      <CardHeader title={experiment.title} result={experiment.result} locked={experiment.locked} />
      <CardContent 
        description={experiment.description} 
        market={experiment.market} 
        type={experiment.type} 
        tags={experiment.tags}
      />
      <CardMetrics 
        impact={experiment.ice_impact} 
        confidence={experiment.ice_confidence} 
        ease={experiment.ice_ease} 
        owner={experiment.owner}
      />
      
      {experiment.status === 'learnings' && !experiment.locked && !experiment.archived && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onArchive(experiment.id);
          }}
          className="absolute -top-2 -right-2 bg-black border border-neon-orange text-neon-orange p-1.5 rounded shadow-lg shadow-neon-orange/20 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
          title="Archive to Vault"
        >
          <Archive size={14} />
        </button>
      )}
    </div>
  );
};
