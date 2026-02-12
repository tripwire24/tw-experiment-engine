
import React from 'react';
import { Experiment, STATUS_CONFIG, TYPES, MARKETS } from '../types';

// Simple SVG Pie Chart Component
const PieChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;

  if (total === 0) return <div className="text-slate-600 text-xs text-center py-10 font-mono">NO DATA STREAM</div>;

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative">
         {/* Glow behind chart */}
         <div className="absolute inset-0 rounded-full bg-neon-cyan/5 blur-xl"></div>
         <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90 relative z-10">
          {data.map((slice, i) => {
            if (slice.value === 0) return null;
            const angle = (slice.value / total) * 360;
            const x1 = 50 + 50 * Math.cos(Math.PI * currentAngle / 180);
            const y1 = 50 + 50 * Math.sin(Math.PI * currentAngle / 180);
            const x2 = 50 + 50 * Math.cos(Math.PI * (currentAngle + angle) / 180);
            const y2 = 50 + 50 * Math.sin(Math.PI * (currentAngle + angle) / 180);
            const pathData = total === slice.value 
              ? "M 50 50 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0" 
              : `M 50 50 L ${x1} ${y1} A 50 50 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
            
            const el = <path key={i} d={pathData} fill={slice.color} stroke="#05070d" strokeWidth="2" className="hover:opacity-80 transition-opacity" />;
            currentAngle += angle;
            return el;
          })}
        </svg>
        {/* Inner circle cutout for donut effect */}
        <div className="absolute inset-0 m-auto w-16 h-16 bg-bg-1 rounded-full border border-white/10 flex items-center justify-center">
            <span className="text-[10px] text-slate-500">TYPE</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((slice, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-sm shadow-[0_0_5px_currentColor]" style={{ backgroundColor: slice.color }}></span>
            <span className="text-slate-400 font-mono uppercase text-[10px]">{slice.label}</span>
            <span className="font-bold text-white ml-auto">{Math.round((slice.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple SVG Bar Chart Component
const BarChart = ({ data, color }: { data: { label: string, value: number }[], color: string }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="flex items-end gap-2 h-40 pt-4 pb-6 w-full px-2">
      {data.map((bar, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
           <div className="relative w-full flex items-end justify-center h-full border-b border-white/10">
             <div 
                className={`w-full max-w-[30px] rounded-t-sm transition-all duration-500 ${color} opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_15px_currentColor]`}
                style={{ height: `${(bar.value / max) * 100}%` }}
             >
             </div>
             <span className="absolute -top-6 text-[10px] font-bold text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity font-mono">
               {bar.value}
             </span>
           </div>
           <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider truncate w-full text-center mt-2 group-hover:text-white transition-colors" title={bar.label}>
             {bar.label}
           </span>
        </div>
      ))}
    </div>
  );
};

const KPICard = ({ label, value, colorClass }: { label: string, value: string | number, colorClass: string }) => (
  <div className="tron-panel p-5 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity ${colorClass.replace('text-', 'text-opacity-50 ')}`}>
       {/* Decorative shape */}
       <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
         <path d="M20 0L40 20L20 40L0 20L20 0Z" />
       </svg>
    </div>
    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">{label}</h3>
    <p className={`text-3xl font-bold font-mono ${colorClass} drop-shadow-sm`}>{value}</p>
  </div>
);

export const AnalyticsView: React.FC<{ experiments: Experiment[] }> = ({ experiments }) => {
  const activeExperiments = experiments.filter(e => !e.archived);
  const completedCount = experiments.filter(e => e.status === 'complete' || e.status === 'learnings').length;
  
  // Calculate average of averages: ((I+C+E)/3 + (I+C+E)/3 ...) / N
  const avgIce = activeExperiments.length > 0 
    ? (activeExperiments.reduce((acc, curr) => acc + ((curr.ice_impact + curr.ice_confidence + curr.ice_ease) / 3), 0) / activeExperiments.length).toFixed(1)
    : '0.0';

  // Data for Charts (Neon Palette)
  const typeData = TYPES.map(t => ({
    label: t,
    value: activeExperiments.filter(e => e.type === t).length,
    color: t === 'Acquisition' ? '#00f0ff' : t === 'Retention' ? '#4dffb5' : t === 'Monetization' ? '#ffaa00' : '#b14cff'
  }));

  const marketData = MARKETS.map(m => ({
    label: m,
    value: activeExperiments.filter(e => e.market === m).length
  }));

  const statusData = Object.keys(STATUS_CONFIG).map(s => ({
    label: STATUS_CONFIG[s as any].label,
    value: activeExperiments.filter(e => e.status === s).length
  }));

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Active Nodes" value={activeExperiments.length} colorClass="text-white" />
          <KPICard label="Archived" value={completedCount} colorClass="text-slate-400" />
          <KPICard label="Avg ICE Score" value={avgIce} colorClass="text-neon-cyan" />
          <KPICard label="Velocity" value="4.2" colorClass="text-neon-green" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="tron-panel p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Distribution by Type</h3>
            <PieChart data={typeData} />
          </div>

          {/* Market Bar Chart */}
          <div className="tron-panel p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Focus by Market</h3>
            <BarChart data={marketData} color="bg-neon-purple" />
          </div>

          {/* Status Bar Chart */}
          <div className="tron-panel p-6 md:col-span-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Pipeline Health</h3>
            <BarChart data={statusData} color="bg-neon-blue" />
          </div>
        </div>
      </div>
    </div>
  );
};
