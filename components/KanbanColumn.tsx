
import React from 'react';
import { Experiment, ExperimentStatus, STATUS_CONFIG } from '../types';
import { ExperimentCard } from './ExperimentCard';
import { Lightbulb, Search, Activity, Flag, BookOpen } from 'lucide-react';

interface KanbanColumnProps {
  status: ExperimentStatus;
  experiments: Experiment[];
  onDrop: (e: React.DragEvent, status: ExperimentStatus) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onCardClick: (experiment: Experiment) => void;
  onArchive: (id: string) => void;
}

const ICONS = {
  idea: Lightbulb,
  hypothesis: Search,
  running: Activity,
  complete: Flag,
  learnings: BookOpen,
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, experiments, onDrop, onDragStart, onCardClick, onArchive }) => {
  const config = STATUS_CONFIG[status];
  const Icon = ICONS[status];
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsOver(false);
    onDrop(e, status);
  };

  return (
    <div 
      className={`flex-1 flex flex-col h-full min-w-[280px] md:min-w-0 border-r border-stroke last:border-r-0 transition-all duration-300 ${isOver ? 'bg-neon-cyan/5 shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className={`p-3 flex flex-col items-center justify-center border-b border-stroke bg-bg-1/40 backdrop-blur-sm`}>
        <div className={`p-2 rounded mb-2 ${config.darkBg} ${config.darkColor} border ${config.darkBorder} shadow-[0_0_10px_inset_currentColor]`}>
          <Icon size={18} />
        </div>
        <h2 className={`font-bold text-xs uppercase tracking-[0.15em] ${config.darkColor} drop-shadow-sm`}>
          {config.label}
        </h2>
        <span className="text-[10px] font-mono text-slate-500 mt-1">{experiments.length} NODES</span>
      </div>

      {/* Droppable Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin">
        {experiments.map(exp => (
          <ExperimentCard 
            key={exp.id} 
            experiment={exp} 
            onDragStart={onDragStart}
            onClick={onCardClick}
            onArchive={onArchive}
          />
        ))}
        {experiments.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center text-slate-700 border border-dashed border-slate-800 rounded-lg m-2 bg-black/20">
            <span className="text-[10px] uppercase tracking-widest opacity-50">Empty Sector</span>
          </div>
        )}
      </div>
    </div>
  );
};
