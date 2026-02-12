
import React, { useState } from 'react';
import { Layers, Database, Plus, Menu, User, BarChart2, AlertTriangle, Settings, ChevronRight, LogOut, Hexagon } from 'lucide-react';
import { Board, UserProfile } from '../types';
import { ProfileModal } from './ProfileModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'kanban' | 'vault' | 'analytics';
  setActiveTab: (tab: 'kanban' | 'vault' | 'analytics') => void;
  onNewExperiment: () => void;
  isMockMode?: boolean;
  onConnect?: () => void;
  // Board Props
  boards: Board[];
  activeBoardId: string;
  onSwitchBoard: (id: string) => void;
  onCreateBoard: () => void;
  onEditBoard: (board: Board) => void;
  // Profile Props
  userProfile: UserProfile | null;
  onUpdateProfile: (updates: Partial<UserProfile>, avatarFile?: File) => Promise<void>;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, onNewExperiment, isMockMode, onConnect,
  boards, activeBoardId, onSwitchBoard, onCreateBoard, onEditBoard,
  userProfile, onUpdateProfile, onLogout
}) => {
  
  const currentBoard = boards.find(b => b.id === activeBoardId);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const displayName = userProfile?.full_name || (isMockMode ? 'Guest User' : 'Set your name');
  const displayStatus = isMockMode ? 'Demo Mode' : (userProfile?.full_name ? 'Online' : 'Incomplete Profile');

  const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 border border-transparent ${activeTab === id ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden flex-col md:flex-row text-white">
      
      {/* Mock Mode Banner */}
      {isMockMode && (
        <div className="bg-neon-purple/20 border-b border-neon-purple/30 text-neon-purple text-xs font-medium px-4 py-2 flex justify-between items-center md:hidden shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>Demo Mode</span>
          </div>
          <button onClick={onConnect} className="bg-neon-purple/20 hover:bg-neon-purple/40 px-2 py-1 rounded text-[10px] uppercase tracking-wide border border-neon-purple/50">
            Connect DB
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-bg-0/50 backdrop-blur-xl border-r border-stroke shrink-0 relative z-20">
        <div className="p-5 flex items-center justify-between border-b border-stroke">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-neon-cyan/20 rounded-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-500 border border-neon-cyan/50"></div>
              <Hexagon size={20} className="text-neon-cyan relative z-10" />
            </div>
            <h1 className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue drop-shadow-neon">
              GROWTH OPS
            </h1>
          </div>
        </div>
        
        {/* Board Switcher Section */}
        <div className="px-4 pt-6 pb-2">
           <div className="flex items-center justify-between text-[10px] font-bold text-neon-blue/60 uppercase tracking-[0.2em] mb-3 px-2">
             <span>System Boards</span>
             <button onClick={onCreateBoard} className="text-neon-cyan hover:text-white transition-colors">
               <Plus size={14} />
             </button>
           </div>
           <div className="space-y-1">
             {boards.map(board => (
               <div key={board.id} className="group flex items-center gap-2">
                 <button 
                  onClick={() => onSwitchBoard(board.id)}
                  className={`flex-1 text-left px-3 py-2 rounded text-sm transition-all truncate flex items-center gap-3 border border-transparent ${activeBoardId === board.id ? 'bg-white/5 text-white border-white/10 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                 >
                   <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${activeBoardId === board.id ? 'bg-neon-cyan text-neon-cyan' : 'bg-slate-600 text-slate-600'}`}></span>
                   {board.name}
                 </button>
                 <button 
                   onClick={() => onEditBoard(board)}
                   className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-neon-cyan transition-all"
                 >
                   <Settings size={12} />
                 </button>
               </div>
             ))}
           </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2">
          <div className="text-[10px] font-bold text-neon-blue/60 uppercase tracking-[0.2em] mb-3 mt-6 px-2">Interface</div>
          <TabButton id="kanban" icon={Layers} label="Board" />
          <TabButton id="vault" icon={Database} label="Vault" />
          <TabButton id="analytics" icon={BarChart2} label="Analytics" />
        </nav>

        {isMockMode && (
          <div className="mx-4 mb-4 p-3 bg-neon-purple/5 border border-neon-purple/20 rounded-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                <AlertTriangle size={40} className="text-neon-purple" />
             </div>
             <div className="flex items-start gap-2 mb-2 relative z-10">
               <div className="text-xs text-neon-purple/80">
                 <p className="font-bold uppercase tracking-wide mb-1">Demo Protocol</p>
                 <p className="opacity-70 text-[10px]">Local storage only.</p>
               </div>
             </div>
             <button 
               onClick={onConnect}
               className="w-full py-1.5 bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-purple border border-neon-purple/50 text-[10px] uppercase font-bold rounded transition-colors relative z-10"
             >
               Initialize DB Connection
             </button>
          </div>
        )}

        <div className="p-4 border-t border-stroke flex items-center gap-2 bg-black/20">
           <button 
             onClick={() => setIsProfileOpen(true)}
             className="flex-1 flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-left group"
           >
             <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-stroke group-hover:border-neon-cyan group-hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all">
               {userProfile?.avatar_url ? (
                 <img src={userProfile.avatar_url} alt="Av" className="w-full h-full object-cover" />
               ) : (
                 <User size={16} className="text-neon-cyan" />
               )}
             </div>
             <div className="text-sm overflow-hidden flex-1">
               <p className="font-medium truncate font-mono text-xs">{displayName}</p>
               <p className="text-[10px] text-neon-green truncate flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_5px_currentColor] animate-pulse"></span>
                 {displayStatus}
               </p>
             </div>
             <Settings size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-neon-cyan" />
          </button>
          
          <div className="h-6 w-px bg-stroke mx-1"></div>
          
          <button 
             onClick={onLogout}
             className="p-2 text-slate-400 hover:text-neon-red hover:bg-neon-red/10 rounded transition-colors"
             title="Terminate Session"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-bg-0/80 backdrop-blur border-b border-stroke shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <span className="font-bold text-sm text-neon-cyan tracking-wider truncate max-w-[120px]">
               {currentBoard?.name}
             </span>
             <ChevronRight size={14} className="text-slate-600" />
             <span className="text-xs text-slate-400 uppercase tracking-wide">
               {activeTab}
             </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="text-slate-300 hover:text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>
        
        {/* Tab Switcher for Mobile */}
        <div className="md:hidden flex border-b border-stroke bg-bg-1 shrink-0">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'kanban' ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5' : 'border-transparent text-slate-500'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'vault' ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5' : 'border-transparent text-slate-500'}`}
          >
            Vault
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5' : 'border-transparent text-slate-500'}`}
          >
            Analytics
          </button>
        </div>

        {/* Toolbar Area */}
        <div className="h-16 border-b border-stroke bg-bg-0/40 backdrop-blur-sm px-6 flex items-center justify-between shrink-0">
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-bold text-white tracking-tight hidden md:block drop-shadow-md">
              {activeTab === 'kanban' ? currentBoard?.name : activeTab === 'vault' ? 'DATA VAULT' : 'ANALYTICS CORE'}
            </h2>
            <div className="flex items-center gap-2">
               {activeTab === 'kanban' && currentBoard?.description && (
                 <p className="text-[10px] text-neon-blue/70 uppercase tracking-widest hidden md:block mt-0.5">{currentBoard.description}</p>
               )}
               {(activeTab === 'vault' || activeTab === 'analytics') && currentBoard && (
                 <p className="text-[10px] text-slate-500 hidden md:block mt-0.5">SOURCE: <span className="font-semibold text-neon-cyan">{currentBoard.name}</span></p>
               )}
            </div>
          </div>
          
          <div className="flex gap-3 ml-auto">
             <button 
              onClick={onNewExperiment}
              className="tron-btn tron-btn-primary px-4 py-2 flex items-center gap-2"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Initialize Experiment</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onSave={onUpdateProfile}
        onLogout={onLogout}
      />
    </div>
  );
};
