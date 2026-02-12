
import React, { useState, useMemo } from 'react';
import { Experiment, MARKETS, TYPES, STATUS_CONFIG, ExperimentStatus, RESULT_CONFIG } from '../types';
import { ICEBadge } from './ICEBadge';
import { Search, Lock, Trash2, Filter, SlidersHorizontal } from 'lucide-react';

interface VaultTableProps {
  experiments: Experiment[];
  onEdit: (experiment: Experiment) => void;
  onDelete: (id: string) => void;
}

export const VaultTable: React.FC<VaultTableProps> = ({ experiments, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredExperiments = useMemo(() => {
    return experiments.filter(exp => {
      const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
      const matchesResult = resultFilter === 'all' || (resultFilter === 'pending' ? !exp.result : exp.result === resultFilter);
      const matchesMarket = marketFilter === 'all' || exp.market === marketFilter;
      const matchesType = typeFilter === 'all' || exp.type === typeFilter;
      return matchesSearch && matchesStatus && matchesResult && matchesMarket && matchesType;
    });
  }, [experiments, searchTerm, statusFilter, resultFilter, marketFilter, typeFilter]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Permanently delete data node?")) {
        onDelete(id);
    }
  };

  const SelectFilter = ({ value, onChange, options, label }: any) => (
    <div className="relative group">
       <select 
        className="appearance-none pl-3 pr-8 py-2 rounded bg-black/40 border border-stroke text-xs text-slate-300 focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] outline-none cursor-pointer hover:bg-white/5 transition-all w-full md:w-auto min-w-[120px]"
        value={value}
        onChange={onChange}
      >
        <option value="all" className="bg-bg-0 text-slate-400">All {label}</option>
        {options.map((o: any) => (
          <option key={o.value} value={o.value} className="bg-bg-0 text-white">{o.label}</option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <SlidersHorizontal size={12} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full tron-panel overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-stroke flex flex-col md:flex-row gap-4 items-center justify-between bg-black/20">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-cyan transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search database..." 
            className="w-full pl-9 pr-4 py-2 rounded bg-black/40 border border-stroke focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] outline-none text-sm text-white placeholder-slate-600 transition-all font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center">
          <Filter size={16} className="text-neon-blue mr-2 shrink-0" />
          <SelectFilter 
             value={statusFilter} 
             onChange={(e: any) => setStatusFilter(e.target.value)} 
             label="Status"
             options={Object.keys(STATUS_CONFIG).map(s => ({ value: s, label: STATUS_CONFIG[s as ExperimentStatus].label }))}
          />
           <SelectFilter 
             value={resultFilter} 
             onChange={(e: any) => setResultFilter(e.target.value)} 
             label="Outcomes"
             options={[
               {value: 'pending', label: 'Pending'},
               ...Object.keys(RESULT_CONFIG).map(r => ({ value: r, label: RESULT_CONFIG[r].label }))
             ]}
          />
          <SelectFilter 
             value={marketFilter} 
             onChange={(e: any) => setMarketFilter(e.target.value)} 
             label="Markets"
             options={MARKETS.map(m => ({ value: m, label: m }))}
          />
          <SelectFilter 
             value={typeFilter} 
             onChange={(e: any) => setTypeFilter(e.target.value)} 
             label="Types"
             options={TYPES.map(t => ({ value: t, label: t }))}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-black/10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/40 sticky top-0 z-10 text-[10px] font-bold text-neon-cyan uppercase tracking-[0.1em] shadow-sm backdrop-blur-sm">
            <tr>
              <th className="px-6 py-4 border-b border-stroke">Title</th>
              <th className="px-6 py-4 border-b border-stroke">Status</th>
              <th className="px-6 py-4 border-b border-stroke">Outcome</th>
              <th className="px-6 py-4 border-b border-stroke">ICE Score</th>
              <th className="px-6 py-4 border-b border-stroke">Market</th>
              <th className="px-6 py-4 border-b border-stroke">Type</th>
              <th className="px-6 py-4 border-b border-stroke text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-300">
            {filteredExperiments.map(exp => (
              <tr key={exp.id} className={`hover:bg-neon-cyan/5 transition-colors group ${exp.archived ? 'opacity-50 grayscale' : ''}`}>
                <td className="px-6 py-3 font-medium text-white group-hover:text-neon-cyan transition-colors">
                  <div className="flex items-center gap-2">
                    {exp.title}
                    {exp.locked && <Lock size={12} className="text-slate-500" />}
                    {exp.archived && <span className="text-[9px] uppercase border border-slate-700 text-slate-500 px-1.5 py-0.5 rounded">Archived</span>}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wide font-bold border ${STATUS_CONFIG[exp.status].darkBg} ${STATUS_CONFIG[exp.status].darkColor} ${STATUS_CONFIG[exp.status].darkBorder}`}>
                    {STATUS_CONFIG[exp.status].label}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {exp.result ? (
                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wide font-bold border ${RESULT_CONFIG[exp.result].bg} ${RESULT_CONFIG[exp.result].color} ${RESULT_CONFIG[exp.result].border}`}>
                      {RESULT_CONFIG[exp.result].label}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs font-mono">--</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <ICEBadge impact={exp.ice_impact} confidence={exp.ice_confidence} ease={exp.ice_ease} />
                </td>
                <td className="px-6 py-3 font-mono text-xs text-slate-400">{exp.market}</td>
                <td className="px-6 py-3 font-mono text-xs text-slate-400">{exp.type}</td>
                <td className="px-6 py-3 text-right flex justify-end gap-3 items-center">
                  <button 
                    onClick={() => onEdit(exp)}
                    className="text-neon-blue hover:text-white font-medium text-xs uppercase tracking-wide transition-colors hover:drop-shadow-[0_0_5px_rgba(42,123,255,0.8)]"
                  >
                    {exp.locked ? 'Inspect' : 'Edit'}
                  </button>
                   <button 
                    onClick={(e) => handleDelete(e, exp.id)}
                    className="text-slate-600 hover:text-neon-red transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredExperiments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-slate-600 border-b border-white/5">
                  <div className="flex flex-col items-center gap-2">
                     <Search size={32} className="opacity-20" />
                     <span>No data nodes found.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-stroke bg-black/40 text-[10px] text-slate-500 flex justify-between uppercase tracking-widest font-mono">
        <span>Displaying {filteredExperiments.length} records</span>
        <span>SYS.VAULT.V1</span>
      </div>
    </div>
  );
};
